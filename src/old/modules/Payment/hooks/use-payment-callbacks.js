import { useCallback, useEffect } from 'react';

export const usePaymentCallbacks = (props) => {
  const {
    createBank,
    createCard,
    destroyAccount,
    fingerprint,
    actions, // compose hook actions - ./use-compose-payment-settings.js
    state, // compose hook state - ./use-compose-payment-settings.js
    verification,
  } = props;

  useEffect(() => {
    if (state.isConfirmed) {
      handleSubmitCreate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isConfirmed]);

  // On cancelling confirmation modal
  const handleCancel = useCallback(() => {
    actions.resetSubmitAction();
  }, [actions]);

  // On submitting account creation form, show confirmation modal
  const handleCreate = useCallback(
    (submitType, key, optionalParams = {}) =>
      (params) => {
        const createData = {
          key,
          submitType,
          params: { ...optionalParams, ...params },
        };

        if (verification) {
          const { openVerificationModal } = verification;

          openVerificationModal({
            isOpen: true,
            callback: (securityCode) => {
              actions.setSubmitCreate({
                ...createData,
                params: {
                  ...createData.params,
                  securityCode,
                },
              });
            },
          });
        } else {
          actions.setSubmitCreate(createData);
        }
      },
    [actions, verification]
  );

  // On submitting account creation confirmation modal, submit form
  const handleSubmitCreate = useCallback(() => {
    const { key, params, submitType } = state.submitAction;

    const defaults = {
      isBiller: key === 'biller',
      isDefault: key === 'default',
      isDisbursement: key === 'disbursement',
      fingerprint,
    };

    submitType === 'bank'
      ? createBank({ ...defaults, ...params })
      : createCard({ ...defaults, ...params });

    actions.resetState();
  }, [state.submitAction, fingerprint, createBank, createCard, actions]);

  // On selecting destroy account
  const handleDestroy = useCallback(
    (account) => {
      actions.setSubmitDestroy({ params: { ...account } });
    },
    [actions]
  );

  // On submitting destroy account modal
  const handleSubmitDestroy = useCallback(() => {
    const { params } = state.submitAction;

    destroyAccount({ fingerprint, ...params });
    actions.resetSubmitAction();
  }, [actions, destroyAccount, fingerprint, state.submitAction]);

  return {
    handleCancel,
    handleCreate,
    handleDestroy,
    handleSubmitCreate,
    handleSubmitDestroy,
  };
};
