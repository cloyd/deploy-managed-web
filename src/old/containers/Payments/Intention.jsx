import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Alert, Container } from 'reactstrap';

import { useFetch, usePrevious } from '../../hooks';
import { ButtonSettings } from '../../modules/Button';
import { DividerDouble } from '../../modules/Divider';
import { FormButtons } from '../../modules/Form';
import { Header } from '../../modules/Header';
import { Link } from '../../modules/Link';
import { ModalConfirm } from '../../modules/Modal';
import { PaymentByBank } from '../../modules/Payment';
import { useRolesContext } from '../../modules/Profile';
import { fetchAccounts } from '../../redux/assembly';
import {
  fetchIntention,
  getIntention,
  payIntention,
} from '../../redux/intention';
import { canCreatePayment, getProfile } from '../../redux/profile';
import { fetchProperty, getProperty } from '../../redux/property';
import {
  USER_TYPES,
  fetchTenant,
  getTenant,
  isSecondaryTenant,
} from '../../redux/users';
import { toPositive } from '../../utils';

const PaymentsIntentionComponent = ({
  canCreatePayment,
  currentRoleId,
  history,
  intention,
  intentionId,
  isLoading,
  isSecondaryTenant,
  role,
  assemblyAccounts,
  walletBalanceAmountCents,
  ...props
}) => {
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payingWalletId, setPayingWalletId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const prevIsLoading = usePrevious(isLoading);
  const prevIsSubmitting = usePrevious(isSubmitting);
  const assemblyWalletBalance = assemblyAccounts?.wallet?.balance;

  const { isCorporateUser, isManager, isOwner, isTenant, isPrincipal } =
    useRolesContext();
  const isAgencyUser = isManager || isCorporateUser || isPrincipal;

  const property = useMemo(
    () => (props.property?.id ? props.property : intention.property),
    [intention.property, props.property]
  );

  const isOwnerPayingMtechIntention = useMemo(
    () =>
      intention.isToBpayBiller &&
      intention.debtor === USER_TYPES.owner &&
      !intention.debtorHasDefaultMtechAccountSet,
    [intention]
  );

  // checks if intention can be paid by current user
  // managers/corporate users can "prioritize" payments on behalf of tenants/owners
  const hasPaymentAuthority = useMemo(
    () =>
      intention.isDraft &&
      ((role === intention.debtor && currentRoleId === intention.debtorId) ||
        isManager ||
        isCorporateUser),
    [currentRoleId, intention, isCorporateUser, isManager, role]
  );

  // TODO: double check logic for this
  const ownerCanPayByWallet = useMemo(() => {
    const hasPropertyPaymentAccount = props.property?.primaryOwner
      ? intention.debtorHasDefaultPaymentAccountSet
      : false;

    return (
      !intention.isToBpayBiller &&
      intention.debtor === USER_TYPES.owner &&
      !hasPropertyPaymentAccount
    );
  }, [
    intention.debtor,
    intention.debtorHasDefaultPaymentAccountSet,
    intention.isToBpayBiller,
    props.property,
  ]);

  // TODO: double check logic for this
  const tenantCanPayByWallet = useMemo(() => {
    const hasTenantPaymentAccount = intention.lease?.primaryTenant
      ? intention.debtorHasDefaultPaymentAccountSet
      : false;

    return (
      ['bpay', 'wallet'].includes(intention.paymentMethod) &&
      intention.debtor === USER_TYPES.tenant &&
      hasTenantPaymentAccount
    );
  }, [
    intention.debtor,
    intention.debtorHasDefaultPaymentAccountSet,
    intention.lease,
    intention.paymentMethod,
  ]);

  const hasPaymentMethod = useMemo(() => {
    const hasEnoughWalletCredit =
      props.property &&
      ownerCanPayByWallet &&
      props.property.floatBalanceAmountCents >= Math.abs(intention.amountCents);

    return (
      hasEnoughWalletCredit ||
      intention.debtorHasDefaultPaymentAccountSet ||
      (intention.isToBpayBiller && intention.debtorHasDefaultMtechAccountSet)
    );
  }, [intention, ownerCanPayByWallet, props.property]);

  const payingWalletsEndpoint = useMemo(() => {
    const { canFetchPayingWallets, id } = intention;

    if (isOwner && canFetchPayingWallets && id) {
      return `/intentions/${id}/paying_wallets`;
    }
  }, [isOwner, intention]);

  const handleCancel = useCallback(() => history.goBack(), [history]);

  const handleSubmit = useCallback(() => {
    if (
      intention.lease &&
      (intention.isTaskBpayOut ||
        !intention.isBpay ||
        ownerCanPayByWallet ||
        tenantCanPayByWallet)
    ) {
      setIsSubmitting(true);
      dispatch(payIntention({ intentionId, payingWalletId }));
    }
  }, [
    dispatch,
    intention.lease,
    intention.isTaskBpayOut,
    intention.isBpay,
    ownerCanPayByWallet,
    tenantCanPayByWallet,
    intentionId,
    payingWalletId,
  ]);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const [payingWallets] = useFetch(payingWalletsEndpoint);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (prevIsSubmitting && prevIsLoading && !isLoading) {
      handleCancel();
    }
  }, [isLoading, prevIsLoading, prevIsSubmitting]);

  useEffect(() => {
    if ((isOwner || isManager) && intention?.property) {
      dispatch(fetchProperty({ propertyId: intention.property.id }));
    }
  }, [intention, isOwner, isManager]);

  useEffect(() => {
    // if the debtor is a tenant
    if (intentionId && intention?.debtor === USER_TYPES.tenant) {
      if (role === USER_TYPES.tenant) {
        // assembly accounts are only fetched for when the debtor is a tenant and is logged in as one
        dispatch(fetchAccounts());
      } else if (
        role !== USER_TYPES.tenant &&
        intention?.paymentMethod === 'bpay'
      ) {
        // tenant is fetched to get wallet amount when tenant pays via bpay and logged in user is not a tenant
        dispatch(fetchTenant({ tenantId: intention?.debtorId }));
      }
    }
  }, [intentionId, intention?.debtor]);

  useEffect(() => {
    if (intentionId) {
      dispatch(fetchIntention({ intentionId }));
    }
  }, [intentionId]);
  /* eslint-disable react-hooks/exhaustive-deps */

  const ownerPaysUsingWallet =
    intention.debtor === 'owner' &&
    ['bpay', 'wallet'].includes(intention.paymentMethod);
  // get wallet balance
  // owner has it from property
  const ownerWalletBalance = props.property?.floatBalanceAmountCents;

  const isPayButtonDisabled = () => {
    if (
      !(hasPaymentAuthority && hasPaymentMethod && !isOwnerPayingMtechIntention)
    ) {
      return true;
    } else if (ownerPaysUsingWallet) {
      return (
        ownerWalletBalance < intention?.formatted?.debtor?.totalAmountCents
      );
    } else {
      return (
        ['bpay', 'wallet'].includes(intention.paymentMethod) &&
        (walletBalanceAmountCents === undefined ||
          walletBalanceAmountCents < toPositive(intention.tenantAmountCents))
      );
    }
  };

  const walletBalance = useMemo(() => {
    if (ownerPaysUsingWallet) {
      return ownerWalletBalance;
    }
    return walletBalanceAmountCents || assemblyWalletBalance;
  }, [
    ownerPaysUsingWallet,
    ownerWalletBalance,
    walletBalanceAmountCents,
    assemblyWalletBalance,
  ]);

  return (
    <>
      <Header title="Payment Invoice">
        {canCreatePayment && !isSecondaryTenant && (
          <Link
            data-testid="payment-settings-btn"
            to={
              isOwner && property?.id
                ? `/property/${property.id}/settings`
                : '/payments/settings'
            }>
            <ButtonSettings>Payment Settings</ButtonSettings>
          </Link>
        )}
      </Header>
      {!isLoading && property && intention.id && (
        <Container className="pt-2">
          {!hasPaymentMethod &&
            (['bpay', 'wallet'].includes(intention.paymentMethod)
              ? walletBalance !== undefined
              : true) && (
              <Alert
                color="danger"
                data-testid="no-payment-method-alert"
                isOpen>
                Please make sure there is a payment method added
                {!isTenant &&
                  ' or there is enough money in the property wallet'}
                .
              </Alert>
            )}
          {isOwnerPayingMtechIntention && (
            <Alert color="danger" isOpen>
              Please note that {isOwner ? 'you have' : 'this owner has'}{' '}
              selected &#34;Pay my own bills&#34; in{' '}
              {isOwner ? 'your' : 'their'} Payment Settings.
            </Alert>
          )}
          <PaymentByBank
            address={property.address}
            canShowPayByWallet={ownerCanPayByWallet || tenantCanPayByWallet}
            intention={intention}
            tenantWalletBalance={walletBalance}
            payingWallets={payingWallets}
            onChangePayingWallet={setPayingWalletId}
          />
          <DividerDouble />
          {isTenant && (
            <div style={{ paddingLeft: '0.75rem' }}>
              <strong>
                {isSecondaryTenant
                  ? 'Primary tenant BPAY details'
                  : 'BPAY details'}
              </strong>
              <br />
              <small>
                BPay Code: {intention?.lease?.primaryTenant?.bpayBillerCode}
              </small>
              <br />
              <small>
                BPay Reference: {intention?.lease?.primaryTenant?.bpayReference}
              </small>
            </div>
          )}
          <FormButtons
            isOverlayed
            btnSubmit={{
              text:
                intention.debtor === USER_TYPES.tenant && isAgencyUser
                  ? 'Prioritise now'
                  : 'Pay now',
              color: intention.isOverdue ? 'danger' : 'primary',
            }}
            isDisabled={isPayButtonDisabled()}
            isValid={true}
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
            onSubmit={
              intention.debtor === USER_TYPES.tenant
                ? handleOpenModal
                : handleSubmit
            }
          />
          <ModalConfirm
            body="You are flagging this item as a priority payment. This will be processed by our automated system shortly."
            btnSubmit={{ color: 'primary', text: 'Okay' }}
            btnCancel={{ text: 'Cancel' }}
            isOpen={isOpen}
            title="Are you sure?"
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </Container>
      )}
    </>
  );
};

PaymentsIntentionComponent.propTypes = {
  canCreatePayment: PropTypes.bool.isRequired,
  currentRoleId: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  intention: PropTypes.object.isRequired,
  intentionId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSecondaryTenant: PropTypes.bool,
  property: PropTypes.object,
  role: PropTypes.string.isRequired,
  assemblyAccounts: PropTypes.object,
  walletBalanceAmountCents: PropTypes.number,
};

const mapStateToProps = (state, props) => {
  const { intentionId } = props.match.params;
  const intention = getIntention(state.intention, intentionId);
  const profile = getProfile(state.profile);
  const { walletBalanceAmountCents } = getTenant(
    state.users,
    intention?.debtorId
  );

  return {
    intention,
    intentionId,
    canCreatePayment: canCreatePayment(state.profile),
    currentRoleId: profile.id,
    isLoading: state.notifier.isLoading,
    isSecondaryTenant: isSecondaryTenant(state.users, profile.id),
    property: getProperty(state.property, intention.property?.id),
    role: profile.role,
    assemblyAccounts: state.assembly,
    walletBalanceAmountCents,
  };
};

// TODO: remove connect
export const PaymentsIntention = connect(
  mapStateToProps,
  null
)(PaymentsIntentionComponent);
