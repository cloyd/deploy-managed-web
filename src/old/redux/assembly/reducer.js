import {
  CREATE_BANK,
  CREATE_CARD,
  DESTROY_ACCOUNT,
  ENABLE_ACCOUNTS,
  ENABLE_ACCOUNTS_SUCCESS,
  ENABLE_DISBURSEMENT,
  ENABLE_DISBURSEMENT_PROPERTY,
  ENABLE_PAYMENT,
  ERROR,
  FETCH,
  FETCH_ACCOUNTS,
  FETCH_ACCOUNTS_SUCCESS,
  FETCH_SUCCESS,
  RESET,
  SET_AUTO_PAY,
  SET_AUTO_PAY_SUCCESS,
  SET_DISBURSEMENT_PROPERTY,
  SET_DISBURSEMENT_PROPERTY_SUCCESS,
  SET_PAYMENT,
  SET_PAYMENT_PROPERTY,
  SET_PAYMENT_PROPERTY_SUCCESS,
  UPDATE_STATE_DATA,
} from './constants';

export const initialState = {
  hasDefaultPayment: false,
  isAutoPay: false,
  isLoading: false,
  isSelectedLoading: false,
  isPayByBpay: false,
  isAgreementComplete: false,
  securityCode: null,
  data: {},
  cards: [],
  banks: [],
  disbursements: {
    default: null,
  },
  payments: {},
};

export const reducer = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case DESTROY_ACCOUNT:
    case ENABLE_ACCOUNTS:
    case ENABLE_PAYMENT:
    case ENABLE_DISBURSEMENT:
    case ENABLE_DISBURSEMENT_PROPERTY:
    case SET_AUTO_PAY:
    case FETCH:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_ACCOUNTS:
    case SET_DISBURSEMENT_PROPERTY:
    case SET_PAYMENT_PROPERTY:
      return {
        ...state,
        isSelectedLoading: true,
      };

    case SET_DISBURSEMENT_PROPERTY_SUCCESS:
      return {
        ...state,
        isSelectedLoading: false,
        disbursements: {
          ...state.disbursements,
          [`${action.payload.ownerId}-${action.payload.propertyId}`]:
            action.payload.disbursementAccountPromisepayId,
        },
      };

    case SET_PAYMENT_PROPERTY_SUCCESS:
      return {
        ...state,
        isSelectedLoading: false,
        payments: {
          ...state.payments,
          [`${action.payload.ownerId}-${action.payload.propertyId}`]: {
            id: action.payload.paymentAccountId,
            promisepayId: action.payload.paymentAccountPromisepayId,
            type: action.payload.paymentAccountType,
          },
        },
      };

    case CREATE_BANK:
    case CREATE_CARD:
      return {
        ...state,
        securityCode: payload.params.securityCode,
        isLoading: true,
      };

    case ENABLE_ACCOUNTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAgreementComplete: true,
      };

    case ERROR:
      return {
        ...state,
        isLoading: false,
        isAgreementComplete: false,
      };

    case FETCH_ACCOUNTS_SUCCESS:
      const {
        ownerId,
        propertyId,
        disbursementAccountPromisepayId,
        paymentAccountId,
        paymentAccountPromisepayId,
        paymentAccountType,
      } = action.payload;

      return {
        ...state,
        securityCode: null,
        disbursements: {
          ...state.disbursements,
          [`${ownerId}-${propertyId}`]: disbursementAccountPromisepayId,
        },
        payments: {
          ...state.payments,
          [`${ownerId}-${propertyId}`]: {
            id: paymentAccountId,
            promisepayId: paymentAccountPromisepayId,
            type: paymentAccountType,
          },
        },
      };

    case FETCH_SUCCESS:
      const {
        autoPay,
        disbursementAccount,
        hasDefaultPayment,
        isPayByBpay,
        ...rest
      } = payload;

      return {
        ...state,
        ...rest,
        isLoading: false,
        hasDefaultPayment: !!hasDefaultPayment,
        isAutoPay: !!autoPay,
        isPayByBpay: !!isPayByBpay,
        disbursements: {
          ...state.disbursements,
          default: disbursementAccount
            ? disbursementAccount.promisepayId
            : null,
        },
      };

    case RESET:
      return initialState;

    case SET_AUTO_PAY_SUCCESS:
      return {
        ...state,
        isAutoPay: payload.params.autoPay,
        isLoading: false,
      };

    case SET_PAYMENT:
      return {
        ...state,
        hasDefaultPayment: payload.params.promisepayId !== null,
        isLoading: true,
      };

    case UPDATE_STATE_DATA:
      const { promisepayId, params } = payload;

      return {
        ...state,
        banks: params.bankName ? [...state.banks, promisepayId] : state.banks,
        cards: params.number ? [...state.cards, promisepayId] : state.cards,
        data: {
          ...state.data,
          [promisepayId]: { ...params, promisepayId: promisepayId },
        },
      };

    default:
      return state;
  }
};
