import { useMemo, useReducer } from 'react';

export const defaultState = {
  isEditing: {
    biller: false,
    default: false,
    disbursement: false,
  },
  isModalOpen: false,
  submitAction: {
    formType: null,
    key: null,
    params: {},
    submitType: null,
  },
  type: null,
  typePending: null,
};

export const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'CHANGE_BPAY_CANCEL':
      return {
        ...state,
        isModalOpen: false,
        typePending: null,
      };

    case 'CHANGE_BPAY_CONFIRM':
      return {
        ...state,
        isModalOpen: false,
        type: state.typePending,
        typePending: null,
      };

    case 'HIDE_MODAL':
      return { ...state, isModalOpen: false };

    case 'RESET_IS_EDITING':
      return { ...state, isEditing: { ...defaultState.isEditing } };

    case 'RESET_STATE':
      return { ...defaultState };

    case 'RESET_SUBMIT_ACTION':
      return {
        ...state,
        isModalOpen: false,
        isConfirmed: false,
        submitAction: {
          ...defaultState.submitAction,
        },
      };

    case 'SET_IS_EDITING':
      return { ...state, isEditing: { ...state.isEditing, ...payload } };

    case 'SET_SUBMIT_ACTION':
      return {
        ...state,
        isModalOpen: true,
        submitAction: {
          formType: payload.formType,
          key: payload.key,
          params: payload.params,
          submitType: payload.submitType,
        },
      };

    case 'SET_SUBMIT_ACTION_WITHOUT_MODAL':
      return {
        ...state,
        isModalOpen: false,
        isConfirmed: true,
        submitAction: {
          formType: payload.formType,
          key: payload.key,
          params: payload.params,
          submitType: payload.submitType,
        },
      };

    case 'SET_TYPE':
      return { ...state, type: payload };

    case 'SET_TYPE_PENDING':
      return { ...state, typePending: payload };

    case 'SHOW_MODAL':
      return { ...state, isModalOpen: true };

    case 'TOGGLE_MODAL':
      return { ...state, isModalOpen: !state.isModalOpen };

    case 'UPDATE':
      return { ...state, ...payload };

    default:
      return { ...state };
  }
};

export const useComposePaymentSettings = (initState = defaultState) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const actions = useMemo(
    () => ({
      changeBpayCancel: () => {
        dispatch({ type: 'CHANGE_BPAY_CANCEL' });
      },
      changeBpayConfirm: () => {
        dispatch({ type: 'CHANGE_BPAY_CONFIRM' });
      },
      hideModal: () => {
        dispatch({ type: 'HIDE_MODAL' });
      },
      resetIsEditing: () => {
        dispatch({ type: 'RESET_IS_EDITING' });
      },
      resetState: () => {
        dispatch({ type: 'RESET_STATE' });
      },
      resetSubmitAction: () => {
        dispatch({ type: 'RESET_SUBMIT_ACTION' });
      },
      resetType: () => {
        dispatch({ type: 'SET_TYPE', payload: null });
      },
      resetTypePending: () => {
        dispatch({ type: 'SET_TYPE_PENDING', payload: null });
      },
      setIsEditing: (payload) => {
        dispatch({ type: 'SET_IS_EDITING', payload });
      },
      setSubmitAction: (payload) => {
        dispatch({ type: 'SET_SUBMIT_ACTION', payload });
      },
      setType: (payload) => {
        dispatch({ type: 'SET_TYPE', payload });
      },
      setTypePending: (payload) => {
        dispatch({ type: 'SET_TYPE_PENDING', payload });
      },
      showModal: () => {
        dispatch({ type: 'SHOW_MODAL' });
      },
      setSubmitCreate: (payload) => {
        dispatch({
          type: 'SET_SUBMIT_ACTION_WITHOUT_MODAL',
          payload: { ...payload, formType: 'create' },
        });
      },
      setSubmitDefault: (payload) => {
        dispatch({
          type: 'SET_SUBMIT_ACTION',
          payload: { ...payload, formType: 'default' },
        });
      },
      setSubmitDestroy: (payload) => {
        dispatch({
          type: 'SET_SUBMIT_ACTION',
          payload: { ...payload, formType: 'destroy' },
        });
      },
      toggleModal: () => {
        dispatch({ type: 'TOGGLE_MODAL' });
      },
      updateState: (payload) => {
        dispatch({ type: 'UPDATE', payload });
      },
    }),
    [dispatch]
  );
  return [state, actions];
};
