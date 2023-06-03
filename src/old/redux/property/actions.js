import {
  ARCHIVE,
  CREATE,
  DESTROY,
  FETCH,
  FETCH_ALL,
  FETCH_FEE_AUDITS,
  FETCH_FINANCIALS,
  FETCH_TRANSACTIONS,
  RESET_PROPERTY,
  RESET_RESULTS,
  UNARCHIVE,
  UPDATE,
  UPDATE_ATTACHMENTS,
} from './constants';

export const updatePropertyAttachments = ({ attachableId, attachments }) => {
  return { type: UPDATE_ATTACHMENTS, payload: { attachableId, attachments } };
};

export const createProperty = (params) => ({
  type: CREATE,
  payload: { params },
});

export const destroyProperty = ({ id }) => ({
  type: DESTROY,
  payload: { id },
});

export const archiveProperty = ({
  id,
  comment,
  lostReasonType,
  preventiveAction,
  reasonSource,
}) => ({
  type: ARCHIVE,
  payload: {
    id,
    params: {
      propertyManagement: {
        comment,
        lostReasonType,
        preventiveAction,
        reasonSource,
      },
    },
  },
});

export const unarchiveProperty = ({
  id,
  gainReasonType,
  gainReasonSource,
}) => ({
  type: UNARCHIVE,
  payload: {
    id,
    params: {
      propertyManagement: {
        gainReasonType,
        gainReasonSource,
      },
    },
  },
});

export const fetchProperty = ({ propertyId }) => ({
  type: FETCH,
  payload: { propertyId },
});

export const fetchProperties = (payload = {}) => ({ type: FETCH_ALL, payload });

export const fetchPropertyFinancials = (params) => ({
  type: FETCH_FINANCIALS,
  payload: params,
});

export const resetPropertyResults = () => ({
  type: RESET_RESULTS,
});

export const resetProperty = () => ({
  type: RESET_PROPERTY,
});

export const updateProperty = ({ id, ...params }) => ({
  type: UPDATE,
  payload: { id, params },
});

export const fetchPropertyTransactions = (params) => ({
  type: FETCH_TRANSACTIONS,
  payload: params,
});

export const fetchPropertyFeeAudits = ({ propertyId, page }) => ({
  type: FETCH_FEE_AUDITS,
  payload: { propertyId, page },
});
