import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'reactstrap';

import { CardWalletBalance } from '../../modules/Card';
import { Header } from '../../modules/Header';
import { BankListModal, WithdrawModal } from '../../modules/Modal';
import { selectProfileData } from '../../redux/profile';
import {
  fetchTenant,
  selectIsUsersLoading,
  selectUser,
} from '../../redux/users';
import { toCents } from '../../utils';
import { PendingWalletTransactions } from './PendingWalletTransactions';
import { WalletTransactions } from './WalletTransactions';
import './style.scss';
import {
  QUERY_KEYS,
  useDisburseWalletBalance,
  useVerifyWalletDisburse,
} from './useWalletWithdrawal';

const INITIAL_STATE = {
  selectBank: false,
  indicateAmount: false,
  confirmWithdrawal: false,
  smsVerification: false,
};

const modalStateReducer = (state, action) => {
  switch (action.type) {
    case 'selectBank':
      return {
        ...state,
        selectBank: !state.selectBank,
      };
    case 'indicateAmount':
      return {
        ...state,
        selectBank: false,
        indicateAmount: !state.indicateAmount,
      };
    case 'confirmWithdrawal':
      return {
        ...state,
        confirmWithdrawal: !state.confirmWithdrawal,
      };
    case 'smsVerification':
      return {
        ...state,
        smsVerification: !state.smsVerification,
      };
    case 'reset':
      return INITIAL_STATE;
    default:
      return state;
  }
};

export const TenantWallet = ({ history }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const { id: profileId, isAuthyEnabled } = useSelector(selectProfileData);
  const isUserLoading = useSelector(selectIsUsersLoading);
  const [modalState, setModalState] = useReducer(
    modalStateReducer,
    INITIAL_STATE
  );

  const [amount, setAmount] = useState(0);
  const [bankAccountId, setBankAccountId] = useState('');

  const {
    mutate: disburseWalletBalance,
    error: disburseError,
    isLoading: isDisbursingBalance,
    data,
    isSuccess,
  } = useDisburseWalletBalance();

  const {
    data: verifyWalletBalanceData,
    refetch: verifyWalletBalance,
    isFetching: isVerifyingWallet,
    error: verifyWalletError,
  } = useVerifyWalletDisburse();

  useEffect(() => {
    dispatch(fetchTenant({ tenantId: profileId }));
  }, [dispatch, profileId]);

  // send 2FA code
  const onConfirmIdentity = (authyToken = 0) => {
    if (authyToken !== 0) {
      setAmount(0);
      disburseWalletBalance({
        id: profileId,
        amountInCents: toCents(amount),
        bankAccountId: parseInt(bankAccountId),
        authyToken,
      });
    }
  };

  // confirm withdrawal
  const onConfirmWithdrawal = useCallback(() => {
    setModalState({ type: 'smsVerification' });
  }, []);

  // open confirmation modal
  useEffect(() => {
    if (
      typeof verifyWalletBalanceData?.totalAmountWithFeesInCents === 'number' &&
      amount > 0
    ) {
      // if wallet amount - fees to pay is less than amount to withdraw
      if (
        user?.walletBalanceAmountCents -
          verifyWalletBalanceData.totalAmountWithFeesInCents <
        toCents(amount)
      ) {
        setModalState({ type: 'confirmWithdrawal' });
      } else {
        onConfirmWithdrawal();
      }
    }
  }, [
    amount,
    disburseWalletBalance,
    profileId,
    user.walletBalanceAmountCents,
    verifyWalletBalance,
    verifyWalletBalanceData,
    bankAccountId,
    onConfirmWithdrawal,
  ]);

  useEffect(() => {
    if (verifyWalletError || disburseError) {
      setModalState({ type: 'reset' });
    }
  }, [verifyWalletError, disburseError]);

  useEffect(() => {
    if (data && isSuccess) {
      setModalState({ type: 'reset' });
      queryClient.invalidateQueries(QUERY_KEYS.TRANSACTIONS);
    }
  }, [data, queryClient, isSuccess]);

  const toggleResetModal = useCallback(() => {
    setModalState({ type: 'reset' });
    setAmount(0);
  }, []);

  const toggleBankModal = useCallback(() => {
    setModalState({ type: 'selectBank' });
    setBankAccountId('');
  }, []);

  // call api to compute withdrawal amount against pending bills
  const onConfirmAmount = useCallback(({ amount }) => {
    setAmount(amount);
    verifyWalletBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header title="My Wallet" isLoading={false} />
      <Container className="mt-3 wrapper filter-blur">
        <div>
          <CardWalletBalance
            amountCents={user?.walletBalanceAmountCents}
            toggle={toggleBankModal}
            isLoading={isUserLoading}
            isAuthyEnabled={isAuthyEnabled}
            isTenant
          />
        </div>
        <PendingWalletTransactions />
        <WalletTransactions history={history} />
      </Container>
      {modalState?.selectBank && (
        <BankListModal
          isOpen={modalState?.selectBank}
          setIsOpenModal={setModalState}
          toggleModal={toggleBankModal}
          bankAccountId={bankAccountId}
          setBankAccountId={setBankAccountId}
        />
      )}
      {modalState?.indicateAmount && (
        <WithdrawModal
          isOpen={modalState}
          toggleResetModal={toggleResetModal}
          onConfirmAmount={onConfirmAmount}
          onConfirmWithdrawal={onConfirmWithdrawal}
          // eslint-disable-next-line react/jsx-no-bind
          onConfirmIdentity={onConfirmIdentity}
          amountCents={user?.walletBalanceAmountCents}
          isLoading={isVerifyingWallet || isDisbursingBalance}
          billsToPayAmount={verifyWalletBalanceData?.totalAmountWithFeesInCents}
          bankAccountId={bankAccountId}
        />
      )}
    </>
  );
};

TenantWallet.propTypes = {
  history: PropTypes.object,
};
TenantWallet.defaultProps = {};
