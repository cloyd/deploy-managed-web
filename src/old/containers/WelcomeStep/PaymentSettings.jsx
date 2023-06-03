import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { DividerDouble } from '../../modules/Divider';
import { ModalConfirm, ModalConfirmAccountDestroy } from '../../modules/Modal';
import {
  PaymentAccounts,
  PaymentDda,
  PaymentDefault,
  PaymentDisbursement,
  PaymentOptions,
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
  fetchAccounts,
  getBankAccounts,
  getDisbursementAccount,
  getPaymentAccount,
  getPaymentAccounts,
  hasDefaultAccount,
  hasDisbursementAccount,
  setAutoPay,
  setDisbursement,
  setNoDefaultPayment,
  setPayment,
} from '../../redux/assembly';
import { hasError } from '../../redux/notifier';
import { getProfile, getUserFingerprint } from '../../redux/profile';
import { fetchProperties, getProperties } from '../../redux/property';
import { getUser, isSecondaryTenant } from '../../redux/users';

const getDisabledStyle = (isDisabled) =>
  isDisabled ? { opacity: 0.25, pointerEvents: 'none' } : null;

/**
 * Welcome steps payment settings for users who have role:
 * - Tenant (primary, secondary)
 * - Principal Manager
 */
const ContainerComponent = (props) => {
  const {
    disbursementAccount,
    disbursementAccounts,
    fetchAccounts,
    fetchProperties,
    fingerprint,
    hasDefault,
    hasDefaultPayment,
    hasDisbursement,
    hasError,
    isAutoPay,
    isLoading,
    isPayByBpay,
    isSecondaryTenant,
    onCheckAgreement,
    paymentAccount,
    paymentAccounts,
    profile,
    properties,
    setAutoPay,
    setDisbursement,
    setPayment,
    setNoDefaultPayment,
    user,
    handleGenerateVirtualAccount,
  } = props;

  const history = useHistory();
  const location = useLocation();

  const { isExternalCreditor, isTenant, isPrincipal } = useRolesContext();

  const [state, actions] = useComposePaymentSettings();
  const { handleCancel, handleCreate, handleDestroy, handleSubmitDestroy } =
    usePaymentCallbacks({ ...props, state, actions });

  const isEditingAny = useMemo(
    () => state.isEditing.default || state.isEditing.disbursement,
    [state.isEditing]
  );

  const show = useMemo(() => {
    const showDefault =
      (isPrincipal || isTenant) && !state.isEditing.disbursement;

    return {
      agreement: !isEditingAny && isPrincipal && hasDisbursement && hasDefault,
      autoPayOptions: isTenant && hasDefaultPayment && !isPayByBpay,
      default: showDefault,
      defaultPaymentSelector:
        showDefault && (!hasDefaultPayment || state.isEditing.default),
      disbursement: !isTenant,
      disbursementSelector: !hasDisbursement || state.isEditing.disbursement,
      divider: !isEditingAny,
      modalSubmitBpay: isTenant && state.type === 'bpay' && !!state.typePending,
      modalSubmitCreate: state.submitAction.formType === 'create',
      modalSubmitDestroy: state.submitAction.formType === 'destroy',
    };
  }, [
    hasDefault,
    hasDefaultPayment,
    hasDisbursement,
    isEditingAny,
    isPayByBpay,
    isPrincipal,
    isTenant,
    state.isEditing,
    state.submitAction.formType,
    state.type,
    state.typePending,
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
        default: setPayment,
        disbursement: setDisbursement,
      };

      action[key]({ ...params, fingerprint });
      actions.resetType();
    },
    [actions, fingerprint, setPayment, setDisbursement]
  );

  const handleChangeBpayConfirm = useCallback(() => {
    state.submitAction.key
      ? handleSubmitDefault()
      : actions.changeBpayConfirm();
  }, [actions, handleSubmitDefault, state.submitAction.key]);

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

        // Hack to verify that a type has been set
        history.push(`${location.pathname}#${nextType}`);

        if (
          (nextType === 'bpay' && hasDefaultPayment) ||
          nextType === 'noDefaultPayment'
        ) {
          setNoDefaultPayment({ fingerprint });
        }
      }
    },
    [
      actions,
      hasDefaultPayment,
      history,
      location.pathname,
      setNoDefaultPayment,
      fingerprint,
      state,
    ]
  );

  const handleAutoPay = useCallback(() => {
    actions.hideModal();
    setAutoPay({ autoPay: !isAutoPay, fingerprint });
  }, [actions, isAutoPay, setAutoPay, fingerprint]);

  useEffect(() => {
    actions.resetType();
  }, [
    actions,
    show.disbursementSelector,
    show.defaultPaymentSelector,
    profile.isBpayOutEnabled,
  ]);

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

  return (
    <div className="mt-md-2">
      {show.disbursement && (
        <PaymentDisbursement
          isLoading={isLoading}
          isSetup={true}
          properties={properties}
          style={getDisabledStyle(isLoading)}>
          {hasDisbursement && (
            <PaymentAccounts
              account={disbursementAccount}
              accounts={disbursementAccounts}
              isEditing={state.isEditing.disbursement}
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
              isSetup={true}
              type="bank"
              user={user}
              onEnable={handleEnable('disbursement')}
              onCancel={hasDisbursement ? handleChangeEditing() : null}
              onSubmit={handleCreate('bank', 'disbursement')}
              fingerprint={fingerprint}
              hostedFieldsEnv={profile.hostedFieldsEnv}
            />
          )}
        </PaymentDisbursement>
      )}
      {show.disbursement && show.divider && <DividerDouble />}
      {show.default && (
        <PaymentDefault
          isAutoPay={isAutoPay}
          isLoading={isLoading}
          isSetup={true}
          style={getDisabledStyle(
            isLoading || (!isTenant && !hasDisbursement)
          )}>
          <PaymentAccounts
            account={paymentAccount}
            accounts={paymentAccounts}
            canPayViaBpay={isTenant}
            canPayViaRent={false}
            isEditing={state.isEditing.default}
            isEnablePromisepay
            user={isSecondaryTenant ? {} : user}
            onChangeType={handleChangeType}
            onDestroy={handleDestroy}
            onEnable={handleEnable('default')}
            onSetDefault={handleDefault('default')}
            handleGenerateVirtualAccount={handleGenerateVirtualAccount}
          />
          {state.isEditing.default && <DividerDouble />}
          {show.defaultPaymentSelector && (
            <PaymentSelector
              account={disbursementAccount}
              hasAgreedDda={!!profile.hasAgreedDda}
              hasError={hasError}
              isEnablePromisepay
              isLoading={isLoading}
              isSetup={true}
              isTenant={isTenant}
              type={isTenant ? 'bpay' : state.type}
              types={
                isPrincipal ? ['card'] : isTenant ? ['bpay'] : ['bank', 'card']
              }
              onChange={handleChangeType}
              onCancel={hasDefault ? handleChangeEditing() : null}
              onEnable={handleEnable('default')}
              onSubmit={handleCreate(state.type, 'default')}
              fingerprint={fingerprint}
              hostedFieldsEnv={profile.hostedFieldsEnv}
            />
          )}
        </PaymentDefault>
      )}
      {show.default && show.divider && <DividerDouble />}
      {!isTenant && (
        <PaymentDda
          style={getDisabledStyle(isLoading || !show.agreement)}
          onChange={onCheckAgreement}
        />
      )}
      {show.autoPayOptions && (
        <div className="mb-3">
          <PaymentOptions isAutoPay={isAutoPay} onChange={handleAutoPay} />
        </div>
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
      {show.modalSubmitDestroy && (
        <ModalConfirmAccountDestroy
          account={state.submitAction.params}
          isOpen={state.isModalOpen}
          onCancel={handleCancel}
          onSubmit={handleSubmitDestroy}
          size="md"
        />
      )}
    </div>
  );
};

ContainerComponent.propTypes = {
  createBank: PropTypes.func.isRequired,
  createCard: PropTypes.func.isRequired,
  destroyAccount: PropTypes.func.isRequired,
  disbursementAccount: PropTypes.object,
  disbursementAccounts: PropTypes.array,
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
  onCheckAgreement: PropTypes.func,
  paymentAccount: PropTypes.object,
  paymentAccounts: PropTypes.array,
  profile: PropTypes.object,
  properties: PropTypes.array,
  setAutoPay: PropTypes.func.isRequired,
  setNoDefaultPayment: PropTypes.func.isRequired,
  setDisbursement: PropTypes.func.isRequired,
  setPayment: PropTypes.func.isRequired,
  user: PropTypes.object,
  handleGenerateVirtualAccount: PropTypes.func,
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
  fetchAccounts,
  fetchProperties,
  setAutoPay,
  setDisbursement,
  setPayment,
  setNoDefaultPayment,
};

export const WelcomeStepPaymentSettings = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContainerComponent);
