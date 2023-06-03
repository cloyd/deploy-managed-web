import keyBy from 'lodash/fp/keyBy';
import snakeCase from 'lodash/fp/snakeCase';

import { centsToDollar } from '../../utils';
import { hideAlert, hideLoading, showAlert, showLoading } from '../notifier';
import {
  ARCHIVE,
  ARCHIVE_SUCCESS,
  CREATE,
  DESTROY,
  DESTROY_SUCCESS,
  ERROR,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  FETCH_FEE_AUDITS,
  FETCH_FEE_AUDITS_SUCCESS,
  FETCH_FINANCIALS,
  FETCH_FINANCIALS_SUCCESS,
  FETCH_TRANSACTIONS,
  FETCH_TRANSACTIONS_SUCCESS,
  SUCCESS,
  UNARCHIVE,
  UNARCHIVE_SUCCESS,
  UPDATE,
} from './constants';
import { decorateProperty } from './decorators';

const normalizeProperty = (response) => {
  const { property } = response.data;

  return {
    data: { [property.id]: decorateProperty(property) },
    result: property.id,
  };
};

const normalizeProperties = (response) => {
  const { properties } = response.data;

  return {
    data: keyBy('id', properties.map(decorateProperty)),
    result: properties.map((property) => property.id),
  };
};

export const logic = [
  {
    type: CREATE,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      return httpClient
        .post(`/properties`, action.payload.params)
        .then(normalizeProperty);
    },
  },

  {
    type: DESTROY,
    processOptions: {
      successType: DESTROY_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { id } = action.payload;
      return httpClient.delete(`/properties/${id}`).then(() => ({ id }));
    },
  },

  {
    type: ARCHIVE,
    processOptions: {
      successType: ARCHIVE_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { id, params } = action.payload;
      return httpClient.post(`/properties/${id}/archive`, params).then(() => ({
        id,
        isArchived: true,
        message: '<strong>Success:</strong> Your property has been archived.',
      }));
    },
  },

  {
    type: UNARCHIVE,
    processOptions: {
      successType: UNARCHIVE_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { id, params } = action.payload;
      return httpClient
        .post(`/properties/${id}/unarchive`, params)
        .then(() => ({
          id,
          isArchived: false,
          message:
            '<strong>Success:</strong> Your property has been unarchived.',
        }));
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
        .get(`/properties/${action.payload.propertyId}`)
        .then(normalizeProperty);
    },
  },

  {
    type: FETCH_ALL,
    debounce: 500,
    latest: true,
    processOptions: {
      successType: FETCH_ALL_SUCCESS,
      failType: ERROR,
    },
    transform({ action }, next) {
      const {
        page,
        view,
        address,
        agencyId,
        managerId,
        noPagination,
        propertyId,
        sort,
        withArchived,
        propertyType,
        leaseStatus,
        tenantStatus,
        ownerStatus,
        isOnboarded,
        missingBank,
        invalidBank,
      } = action.payload;
      const params = { page, view, noPagination };

      if (address) {
        params['q[addressStreetOrAddressSuburbMatches]'] = `%${address}%`;
      }

      if (agencyId) {
        params['q[agencyIdEq]'] = agencyId;
      }

      if (managerId) {
        params['q[managerIdEq]'] = managerId;
      }

      if (propertyId) {
        params['q[idEq]'] = propertyId;
      }

      if (sort) {
        params['q[sorts]'] = sort;
      }

      if (propertyType) {
        params['q[propertyTypeEq]'] = propertyType;
      }

      if (leaseStatus) {
        if (leaseStatus === 'vacant') {
          params['q[hasNoActiveLeaseEq]'] = true;
        } else if (leaseStatus === 'leased') {
          params['q[hasNoActiveLeaseEq]'] = false;
        }
      }

      if (ownerStatus) {
        if (ownerStatus === 'current') {
          params['q[ownerPropertyIsPrimary]'] = true;
        } else if (ownerStatus === 'past') {
          params['q[ownerPropertyIsPrimary]'] = false;
        }
      }

      if (tenantStatus) {
        if (tenantStatus === 'current') {
          params['q[ownerPropertyIsPrimary]'] = true;
        } else if (tenantStatus === 'past') {
          params['q[ownerPropertyIsPrimary]'] = false;
        }
      }

      if (isOnboarded) {
        params['q[ownerPropertyIsOnboarded]'] = isOnboarded;
      }

      if (withArchived) {
        params['q[with_archived]'] = withArchived;
      }

      if (propertyType) {
        params['q[with_property_type]'] = propertyType.split(',');
      }

      if (leaseStatus) {
        params['q[lease_status]'] = leaseStatus
          .split(',')
          .map((item) => snakeCase(item));
      }

      if (missingBank) {
        params['q[missing_bank]'] = missingBank;
      }

      if (invalidBank) {
        params['q[invalid_bank_details]'] = invalidBank;
      }

      next({
        ...action,
        payload: {
          endpoint: `/properties`,
          params,
        },
      });
    },
    process({ action, httpClient }) {
      const { endpoint, params } = action.payload;
      return httpClient.get(endpoint, { params }).then(normalizeProperties);
    },
  },

  {
    type: FETCH_FINANCIALS,
    processOptions: {
      successType: FETCH_FINANCIALS_SUCCESS,
      failType: ERROR,
    },
    transform({ action }, next) {
      const { endsAt, format, propertyId, startsAt } = action.payload;

      next({
        ...action,
        payload: {
          propertyId,
          endpoint: `/properties/${propertyId}/financials.${format}`,
          params: {
            paidAtGteq: startsAt,
            paidAtLteq: endsAt,
          },
        },
      });
    },
    process({ action, httpClient }) {
      const { endpoint, params, propertyId } = action.payload;

      return httpClient.get(endpoint, { params }).then((response) => {
        return { [propertyId]: response.data };
      });
    },
  },

  {
    type: FETCH_TRANSACTIONS,
    processOptions: {
      successType: FETCH_TRANSACTIONS_SUCCESS,
      failType: ERROR,
    },
    transform({ action }, next) {
      const { propertyId, format } = action.payload;

      next({
        ...action,
        payload: {
          propertyId,
          endpoint: `/properties/${propertyId}/transactions.${format}`,
        },
      });
    },
    process({ action, httpClient }) {
      const { endpoint, propertyId } = action.payload;

      return httpClient.get(endpoint).then((response) => {
        return { [propertyId]: response.data };
      });
    },
  },

  {
    type: FETCH_FEE_AUDITS,
    processOptions: {
      successType: FETCH_FEE_AUDITS_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { propertyId, page } = action.payload;
      return httpClient
        .get(`/properties/${propertyId}/fees_audits`, {
          params: { page: parseInt(page) },
        })
        .then((response) => {
          return { [propertyId]: response.data };
        });
    },
  },

  {
    type: UPDATE,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient, getState }) {
      const { id, params } = action.payload;

      return httpClient
        .put(`/properties/${id}`, params)
        .then(({ data }) => decorateProperty(data.property))
        .then((property) => ({
          data: { [property.id]: property },
          result: property.id,
          message: `<strong>Success:</strong> Property has been updated.${
            property.floatBalanceAmountCents > property.floatCents
              ? ' ' +
                centsToDollar(
                  property.floatBalanceAmountCents - property.floatCents
                ) +
                ' will be transferred from the property wallet to the owner.'
              : ''
          }`,
        }));
    },
  },

  {
    type: [UPDATE, SUCCESS, ERROR],
    process({ action, getState }, dispatch, done) {
      switch (action.type) {
        case UPDATE:
          dispatch(hideAlert());
          dispatch(showLoading());
          break;

        case SUCCESS:
          const assemblyState = getState().assembly;

          if (!assemblyState?.isLoading) {
            dispatch(hideLoading());
          }
          break;

        case ERROR:
          dispatch(hideLoading());
          break;
      }
      done();
    },
  },

  {
    type: [SUCCESS, ARCHIVE_SUCCESS, UNARCHIVE_SUCCESS],
    process({ action, httpClient }, dispatch, done) {
      const { message } = action.payload;
      message && dispatch(showAlert({ color: 'success', message }));
      done();
    },
  },
];
