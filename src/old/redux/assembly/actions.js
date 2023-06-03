import { obfuscateParams } from '../../utils';
import {
  CREATE_BANK,
  CREATE_CARD,
  DESTROY_ACCOUNT,
  ENABLE_ACCOUNTS,
  ENABLE_DISBURSEMENT,
  ENABLE_DISBURSEMENT_PROPERTY,
  ENABLE_PAYMENT,
  ENABLE_PAYMENT_PROPERTY,
  FETCH,
  FETCH_ACCOUNTS,
  RESET,
  SET_AUTO_PAY,
  SET_DISBURSEMENT,
  SET_DISBURSEMENT_PROPERTY,
  SET_PAYMENT,
  SET_PAYMENT_PROPERTY,
  UPDATE_STATE_DATA,
} from './constants';

export const createBank = ({
  amountCents,
  externalCreditorId,
  isDefault,
  isDisbursement,
  isOnboarding,
  ...params
}) => {
  return {
    type: CREATE_BANK,
    payload: {
      amountCents,
      externalCreditorId,
      isDefault,
      isDisbursement,
      isOnboarding,
      params,
    },
  };
};

export const createCard = ({ isDefault, ...params }) => {
  return {
    type: CREATE_CARD,
    payload: { isDefault, params },
  };
};

export const destroyAccount = ({
  externalCreditorId,
  fingerprint,
  promisepayId,
}) => ({
  type: DESTROY_ACCOUNT,
  payload: { promisepayId, params: { externalCreditorId, fingerprint } },
});

export const enableAccount = ({ promisepayId, fingerprint }) => {
  return {
    type: ENABLE_ACCOUNTS,
    payload: { amountCents: 100000, promisepayId, fingerprint },
  };
};

export const enablePayment = ({
  externalCreditorId,
  promisepayId,
  fingerprint,
}) => {
  return {
    type: ENABLE_PAYMENT,
    payload: {
      amountCents: 100000,
      externalCreditorId,
      promisepayId,
      fingerprint,
    },
  };
};

export const enablePaymentProperty = (payload) => ({
  type: ENABLE_PAYMENT_PROPERTY,
  payload: { ...payload, amountCents: 100000 },
});

export const enableDisbursement = ({
  externalCreditorId,
  promisepayId,
  fingerprint,
}) => {
  return {
    type: ENABLE_DISBURSEMENT,
    payload: {
      amountCents: 100000,
      externalCreditorId,
      promisepayId,
      fingerprint,
    },
  };
};

export const enableDisbursementProperty = (payload) => ({
  type: ENABLE_DISBURSEMENT_PROPERTY,
  payload: { ...payload, amountCents: 100000 },
});

export const fetchAccounts = ({
  externalCreditorId,
  ownerId,
  primaryOwnerId,
  tenantId,
  propertyId,
} = {}) => ({
  type: FETCH,
  payload: {
    params: {
      externalCreditorId,
      primaryOwnerId,
      ownerId,
      tenantId,
      propertyId,
    },
  },
});

export const fetchPropertyAccounts = ({ ownerId, propertyId }) => ({
  type: FETCH_ACCOUNTS,
  payload: { ownerId, propertyId },
});

export const resetAccounts = () => ({ type: RESET });

export const setAutoPay = ({ autoPay, fingerprint, propertyId }) => ({
  type: SET_AUTO_PAY,
  payload: { params: { autoPay, fingerprint, propertyId } },
});

export const setDisbursement = ({
  promisepayId,
  externalCreditorId,
  fingerprint,
}) => ({
  type: SET_DISBURSEMENT,
  payload: { params: { promisepayId, externalCreditorId, fingerprint } },
});

export const setDisbursementProperty = ({
  ownerId,
  propertyId,
  ...params
}) => ({
  type: SET_DISBURSEMENT_PROPERTY,
  payload: { ownerId, propertyId, ...params },
});

export const setPayment = ({ promisepayId, fingerprint }) => ({
  type: SET_PAYMENT,
  payload: { params: { promisepayId, fingerprint } },
});

export const setNoDefaultPayment = ({ fingerprint }) =>
  setPayment({ promisepayId: null, fingerprint });

export const setPaymentProperty = ({ ownerId, propertyId, ...params }) => ({
  type: SET_PAYMENT_PROPERTY,
  payload: { ownerId, propertyId, ...params },
});

export const setNoDefaultPaymentProperty = ({
  ownerId,
  propertyId,
  ...params
}) =>
  setPaymentProperty({ ownerId, propertyId, promisepayId: null, ...params });

export const updateStateData = ({ promisepayId, params }) => ({
  type: UPDATE_STATE_DATA,
  payload: { promisepayId, params: obfuscateParams(params) },
});
