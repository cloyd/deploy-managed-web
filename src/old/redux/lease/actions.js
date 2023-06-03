import { formatDate } from '../../utils';
import {
  ACTIVATE,
  ADD_TENANT,
  CANCEL,
  DISBURSE,
  DISCHARGE_FLOAT,
  FETCH,
  FETCH_ACTIVATION_TASKS,
  FETCH_ALL,
  FETCH_LEASE_LOG,
  FETCH_MODIFICATIONS,
  FREQUENCY_DATES,
  MODIFY_RENT,
  UPDATE,
  UPDATE_ATTACHMENTS,
} from './constants';

export const activateLease = ({ leaseId, ...params }) => ({
  type: ACTIVATE,
  payload: { leaseId, params },
});

export const addTenant = ({ leaseId, ...params }) => ({
  type: ADD_TENANT,
  payload: { leaseId, params },
});

export const cancelLease = ({ id }) => ({
  type: CANCEL,
  payload: { leaseId: id },
});

export const disburseBond = ({ id, bondReturnedCents, bondNumber }) => ({
  type: DISBURSE,
  payload: { id, params: { bondReturnedCents, bondNumber } },
});

export const fetchLease = ({ leaseId }) => ({
  type: FETCH,
  payload: { leaseId },
});

export const fetchLeaseLog = ({ leaseId }) => ({
  type: FETCH_LEASE_LOG,
  // possibility to add filter parameters as well
  payload: { leaseId },
});

export const fetchLeases = ({ propertyId, ...params } = {}) => ({
  type: FETCH_ALL,
  payload: { propertyId, params },
});

export const fetchModifications = ({ leaseId }) => ({
  type: FETCH_MODIFICATIONS,
  payload: {
    leaseId,
    params: {
      'q[effectiveDateGteq]': formatDate(new Date(), 'dateLocal'),
    },
  },
});

export const fetchActivationTasks = ({ leaseId }) => ({
  type: FETCH_ACTIVATION_TASKS,
  payload: {
    leaseId,
  },
});

export const modifyRent = ({ id, ...params }) => ({
  type: MODIFY_RENT,
  payload: { leaseId: id, params },
});

export const updateLease = ({ id, ...params }) => {
  const {
    inspectionDate,
    inspectionDateFrequency,
    reviewDate,
    reviewDateFrequency,
    ...updateParams
  } = params;

  return {
    type: UPDATE,
    payload: {
      leaseId: id,
      params: {
        ...updateParams,
        inspectionDate,
        reviewDate,
        inspectionDateFrequencyInMonths:
          inspectionDate && !inspectionDateFrequency
            ? FREQUENCY_DATES[0].value
            : inspectionDateFrequency,
        reviewDateFrequencyInMonths:
          reviewDate && !reviewDateFrequency
            ? FREQUENCY_DATES[0].value
            : reviewDateFrequency,
      },
    },
  };
};

export const updateLeaseAttachments = ({ attachableId, attachments }) => {
  return { type: UPDATE_ATTACHMENTS, payload: { attachableId, attachments } };
};

export const dischargeFloat = ({ leaseId, amountCents }) => ({
  type: DISCHARGE_FLOAT,
  payload: { leaseId, amountCents },
});
