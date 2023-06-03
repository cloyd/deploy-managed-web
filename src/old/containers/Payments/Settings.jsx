import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Container } from 'reactstrap';

import { DividerDouble } from '../../modules/Divider';
import { Header } from '../../modules/Header';
import {
  ModalConfirm,
  ModalConfirmAccount,
  ModalConfirmAccountDestroy,
} from '../../modules/Modal';
import {
  PaymentAccounts,
  PaymentAutomateSelector,
  PaymentDefault,
  PaymentDisbursement,
  PaymentSelector,
} from '../../modules/Payment';
import {
  useComposePaymentSettings,
  usePaymentCallbacks,
} from '../../modules/Payment/hooks';
import { useRolesContext } from '../../modules/Profile';
import {
  createBank,
  createCard,
  destroyAccount,
  enableDisbursement,
  enablePayment,
  fetchAccounts,
  getBankAccounts,
  getDisbursementAccount,
  getPaymentAccount,
  getPaymentAccounts,
  hasDefaultAccount,
  hasDisbursementAccount,
  setDisbursement,
  setNoDefaultPayment,
  setPayment,
} from '../../redux/assembly';
import { hasError } from '../../redux/notifier';
import { getProfile, getUserFingerprint } from '../../redux/profile';
import { fetchProperties, getProperties } from '../../redux/property';
import {
  createVirtualAccount,
  getUser,
  isSecondaryTenant,
} from '../../redux/users';

const getDisabledStyle = (isDisabled) =>
  isDisabled ? { opacity: 0.25, pointerEvents: 'none' } : null;

/**
 * Payment settings for onboarded users who have role:
 * - External Creditor (tradie)
 * - Tenant (primary, secondary)
 * - Principal Manager
 *
 * Owners set payment settings via property settings
 */
const ContainerComponent = (props) => {
  const {
    disbursementAccount,
    disbursementAccounts,
    enablePayment,
    enableDisbursement,
    fetchAccounts,
    fetchProperties,
    hasDefault,
    hasDefaultPayment,
    hasDisbursement,
    hasError,
    isAutoPay,
    isLoading,
    isPayByBpay,
    isSecondaryTenant,
    paymentAccount,
    paymentAccounts,
    profile,
    properties,
    setDisbursement,
    setPayment,
    setNoDefaultPayment,
    user,
    fingerprint,
    createVirtualAccount,
  } = props;

  const history = useHistory();
  const location = useLocation();

  const { isExternalCreditor, isTenant, isPrincipal } = useRolesContext();

  const [state, actions] = useComposePaymentSettings();
  const {
    handleCancel,
    handleCreate,
    handleDestroy,
    handleSubmitCreate,
    handleSubmitDestroy,
  } = usePaymentCallbacks({ ...props, state, actions });

  const isEditingAny = useMemo(
    () => state.isEditing.default || state.isEditing.disbursement,
    [state.isEditing]
  );

  const show = useMemo(() => {
    const showDefault =
      (isPrincipal || (isTenant && !isSecondaryTenant)) &&
      !state.isEditing.disbursement;

    const showDisbursement =
      (isTenant || isExternalCreditor || isPrincipal) &&
      !state.isEditing.default;
    return {
      default: showDefault,
      defaultPaymentSelector:
        showDefault && (!hasDefaultPayment || state.isEditing.default),
      disbursement: showDisbursement,
      disbursementSelector:
        showDisbursement && (!hasDisbursement || state.isEditing.disbursement),
      divider: !isEditingAny,
      modalSubmitBpay: isTenant && state.type === 'bpay' && !!state.typePending,
      modalSubmitCreate: state.submitAction.formType === 'create',
      modalSubmitDestroy: state.submitAction.formType === 'destroy',
    };
  }, [
    hasDefaultPayment,
    hasDisbursement,
    isEditingAny,
    isExternalCreditor,
    isPrincipal,
    isSecondaryTenant,
    isTenant,
    state,
  ]);

  const submitDefault = useCallback(
    ({ key, params = {} }) => {
      const action = {
        default: setPayment,
        disbursement: setDisbursement,
      };

      actions.changeBpayConfirm();
      action[key]({ ...params, fingerprint });
    },
    [setPayment, setDisbursement, actions, fingerprint]
  );

  const handleSubmitDefault = useCallback(() => {
    if (state.submitAction.key) {
      submitDefault({
        key: state.submitAction.key,
        params: state.submitAction.params,
      });
    }
  }, [state.submitAction, submitDefault]);

  const handleDefault = useCallback(
    (key) => (params) => {
      actions.setSubmitDefault({ key, params });

      // If the existing payment method is bpay then display confirmation modal
      // and set the submit method to handleDefaultConfirm for the modals
      // submit action. Otherwise just submit.
      if (state.type === 'bpay') {
        actions.showModal();
        actions.setTypePending(key);
      } else {
        submitDefault({ key, params });
      }
    },
    [actions, state, submitDefault]
  );

  const handleEnable = useCallback(
    (key) => (params) => {
      const action = {
        default: enablePayment,
        disbursement: enableDisbursement,
      };

      action[key]({ ...params, fingerprint });
      actions.resetType();
    },
    [actions, enablePayment, enableDisbursement, fingerprint]
  );

  const handleChangeBpayConfirm = useCallback(
    () =>
      state.submitAction.key
        ? handleSubmitDefault()
        : actions.changeBpayConfirm(),
    [actions, handleSubmitDefault, state.submitAction.key]
  );

  const handleChangeBpayCancel = useCallback(() => {
    actions.changeBpayCancel();
  }, [actions]);

  const handleChangeEditing = useCallback(
    (hash) => () => {
      hash ? history.push({ hash }) : history.goBack();
      actions.resetType();
    },
    [actions, history]
  );

  const handleChangeType = useCallback(
    (nextType) => () => {
      actions.resetSubmitAction();
      if (state.type === 'bpay') {
        actions.showModal();
        actions.setTypePending(nextType);
      } else {
        actions.setType(nextType);
        if (
          (nextType === 'bpay' && hasDefaultPayment) ||
          nextType === 'noDefaultPayment'
        ) {
          setNoDefaultPayment({ fingerprint });
          history.goBack(); // navigates from payments/settings/#default to payments/settings
        }
      }
    },
    [
      actions,
      hasDefaultPayment,
      setNoDefaultPayment,
      fingerprint,
      state,
      history,
    ]
  );

  useEffect(() => {
    if (!isLoading && isTenant) {
      isPayByBpay && actions.setType('bpay');
    }
  }, [actions, isLoading, isPayByBpay, isTenant]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (actions.setIsEditing) {
      actions.setIsEditing({
        default: location.hash === '#default',
        disbursement: location.hash === '#disbursement',
      });
    }
  }, [location.hash, location.pathName]);

  useEffect(() => {
    fetchAccounts();

    if (!isExternalCreditor && !isTenant) {
      fetchProperties();
    }
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const handleGenerateVirtualAccount = useCallback(() => {
    isTenant && createVirtualAccount({ tenantId: user.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, isTenant]);

  return (
    <>
      <Header title="Payment Settings" isLoading={props.isLoading} />
      <Container className="mt-3">
        {show.disbursement && (
          <PaymentDisbursement
            isLoading={isLoading}
            isSetup={false}
            properties={properties}
            style={getDisabledStyle(isLoading)}
            isSecondaryTenant={isSecondaryTenant}>
            {hasDisbursement && (
              <PaymentAccounts
                account={disbursementAccount}
                accounts={disbursementAccounts}
                isEditing={state.isEditing.disbursement}
                onChange={handleChangeEditing('disbursement')}
                onDestroy={handleDestroy}
                onEnable={handleEnable('disbursement')}
                onSetDefault={handleDefault('disbursement')}
              />
            )}
            {state.isEditing.disbursement && <DividerDouble />}
            {show.disbursementSelector && (
              <PaymentSelector
                account={disbursementAccount}
                hasAgreedDda={!!profile.hasAgreedDda}
                hasError={hasError}
                isLoading={isLoading}
                isSetup={false}
                type="bank"
                user={user}
                onEnable={handleEnable('disbursement')}
                onCancel={hasDisbursement ? handleChangeEditing() : null}
                onSubmit={handleCreate('bank', 'disbursement')}
                fingerprint={fingerprint}
                hostedFieldsEnv={profile.hostedFieldsEnv}
              />
            )}
            {show.divider && <DividerDouble />}
          </PaymentDisbursement>
        )}
        {show.default && (
          <PaymentDefault
            isAutoPay={isAutoPay}
            isLoading={isLoading}
            isSetup={false}
            style={getDisabledStyle(isLoading)}>
            {isTenant && (
              <PaymentAutomateSelector
                isAutoBills={user.autoBillPayment}
                isAutoRent={user.autoRentPayment}
                tenantId={user.id}
                isPayByBpay={isPayByBpay}
              />
            )}
            <PaymentAccounts
              account={paymentAccount}
              accounts={paymentAccounts}
              canPayViaBpay={isTenant}
              canPayViaRent={false}
              isEditing={state.isEditing.default}
              isEnablePromisepay
              user={isSecondaryTenant ? {} : user}
              onChange={handleChangeEditing('default')}
              onChangeType={handleChangeType}
              onDestroy={handleDestroy}
              onEnable={handleEnable('default')}
              onSetDefault={handleDefault('default')}
              onRemoveHash={handleChangeEditing()}
              handleGenerateVirtualAccount={handleGenerateVirtualAccount}
            />
            {state.isEditing.default && <DividerDouble />}
            {location.hash && (
              <PaymentSelector
                account={disbursementAccount}
                hasAgreedDda={!!profile.hasAgreedDda}
                hasError={hasError}
                isEnablePromisepay
                isLoading={isLoading}
                isSetup={false}
                isTenant={isTenant}
                type={state.type}
                types={
                  isPrincipal
                    ? ['card']
                    : isTenant
                    ? ['bank', 'bpay', 'card']
                    : ['bank', 'card']
                }
                onChange={handleChangeType}
                onCancel={hasDefault ? handleChangeEditing() : null}
                onEnable={handleEnable('default')}
                onSubmit={handleCreate(state.type, 'default')}
                fingerprint={fingerprint}
                hostedFieldsEnv={profile.hostedFieldsEnv}
              />
            )}
            {show.divider && <DividerDouble />}
          </PaymentDefault>
        )}
        {show.modalSubmitBpay && (
          <ModalConfirm
            body={`Please do not proceed with changing payment method if you
                have already actioned a BPay from your online banking portal.
                Please wait until your payment has been receipted before
                changing.<br><small class="text-muted">(Managed or your Agency
                will not be responsible for any bank fees incurred if a change
                was made during this time)<small>`}
            isOpen={state.isModalOpen}
            title="Warning: Changing payment method"
            btnCancel={{ text: 'Keep using Bpay' }}
            btnSubmit={{ text: 'Change' }}
            onCancel={handleChangeBpayCancel}
            onSubmit={handleChangeBpayConfirm}
            size="md"
          />
        )}
        {show.modalSubmitCreate && (
          <ModalConfirmAccount
            account={state.submitAction.params}
            isOpen={state.isModalOpen}
            onCancel={handleCancel}
            onSubmit={handleSubmitCreate}
            size="md"
          />
        )}
        {show.modalSubmitDestroy && (
          <ModalConfirmAccountDestroy
            account={state.submitAction.params}
            isOpen={state.isModalOpen}
            onCancel={handleCancel}
            onSubmit={handleSubmitDestroy}
            size="md"
          />
        )}
      </Container>
    </>
  );
};

ContainerComponent.propTypes = {
  createBank: PropTypes.func.isRequired,
  createCard: PropTypes.func.isRequired,
  destroyAccount: PropTypes.func.isRequired,
  disbursementAccount: PropTypes.object,
  disbursementAccounts: PropTypes.array,
  enablePayment: PropTypes.func.isRequired,
  enableDisbursement: PropTypes.func.isRequired,
  fetchAccounts: PropTypes.func.isRequired,
  fetchProperties: PropTypes.func.isRequired,
  fingerprint: PropTypes.string.isRequired,
  hasDefault: PropTypes.bool,
  hasDefaultPayment: PropTypes.bool,
  hasDisbursement: PropTypes.bool,
  hasError: PropTypes.bool,
  isAutoPay: PropTypes.bool,
  isLoading: PropTypes.bool,
  isPayByBpay: PropTypes.bool,
  isSecondaryTenant: PropTypes.bool,
  paymentAccount: PropTypes.object,
  paymentAccounts: PropTypes.array,
  profile: PropTypes.object,
  properties: PropTypes.array,
  setNoDefaultPayment: PropTypes.func.isRequired,
  setDisbursement: PropTypes.func.isRequired,
  setPayment: PropTypes.func.isRequired,
  user: PropTypes.object,
  createVirtualAccount: PropTypes.func.isRequired,
};

ContainerComponent.defaultProps = {
  disbursementAccount: {},
  disbursementAccounts: [],
  hasDefault: false,
  hasDefaultPayment: false,
  hasDisbursement: false,
  hasError: false,
  isAutoPay: false,
  isLoading: true,
  isPayByBpay: false,
  isSecondaryTenant: false,
  paymentAccount: {},
  paymentAccounts: [],
  properties: [],
};

const mapStateToProps = (state) => {
  const profile = getProfile(state.profile);
  const { hasDefaultPayment, isAutoPay, isLoading, isPayByBpay } =
    state.assembly || {};

  return {
    disbursementAccount: getDisbursementAccount(state.assembly),
    disbursementAccounts: getBankAccounts(state.assembly),
    fingerprint: getUserFingerprint(state.profile),
    hasDefault: hasDefaultAccount(state.assembly),
    hasDefaultPayment,
    hasDisbursement: hasDisbursementAccount(state.assembly),
    hasError: hasError(state),
    isAutoPay,
    isLoading,
    isPayByBpay,
    isSecondaryTenant: isSecondaryTenant(state.users, profile.id),
    paymentAccount: getPaymentAccount(state.assembly),
    paymentAccounts: getPaymentAccounts(state.assembly),
    profile,
    properties: getProperties(state.property),
    user: getUser(state.users, profile),
  };
};

const mapDispatchToProps = {
  createBank,
  createCard,
  destroyAccount,
  enablePayment,
  enableDisbursement,
  fetchAccounts,
  fetchProperties,
  setDisbursement,
  setPayment,
  setNoDefaultPayment,
  createVirtualAccount,
};

export const PaymentsSettings = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContainerComponent);
