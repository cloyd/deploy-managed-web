import { filterEmptyValues } from '../../utils';
import {
  ADJUST_INTENTION,
  DESTROY_INTENTION,
  FETCH,
  FETCH_ALL,
  PAY_INTENTION,
} from './constants';
import { intentionStatusRansackParam } from './helpers';

export const adjustIntention = ({ intentionId, propertyId, ...params }) => ({
  type: ADJUST_INTENTION,
  payload: { intentionId, propertyId, params },
});

export const destroyIntention = ({ intentionId, propertyId, ...params }) => ({
  type: DESTROY_INTENTION,
  payload: { intentionId, propertyId, params },
});

export const fetchIntention = ({ intentionId }) => ({
  type: FETCH,
  payload: { intentionId },
});

export const fetchIntentions = ({ ...queryParams }) => {
  const {
    agencyId,
    fetchType,
    isFullDetail,
    isComplete,
    isOverdue,
    leaseId,
    managerId,
    page,
    perPage,
    propertyId,
    type,
    property,
  } = queryParams;

  return {
    type: FETCH_ALL,
    payload: {
      ...(isFullDetail && { isFullDetail }),
      ...(fetchType && { fetchType }),
      property,
      params: filterEmptyValues({
        isOverdue,
        page,
        perPage,
        'q[leaseLedgerItemsLeaseIdEq]': leaseId,
        'q[leaseLedgerItemsLeasePropertyAgencyIdEq]': agencyId,
        'q[leaseLedgerItemsLeasePropertyManagerIdEq]': managerId,
        'q[leaseLedgerItemsLeasePropertyIdEq]': propertyId,
        'q[typeOfIn]': type && type.length > 0 ? type.split(',') : null,
        ...intentionStatusRansackParam(isComplete),
      }),
    },
  };
};

export const fetchIntentionsPayable = ({ ...params } = {}) =>
  fetchIntentions({
    ...params,
    isComplete: false,
    isFullDetail: true,
    fetchType: 'payable',
  });

export const fetchIntentionsCompleted = ({ ...params } = {}) =>
  fetchIntentions({
    ...params,
    isComplete: true,
    fetchType: 'completed',
  });

export const payIntention = ({ intentionId, payingWalletId }) => ({
  type: PAY_INTENTION,
  payload: { intentionId, payingWalletId },
});
