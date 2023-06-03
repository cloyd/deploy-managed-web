import keyBy from 'lodash/fp/keyBy';
import last from 'lodash/fp/last';
// import { notifications } from 'settings';

import { centsToDollar } from '../../utils';
import { hideLoading, showAlert, showLoading } from '../notifier';
import { fetchProperty } from '../property';
import { fetchLease, fetchModifications } from './actions';
import {
  ACTIVATE,
  ADD_TENANT,
  CANCEL,
  DISBURSE,
  DISCHARGE_FLOAT,
  DISCHARGE_FLOAT_ERROR,
  DISCHARGE_FLOAT_SUCCESS,
  ERROR,
  FETCH,
  FETCH_ACTIVATION_TASKS,
  FETCH_ACTIVATION_TASKS_SUCCESS,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  FETCH_LEASE_LOG,
  FETCH_LEASE_LOG_SUCCESS,
  FETCH_MODIFICATIONS,
  FETCH_MODIFICATIONS_SUCCESS,
  MODIFY_RENT,
  MODIFY_RENT_SUCCESS,
  SUCCESS,
  UPDATE,
} from './constants';
import { decorateLease, decorateModifications } from './decorators';

const normalizeLease = (response) => {
  const { lease } = response.data;

  return {
    data: { [lease.id]: decorateLease(lease) },
    result: lease.id,
  };
};

const normalizeLeases = (response) => {
  const { leases } = response.data;

  return {
    data: keyBy('id', leases.map(decorateLease)),
    results: leases.map((lease) => lease.id),
  };
};

const tenantMessage = (primaryTenant, secondaryTenants, isInvited) => {
  let tenantId;

  if (primaryTenant) {
    tenantId = primaryTenant.id;
  }

  if (secondaryTenants && secondaryTenants.length > 0) {
    tenantId = last(secondaryTenants).id;
  }

  return isInvited
    ? `The tenant has been sent an activation email. Please follow up with them to make sure they complete their welcome steps.`
    : `When you're ready to invite the tenant, please click the invite button on <a class="alert-link" href="/contacts/tenants/${tenantId}">their profile.</a>`;
};

export const logic = [
  {
    type: ACTIVATE,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { leaseId, params } = action.payload;

      return httpClient
        .post(`/leases/${leaseId}/activate`, params)
        .then(normalizeLease);
    },
  },

  {
    type: ADD_TENANT,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { leaseId, params } = action.payload;

      return httpClient
        .post(`/leases/${leaseId}/add-tenant`, params)
        .then((response) => {
          return {
            ...normalizeLease(response),
            alert: {
              color: 'info',
              message: tenantMessage(
                response.data.lease.primaryTenant,
                response.data.lease.secondaryTenants
                // notifications.userInvited
              ),
            },
          };
        });
    },
  },

  {
    type: CANCEL,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      return httpClient
        .post(`/leases/${action.payload.leaseId}/cancel`)
        .then((response) => {
          return {
            ...normalizeLease(response),
            alert: {
              color: 'success',
              message:
                '<strong>Success:</strong> The lease has been cancelled.',
            },
          };
        });
    },
  },

  {
    type: DISBURSE,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { id, params } = action.payload;

      return httpClient
        .post(`/leases/${id}/disburse-bond`, params)
        .then(normalizeLease);
    },
  },

  {
    type: FETCH,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      return httpClient
        .get(`/leases/${action.payload.leaseId}`)
        .then(normalizeLease);
    },
  },

  // TEMP CODE
  {
    type: FETCH_LEASE_LOG,
    processOptions: {
      successType: FETCH_LEASE_LOG_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      return httpClient
        .get(`/leases/${action.payload.leaseId}/view-logs`)
        .then(({ data }) => ({
          logs: data.lease,
        }));
    },
  },

  {
    type: FETCH_ALL,
    processOptions: {
      successType: FETCH_ALL_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { propertyId, params } = action.payload;
      const endpoint = propertyId
        ? `/properties/${propertyId}/leases`
        : `/leases`;

      return httpClient.get(endpoint, { params }).then(normalizeLeases);
    },
  },

  {
    type: FETCH_MODIFICATIONS,
    processOptions: {
      successType: FETCH_MODIFICATIONS_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { leaseId, params } = action.payload;

      return httpClient
        .get(`/leases/${leaseId}/rent-modifications`, { params })
        .then((response) => {
          return {
            leaseId,
            modifications: decorateModifications(response.data.leaseRents),
          };
        });
    },
  },

  {
    type: FETCH_ACTIVATION_TASKS,
    processOptions: {
      successType: FETCH_ACTIVATION_TASKS_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { leaseId } = action.payload;

      return httpClient
        .get(`/leases/${leaseId}/activation_tasks`)
        .then((response) => {
          return {
            leaseId,
            leaseItems: response.data.leaseItems,
          };
        });
    },
  },

  {
    type: MODIFY_RENT,
    processOptions: {
      successType: MODIFY_RENT_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { leaseId, params } = action.payload;

      return httpClient
        .post(`/leases/${leaseId}/rent-modifications`, params)
        .then(() => ({
          ...action.payload,
          message:
            '<strong>Success:</strong> Rent amount successfully adjusted.',
        }));
    },
  },

  {
    type: UPDATE,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { leaseId, params } = action.payload;

      return httpClient.put(`/leases/${leaseId}`, params).then((response) => ({
        ...normalizeLease(response),
        alert: {
          color: 'success',
          message:
            '<strong>Success:</strong> The lease has been successfully updated.',
        },
      }));
    },
  },

  {
    type: MODIFY_RENT_SUCCESS,
    process({ action }, dispatch, done) {
      dispatch(fetchLease(action.payload));
      dispatch(fetchModifications(action.payload));
      done();
    },
  },

  {
    type: SUCCESS,
    process({ action }, dispatch, done) {
      const { alert, data, result } = action.payload;
      const { property } = data ? data[result] : {};

      // would be good to move alert to a generic piece of logic.
      alert && dispatch(showAlert(alert));
      property && dispatch(fetchProperty({ propertyId: property.id }));

      done();
    },
  },

  {
    type: DISCHARGE_FLOAT,
    processOptions: {
      successType: DISCHARGE_FLOAT_SUCCESS,
      failType: DISCHARGE_FLOAT_ERROR,
    },
    process({ action, httpClient }) {
      const { leaseId, amountCents } = action.payload;
      const endpoint = `leases/${leaseId}/discharge-float`;

      return httpClient.post(endpoint, { amountCents }).then(() => ({
        message: `${centsToDollar(
          amountCents
        )} will be transferred from the property wallet to the owner.`,
      }));
    },
  },

  {
    type: DISCHARGE_FLOAT_SUCCESS,
    process({ action }, dispatch, done) {
      const { message } = action.payload;
      message &&
        dispatch(
          showAlert({
            color: 'success',
            message,
          })
        );
      done();
    },
  },

  {
    type: [DISBURSE, ERROR, MODIFY_RENT_SUCCESS, SUCCESS],
    process({ action }, dispatch, done) {
      switch (action.type) {
        case DISBURSE:
          dispatch(showLoading());
          break;

        case ERROR:
        case MODIFY_RENT_SUCCESS:
        case SUCCESS:
          dispatch(hideLoading());
          break;
      }
      done();
    },
  },
];
