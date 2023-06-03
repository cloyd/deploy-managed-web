import keyBy from 'lodash/fp/keyBy';

import { formatError } from '../../utils';
import { hideAlert, hideLoading, showAlert, showLoading } from '../notifier';
import { fetchProperty } from '../property';
import {
  enableDisbursement,
  enableDisbursementProperty,
  enablePayment,
  enablePaymentProperty,
  fetchAccounts,
  setDisbursement,
  setDisbursementProperty,
  setPayment,
  setPaymentProperty,
  updateStateData,
} from './actions';
import {
  CREATE_BANK,
  CREATE_CARD,
  DESTROY_ACCOUNT,
  ENABLE_ACCOUNTS,
  ENABLE_ACCOUNTS_SUCCESS,
  ENABLE_DISBURSEMENT,
  ENABLE_DISBURSEMENT_PROPERTY,
  ENABLE_PAYMENT,
  ENABLE_PAYMENT_PROPERTY,
  ERROR,
  FETCH,
  FETCH_ACCOUNTS,
  FETCH_ACCOUNTS_SUCCESS,
  FETCH_SUCCESS,
  SET_AUTO_PAY,
  SET_AUTO_PAY_SUCCESS,
  SET_DISBURSEMENT,
  SET_DISBURSEMENT_PROPERTY,
  SET_DISBURSEMENT_PROPERTY_SUCCESS,
  SET_PAYMENT,
  SET_PAYMENT_PROPERTY,
  SET_PAYMENT_PROPERTY_SUCCESS,
  UPDATE_STATE_DATA,
} from './constants';

const normalizeResponse = (response) => {
  const pluckPromisepayId = (item = {}) => item.promisepayId;
  const { bank, card, ...payload } = response.data;

  return {
    ...payload,
    data: keyBy('promisepayId', [...bank, ...card]),
    banks: bank.map(pluckPromisepayId),
    cards: card.map(pluckPromisepayId),
  };
};

export const logic = [
  {
    type: FETCH,
    processOptions: {
      successType: FETCH_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { params } = action.payload;

      return httpClient
        .get('/assembly/list-accounts', { params })
        .then(normalizeResponse);
    },
  },

  {
    type: FETCH_ACCOUNTS,
    processOptions: {
      successType: FETCH_ACCOUNTS_SUCCESS,
      failType: ERROR,
    },
    transform({ action }, next) {
      const { propertyId, ownerId } = action.payload;
      next({
        ...action,
        endpoint: `/properties/${propertyId}/owners/${ownerId}`,
      });
    },
    process({ action, httpClient }) {
      return httpClient
        .get(action.endpoint)
        .then((response) => response.data.ownerProperty);
    },
  },

  {
    type: CREATE_BANK,
    process({ action, httpClient }, dispatch, done) {
      const { externalCreditorId, isDefault, isDisbursement, isOnboarding } =
        action.payload;

      const { ownerId, propertyId, fingerprint, promisepayId } =
        action.payload.params;

      const addAccount = () => {
        return httpClient
          .post('/assembly/add-bank-account', {
            fingerprint,
            externalCreditorId,
            promisepayId,
          })
          .then(() => promisepayId);
      };

      // Set default payment account for property
      const onSetPaymentProperty = (params) => {
        dispatch(enablePaymentProperty(params));
      };

      // Set global payment account
      const onSetPaymentDefault = ({ promisepayId, payload, fingerprint }) => {
        dispatch(
          isOnboarding
            ? setPayment({ promisepayId, fingerprint })
            : enablePayment({ ...payload, promisepayId, fingerprint })
        );
      };
      // Set disbursement account for a property
      const onSetDisbursementProperty = (params) => {
        dispatch(enableDisbursementProperty(params));
      };

      // Set global disbursement account
      const onSetDisbursement = ({ promisepayId, externalCreditorId }) => {
        dispatch(
          isOnboarding
            ? setDisbursement({ promisepayId, externalCreditorId, fingerprint })
            : enableDisbursement({
                ...action.payload,
                fingerprint,
                promisepayId,
                externalCreditorId,
              })
        );
      };

      const onSuccess = (promisepayId) => {
        const isSetProperty = !!ownerId && !!propertyId;

        // rent
        if (isDefault) {
          // Set default account for maintenance & repairs
          isSetProperty
            ? onSetPaymentProperty({
                promisepayId,
                ownerId,
                propertyId,
                fingerprint,
              })
            : onSetPaymentDefault({
                promisepayId,
                payload: action.payload,
                fingerprint,
              });
        }

        // disbursement
        if (isDisbursement) {
          isSetProperty
            ? onSetDisbursementProperty({
                promisepayId,
                ownerId,
                propertyId,
                fingerprint,
              })
            : onSetDisbursement({
                promisepayId,
                externalCreditorId,
                fingerprint,
              });
        }
        dispatch(fetchAccounts({ externalCreditorId }));

        if (isSetProperty && (isDefault || isDisbursement)) {
          const { params, ...otherParams } = action.payload;
          dispatch(
            updateStateData({
              promisepayId,
              params: { ...otherParams, ...params },
            })
          );
        }
      };

      const onFail = (e) => {
        dispatch({
          type: ERROR,
          payload: {
            message: `<b>Error</b>: ${formatError(
              e,
              'An error occured adding your bank account'
            )}`,
          },
        });
      };

      return addAccount().then(onSuccess).catch(onFail).then(done);
    },
  },

  {
    type: CREATE_CARD,
    process({ action, httpClient }, dispatch, done) {
      const { isDefault } = action.payload;
      const { ownerId, propertyId, fingerprint, promisepayId } =
        action.payload.params;

      const addAccount = () => {
        return httpClient
          .post('/assembly/add-credit-card', { promisepayId, fingerprint })
          .then(() => {
            return promisepayId;
          });
      };

      // Set default payment account for property
      const onSetPaymentProperty = (promisepayId) => {
        const { params, ...otherParams } = action.payload;
        dispatch(setPaymentProperty({ promisepayId, ownerId, propertyId }));
        dispatch(
          updateStateData({
            promisepayId,
            params: { ...otherParams, ...params },
          })
        );
      };

      const onSuccess = (promisepayId) => {
        if (isDefault) {
          !!ownerId && !!propertyId
            ? onSetPaymentProperty(promisepayId)
            : dispatch(setPayment({ promisepayId, fingerprint }));
        }
        dispatch(fetchAccounts());
      };

      const onFail = () => {
        dispatch({
          type: ERROR,
          payload: {
            message: `<b>Error</b>: An error occured adding your credit card`,
          },
        });
      };

      return addAccount().then(onSuccess).catch(onFail).then(done);
    },
  },

  {
    type: DESTROY_ACCOUNT,
    processOptions: {
      successType: fetchAccounts,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { params, promisepayId } = action.payload;

      return httpClient
        .delete(`/assembly/account/${promisepayId}`, { params })
        .then(() => params);
    },
  },

  {
    type: ENABLE_ACCOUNTS,
    process({ action, httpClient }, dispatch, done) {
      const { amountCents, promisepayId, fingerprint } = action.payload;

      const onFail = () => {
        dispatch({
          type: ERROR,
          payload: {
            message: `<b>Error</b>: An error occured setting agreement`,
          },
        });
      };

      const onSuccess = () => {
        dispatch({ type: ENABLE_ACCOUNTS_SUCCESS });
      };

      const enableBiller = () => {
        return httpClient.post('/assembly/add-mtech-dda', {
          promisepayId,
          fingerprint,
        });
      };

      const enablePayment = () => {
        return httpClient.post('/assembly/add-promisepay-dda', {
          fingerprint,
          amountCents,
          promisepayId,
        });
      };

      return enableBiller()
        .then(enablePayment)
        .then(onSuccess)
        .catch(onFail)
        .then(done);
    },
  },

  {
    type: ENABLE_PAYMENT,
    processOptions: {
      successType: setPayment,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      return httpClient
        .post('/assembly/add-promisepay-dda', action.payload)
        .then(() => action.payload);
    },
  },

  {
    type: ENABLE_PAYMENT_PROPERTY,
    processOptions: {
      successType: setPaymentProperty,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      return httpClient
        .post('/assembly/add-promisepay-dda', action.payload)
        .then(() => action.payload);
    },
  },

  {
    type: ENABLE_DISBURSEMENT,
    processOptions: {
      successType: setDisbursement,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      return httpClient
        .post('/assembly/add-promisepay-dda', action.payload)
        .then(() => action.payload);
    },
  },

  {
    type: ENABLE_DISBURSEMENT_PROPERTY,
    processOptions: {
      successType: setDisbursementProperty,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      return httpClient
        .post('/assembly/add-promisepay-dda', action.payload)
        .then(() => action.payload);
    },
  },

  {
    type: SET_AUTO_PAY,
    processOptions: {
      successType: SET_AUTO_PAY_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      return httpClient
        .post('/assembly/set-auto-pay', action.payload.params)
        .then(() => action.payload);
    },
  },

  {
    type: SET_PAYMENT,
    processOptions: {
      successType: fetchAccounts,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      return httpClient.post('/assembly/set-default', action.payload.params);
    },
  },

  {
    type: SET_PAYMENT_PROPERTY,
    processOptions: {
      successType: SET_PAYMENT_PROPERTY_SUCCESS,
      failType: ERROR,
    },
    transform({ action, getState }, next) {
      const state = getState().assembly;

      const { propertyId, ownerId, promisepayId, securityCode } =
        action.payload;
      next({
        ...action,
        payload: {
          paymentAccountPromisepayId: promisepayId,
          authyToken: securityCode || state?.securityCode,
        },
        endpoint: `/properties/${propertyId}/owners/${ownerId}`,
      });
    },
    process({ action, httpClient }) {
      return httpClient
        .put(action.endpoint, action.payload)
        .then((response) => response.data.ownerProperty);
    },
  },

  {
    type: SET_DISBURSEMENT,
    processOptions: {
      successType: fetchAccounts,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { params } = action.payload;

      return httpClient
        .post('/assembly/set-disbursement-account', params)
        .then(() => params);
    },
  },

  {
    type: SET_DISBURSEMENT_PROPERTY,
    processOptions: {
      successType: SET_DISBURSEMENT_PROPERTY_SUCCESS,
      failType: ERROR,
    },
    transform({ action, getState }, next) {
      const state = getState().assembly;
      const { propertyId, ownerId, promisepayId, securityCode } =
        action.payload;
      next({
        ...action,
        payload: {
          disbursementAccountPromisepayId: promisepayId,
          authyToken: securityCode || state?.securityCode,
        },
        endpoint: `/properties/${propertyId}/owners/${ownerId}`,
      });
    },
    process({ action, httpClient }) {
      return httpClient
        .put(action.endpoint, action.payload)
        .then((response) => response.data.ownerProperty);
    },
  },

  {
    type: [
      CREATE_BANK,
      CREATE_CARD,
      DESTROY_ACCOUNT,
      ERROR,
      ENABLE_ACCOUNTS,
      ENABLE_PAYMENT,
      ENABLE_DISBURSEMENT,
      ENABLE_DISBURSEMENT_PROPERTY,
      FETCH,
      FETCH_SUCCESS,
      SET_PAYMENT,
      SET_DISBURSEMENT,
      UPDATE_STATE_DATA,
      SET_DISBURSEMENT_PROPERTY_SUCCESS,
      SET_PAYMENT_PROPERTY_SUCCESS,
    ],
    process({ action }, dispatch, done) {
      const onUpdateBankAccountSuccess = (action, message) => {
        if (action.payload?.propertyId) {
          dispatch(fetchProperty({ propertyId: action.payload?.propertyId }));
        }
        dispatch(
          showAlert({
            color: 'success',
            message,
          })
        );
      };

      switch (action.type) {
        case CREATE_BANK:
        case CREATE_CARD:
        case DESTROY_ACCOUNT:
        case FETCH:
        case ENABLE_PAYMENT:
        case ENABLE_DISBURSEMENT:
        case ENABLE_DISBURSEMENT_PROPERTY:
        case SET_PAYMENT:
        case SET_DISBURSEMENT:
        case SET_DISBURSEMENT_PROPERTY:
          dispatch(hideAlert());
          dispatch(showLoading());
          break;

        case FETCH_SUCCESS:
        case UPDATE_STATE_DATA:
          dispatch(hideAlert());
          dispatch(hideLoading());
          break;

        case FETCH_ACCOUNTS_SUCCESS:
          if (action.payload?.propertyId) {
            dispatch(fetchProperty({ propertyId: action.payload?.propertyId }));
          }
          break;

        case SET_DISBURSEMENT_PROPERTY_SUCCESS:
          onUpdateBankAccountSuccess(
            action,
            'Successfully set account for withdrawals'
          );

          break;

        case SET_PAYMENT_PROPERTY_SUCCESS:
          onUpdateBankAccountSuccess(
            action,
            'Successfully set account for rental payments'
          );

          break;

        case ERROR:
          dispatch(hideLoading());

          if (action.payload.message) {
            dispatch(
              showAlert({
                color: 'danger',
                message: action.payload.message || action.payload.error,
              })
            );
          }

          break;
      }

      done();
    },
  },
];
