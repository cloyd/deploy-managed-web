import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';

import { Header } from '../../modules/Header';
import {
  TenantBankAccounts,
  TenantCreditCards,
  TenantDirectPayment,
} from '../../modules/Payment';
import { TenantDefaultPayments } from '../../modules/Payment/TenantDefaultPayments';
import {
  useFetchAccounts,
  useSetDefaultPaymentAccount,
  useSetDisbursementAccount,
} from '../../modules/Payment/hooks/use-assembly';
import { selectProfileData, selectUserFingerprint } from '../../redux/profile';
import { selectUser } from '../../redux/users/selectors';

export const TenantPaymentSettings = () => {
  const {
    bpayBillerCode,
    bpayReference,
    virtualAccount,
    canGenerateVirtualAccount,
    id: userId,
  } = useSelector(selectUser);
  const { hostedFieldsEnv } = useSelector(selectProfileData);
  const fingerprint = useSelector(selectUserFingerprint);
  const [accountForm, setAccountForm] = useState('');

  const { data, refetch, isFetching, isLoading } = useFetchAccounts();

  const { mutate: setDefaultPayment } = useSetDefaultPaymentAccount();

  const { mutate: setDisbursement } = useSetDisbursementAccount();

  const closeAccountForm = useCallback(() => {
    setAccountForm('');
  }, []);

  const openAddBankAccountForm = useCallback(() => {
    setAccountForm('bank');
  }, []);

  const openAddCreditCardForm = useCallback(() => {
    setAccountForm('credit');
  }, []);

  const handleChangePaymethod = useCallback(
    (promisepayId, fetchAfter = true) => {
      setDefaultPayment({
        promisepayId,
        fingerprint,
        ...(fetchAfter && { callback: () => refetch() }),
      });
    },
    [fingerprint, refetch, setDefaultPayment]
  );

  const handleChangeDisbursement = useCallback(
    (promisepayId, fetchAfter = true) => {
      setDisbursement({
        promisepayId,
        fingerprint,
        ...(fetchAfter && { callback: () => refetch() }),
      });
    },
    [fingerprint, refetch, setDisbursement]
  );

  const handlePayByBpay = useCallback(() => {
    setDefaultPayment({
      promisepayId: null,
      fingerprint,
      callback: () => refetch(),
    });
  }, [fingerprint, refetch, setDefaultPayment]);

  return (
    <>
      <Header
        className="mb-0 sticky-top"
        title="Payment Settings"
        subHeaderComponent={
          <TenantDefaultPayments
            isAccountsFetching={isFetching}
            isAccountsLoading={isLoading}
            isPayByBpay={data?.isPayByBpay}
            bankAccounts={data?.bank}
            creditCards={data?.card}
          />
        }
        isManualDismiss
      />
      <Container>
        <TenantBankAccounts
          isAccountsFetching={isFetching}
          isAccountsLoading={isLoading}
          list={data?.bank}
          hasDisbursementAccount={data?.disbursementAccount !== null}
          hasDefaultPayment={data?.hasDefaultPayment}
          onChangeDisbursement={handleChangeDisbursement}
          onChangePaymentMethod={handleChangePaymethod}
          hostedFieldsEnv={hostedFieldsEnv}
          fingerprint={fingerprint}
          // props for opening/closing add form
          handleHideForm={closeAccountForm}
          handleShowForm={openAddBankAccountForm}
          isFormOpen={accountForm === 'bank'}
        />
        <TenantCreditCards
          isAccountsFetching={isFetching}
          isAccountsLoading={isLoading}
          list={data?.card}
          hasDefaultPayment={data?.hasDefaultPayment}
          onChangePaymentMethod={handleChangePaymethod}
          hostedFieldsEnv={hostedFieldsEnv}
          fingerprint={fingerprint}
          // props for opening/closing add form
          handleHideForm={closeAccountForm}
          handleShowForm={openAddCreditCardForm}
          isFormOpen={accountForm === 'credit'}
        />
        <TenantDirectPayment
          userId={userId}
          isAccountsFetching={isFetching}
          isAccountsLoading={isLoading}
          isPayByBpay={data?.isPayByBpay}
          onTogglePayByBpay={handlePayByBpay}
          bpayDetails={{
            bpayBillerCode,
            bpayReference,
          }}
          directPaymentDetails={{
            virtualAccount,
            canGenerateVirtualAccount,
          }}
        />
      </Container>
    </>
  );
};

TenantPaymentSettings.defaultProps = {};
TenantPaymentSettings.propTypes = {};
