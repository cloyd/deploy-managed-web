import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import { Alert, Container } from 'reactstrap';

import { useToggle } from '../../hooks';
import { DividerDouble } from '../../modules/Divider';
import {
  ModalConfirmAccount,
  ModalConfirmAccountDestroy,
} from '../../modules/Modal';
import { PaymentOptions } from '../../modules/Payment';
import {
  useComposePaymentSettings,
  usePaymentCallbacks,
} from '../../modules/Payment/hooks';
import {
  PropertyDisbursementAccount,
  PropertyPaymentAccount,
} from '../../modules/Property';
import SmsVerification from '../../modules/SmsVerification';
import {
  createBank,
  createCard,
  destroyAccount,
  fetchAccounts,
  fetchPropertyAccounts,
  getAvailableDisbursementAccounts,
  getDisbursementAccount,
  getPaymentAccount,
  getPaymentAccounts,
  setAutoPay,
  setDisbursementProperty,
  setNoDefaultPaymentProperty,
  setPaymentProperty,
} from '../../redux/assembly';
import { hasError } from '../../redux/notifier';
import { getProfile, selectIsInvalidPhoneNumber } from '../../redux/profile';
import { getPropertyOwnership } from '../../redux/property';
import { getUser } from '../../redux/users';

const PropertySettingsComponent = (props) => {
  const {
    disbursementAccount,
    fetchAccounts,
    fetchPropertyAccounts,
    hasDefaultPayment,
    hasError,
    isAutoPay,
    isLoading,
    owner,
    ownership,
    paymentAccount,
    paymentAccounts,
    property,
    setAutoPay,
    setDisbursementProperty,
    setNoDefaultPaymentProperty,
    setPaymentProperty,
    userProfile,
    isAccountDataStillLoading,
    isDataNullAfterAccountFetching,
  } = props;

  const isInvalidPhoneNumber = useSelector(selectIsInvalidPhoneNumber);

  const fingerprint = useMemo(() => `owner:${owner.id}`, [owner.id]);

  const [modalState, toggleModal] = useToggle();

  const [state, actions] = useComposePaymentSettings();
  const {
    handleCancel,
    handleCreate,
    handleDestroy,
    handleSubmitCreate,
    handleSubmitDestroy,
  } = usePaymentCallbacks({
    ...props,
    fingerprint,
    state,
    actions,
    verification: {
      state: modalState,
      openVerificationModal: toggleModal,
    },
  });

  const show = useMemo(
    () => ({
      propertyDisbursementAccount: !isLoading && ownership.percentageSplit > 0,
      disbursementSelect:
        state.isEditing.disbursement ||
        (!disbursementAccount &&
          (!isAccountDataStillLoading || isDataNullAfterAccountFetching)),
      paymentSelect: state.isEditing.default,
      modalSubmitCreate: state.submitAction.formType === 'create',
      modalSubmitDestroy: state.submitAction.formType === 'destroy',
      autoPayOptions: hasDefaultPayment,
    }),
    [
      disbursementAccount,
      hasDefaultPayment,
      isLoading,
      ownership.percentageSplit,
      state.isEditing.disbursement,
      state.isEditing.default,
      state.submitAction.formType,
      isAccountDataStillLoading,
      isDataNullAfterAccountFetching,
    ]
  );

  const withValues = useCallback(
    (values = {}) => ({
      ...values,
      ownerId: owner.id,
      propertyId: property.id,
    }),
    [owner.id, property.id]
  );

  const handleIsEditing = useCallback(
    (type) => () => {
      actions.setIsEditing({ ...type });
    },
    [actions]
  );

  const handleSetAccount = useCallback(
    (setter) => (values) => {
      toggleModal({
        isOpen: true,
        callback: (securityCode) => {
          setter({ ...withValues(values), securityCode });
          actions.resetIsEditing();
          // to enable updating the autopay flag we send list accounts again
          // needs refactoring of how auto-pay flag is communicated
          if (owner.id && setter === setPaymentProperty) {
            fetchAccounts({ ownerId: owner.id, propertyId: property.id });
          }
        },
      });
    },
    [
      actions,
      fetchAccounts,
      owner.id,
      property.id,
      setPaymentProperty,
      withValues,
      toggleModal,
    ]
  );

  const handleChangeType = useCallback(
    (nextType) => () => {
      actions.resetSubmitAction();
      if (nextType === 'noDefaultPayment') {
        handleSetAccount(setNoDefaultPaymentProperty)({
          promisepayId: null,
        });
      } else {
        actions.setType(nextType);
      }
    },
    [actions, handleSetAccount, setNoDefaultPaymentProperty]
  );

  const handlePropertyAutoPay = useCallback(() => {
    actions.hideModal();
    setAutoPay({ autoPay: !isAutoPay, fingerprint, propertyId: property.id });
  }, [actions, setAutoPay, isAutoPay, property.id, fingerprint]);

  useEffect(() => {
    fetchAccounts({ ownerId: owner.id, propertyId: property.id });
  }, [fetchAccounts, owner.id, property.id]);

  useEffect(() => {
    const { propertyId, ownerId } = withValues();
    !!propertyId && !!ownerId && fetchPropertyAccounts({ propertyId, ownerId });
  }, [fetchPropertyAccounts, withValues]);

  return (
    <>
      {isInvalidPhoneNumber && (
        <Alert color="warning" style={{ marginTop: '-1rem' }}>
          Warning: Your phone number is either empty or invalid. Please update
          your phone number before changing your bank account details. To do
          this, please{' '}
          <a className="alert-link" href="/profile">
            click here
          </a>{' '}
          to update your phone number in your profile.
        </Alert>
      )}
      <Container>
        {show.propertyDisbursementAccount && (
          <>
            <PropertyDisbursementAccount
              isAssemblyLoading={isLoading}
              account={disbursementAccount}
              onDestroy={handleDestroy}
              onEnable={handleSetAccount(setDisbursementProperty)}
              onSetDefault={handleSetAccount(setDisbursementProperty)}
              onChange={
                !state.isEditing.disbursement
                  ? handleIsEditing({ disbursement: true })
                  : undefined
              }
              ownership={ownership}
              hasError={hasError}
              hasAgreedDda={!!userProfile.hasAgreedDda}
              selectorOnCancel={
                disbursementAccount
                  ? handleIsEditing({ disbursement: false })
                  : undefined
              }
              selectorOnSubmit={handleCreate(
                'bank',
                'disbursement',
                withValues()
              )}
              isShowAccountSelector={show.disbursementSelect}
              user={owner}
              fingerprint={fingerprint}
              hostedFieldsEnv={userProfile.hostedFieldsEnv}
            />
            <DividerDouble />
          </>
        )}
        {!isLoading && (
          <PropertyPaymentAccount
            isAssemblyLoading={isLoading}
            isShowAccountSelector={show.paymentSelect}
            account={paymentAccount}
            accounts={paymentAccounts}
            percentageSplit={ownership.percentageSplit}
            hasAgreedDda={!!userProfile.hasAgreedDda}
            hasError={hasError}
            onAccountTypeChange={handleChangeType}
            onAccountChange={
              !state.isEditing.default
                ? handleIsEditing({ default: true })
                : undefined
            }
            onAccountEnable={handleSetAccount(setPaymentProperty)}
            onAccountDestroy={handleDestroy}
            onAccountSet={handleSetAccount(setPaymentProperty)}
            onNewAccountCancel={handleIsEditing({ default: false })}
            onNewAccountEnable={handleSetAccount(setPaymentProperty)}
            onNewAccountSubmit={handleCreate(
              state.type,
              'default',
              withValues()
            )}
            user={owner}
            type={state.type}
            fingerprint={fingerprint}
            hostedFieldsEnv={userProfile.hostedFieldsEnv}
          />
        )}
        {show.modalSubmitCreate && (
          <ModalConfirmAccount
            account={state.submitAction.params}
            isOpen={state.isModalOpen}
            onCancel={handleCancel}
            onSubmit={handleSubmitCreate}
            size={'md'}
          />
        )}
        {show.modalSubmitDestroy && (
          <ModalConfirmAccountDestroy
            account={state.submitAction.params}
            isOpen={state.isModalOpen}
            onCancel={handleCancel}
            onSubmit={handleSubmitDestroy}
            size={'md'}
          />
        )}
        {show.autoPayOptions && (
          <div className="mb-3">
            <DividerDouble />
            <PaymentOptions
              isAutoPay={isAutoPay}
              onChange={handlePropertyAutoPay}
            />
          </div>
        )}
        <SmsVerification modalState={modalState} toggle={toggleModal} />
      </Container>
    </>
  );
};

PropertySettingsComponent.propTypes = {
  createBank: PropTypes.func.isRequired,
  createCard: PropTypes.func.isRequired,
  destroyAccount: PropTypes.func.isRequired,
  disbursementAccount: PropTypes.object,
  disbursementAccounts: PropTypes.array,
  fetchAccounts: PropTypes.func.isRequired,
  fetchPropertyAccounts: PropTypes.func.isRequired,
  hasDefaultPayment: PropTypes.bool,
  hasError: PropTypes.bool.isRequired,
  isAutoPay: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  owner: PropTypes.object.isRequired,
  ownership: PropTypes.object.isRequired,
  paymentAccount: PropTypes.object,
  paymentAccounts: PropTypes.array,
  property: PropTypes.object.isRequired,
  setAutoPay: PropTypes.func.isRequired,
  setDisbursementProperty: PropTypes.func.isRequired,
  setNoDefaultPaymentProperty: PropTypes.func.isRequired,
  setPaymentProperty: PropTypes.func.isRequired,
  userProfile: PropTypes.object,
  isAccountDataStillLoading: PropTypes.bool,
  isDataNullAfterAccountFetching: PropTypes.bool,
};

const mapStateToProps = (state, props) => {
  const { property } = props;
  const userProfile = getProfile(state.profile);
  const owner = getUser(state.users, userProfile);

  const disbursementAccount = getDisbursementAccount(state.assembly, {
    ownerId: owner.id,
    propertyId: property.id,
  });

  const accountFetchHasData =
    state.assembly.disbursements &&
    Object.keys(state.assembly.disbursements).length > 1;

  const dataFetchInProgress =
    state.assembly.data && Object.keys(state.assembly.data).length === 0;

  const isDataNullAfterAccountFetching = !(
    state.assembly.disbursements &&
    state.assembly.disbursements[`${owner.id}-${property.id}`]
  );

  const disbursementAccounts = getAvailableDisbursementAccounts(
    state.assembly,
    {
      ...(disbursementAccount && {
        promisepayId: disbursementAccount.promisepayId,
      }),
    }
  );

  const paymentAccount = getPaymentAccount(state.assembly, {
    ownerId: owner.id,
    propertyId: property.id,
  });

  const ownership = getPropertyOwnership(state.property, {
    ownerId: owner.id,
    propertyId: property.id,
  });

  return {
    disbursementAccount,
    disbursementAccounts,
    hasDefaultPayment: state.assembly.hasDefaultPayment,
    hasError: hasError(state),
    isAutoPay: state.assembly.isAutoPay,
    isLoading: state.assembly.isLoading,
    owner,
    ownership,
    paymentAccount,
    paymentAccounts: getPaymentAccounts(state.assembly),
    userProfile,
    isAccountDataStillLoading: accountFetchHasData && dataFetchInProgress,
    isDataNullAfterAccountFetching: isDataNullAfterAccountFetching,
  };
};

const mapDispatchToProps = {
  createBank,
  createCard,
  destroyAccount,
  fetchAccounts,
  fetchPropertyAccounts,
  setDisbursementProperty,
  setNoDefaultPaymentProperty,
  setPaymentProperty,
  setAutoPay,
};

export const PropertySettings = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertySettingsComponent);
