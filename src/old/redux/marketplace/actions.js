import {
  JOB_TYPE,
  MY_QUOTE_ACCEPTED_STATUSES,
  MY_QUOTE_COMPLETED_STATUSES,
  MY_QUOTE_PENDING_STATUSES,
  QUOTE_STATUSES,
} from './constants';
import marketplace from './reducer';

export const statusesForPath = (type) => {
  switch (type) {
    case 'my-jobs':
      return MY_QUOTE_PENDING_STATUSES;
    case 'active-jobs':
      return MY_QUOTE_ACCEPTED_STATUSES;
    case 'sent-for-approval':
      return [QUOTE_STATUSES.awaitingApproval];
    case 'past-jobs':
      return MY_QUOTE_COMPLETED_STATUSES;
  }
};

/**
 * Create actions
 */
export const createJob = (params) => marketplace.actions.createJob(params);

export const createQuote = (params) => marketplace.actions.createQuote(params);

export const createQuoteMessage = (params) =>
  marketplace.actions.createMessage(params);

/**
 * Fetch actions
 */
export const fetchJob = (jobId) => marketplace.actions.fetchJob({ jobId });

export const fetchJobs = ({
  agency,
  priority,
  jobType,
  status,
  tagId,
  type,
  ...params
}) => {
  if (type) {
    params.jobId = 'my-jobs';
    params['q[tradieQuotesStatusIn]'] = statusesForPath(type);
  }

  if (jobType) {
    params['q[tradieQuotesWorkOrderEq]'] = jobType === JOB_TYPE.workOrder;
  }

  if (priority) {
    params['q[propertyTaskPriorityEq]'] = priority;
  }

  if (tagId) {
    params['q[tradieJobTagsTagIdIn]'] = tagId;
  }

  if (status) {
    params['q[tradieQuotesStatusIn]'] = status;
  }

  if (agency) {
    params['q[agencyIdEq]'] = agency;
  }

  return marketplace.actions.fetchJob(params);
};

export const fetchMessagesByQuoteId = (quoteId) =>
  marketplace.actions.fetchMessage({ quoteId });

export const fetchMarketplaceTags = () =>
  marketplace.actions.fetchMeta({ metaType: 'tags' });

export const fetchQuote = (quoteId) => {
  return marketplace.actions.fetchQuote({ quoteId });
};

export const fetchQuotesByJobId = (tradieJobId) =>
  marketplace.actions.fetchQuote({ tradieJobId });

export const fetchQuotes = (params) =>
  marketplace.actions.fetchQuote({ ...params, quoteId: undefined });

/**
 * Update actions
 */
const updateAttachments = ({ stateKey, ...params }) =>
  marketplace.actions.updateAttachments({ stateKey, ...params });

export const updateJob = ({ jobId, ...params }) =>
  marketplace.actions.updateJob({ jobId, ...params });

export const updateJobAttachments = ({ attachableId, attachments }) =>
  updateAttachments({ attachableId, attachments, stateKey: 'job' });

export const updateQuote = ({ quoteId, ...params }) =>
  marketplace.actions.updateQuote({ quoteId, ...params });

export const updateQuoteAttachments = ({ attachableId, attachments }) =>
  updateAttachments({ attachableId, attachments, stateKey: 'quote' });

export const acceptQuote = (quoteId) =>
  updateQuote({ quoteId, status: QUOTE_STATUSES.accepted });

export const declineQuote = (quoteId) => {
  return updateQuote({ quoteId, status: QUOTE_STATUSES.declined });
};

export const revertAcceptedQuote = (quoteId) => {
  return marketplace.actions.revertQuote({ quoteId });
};

/**
 * Destroy actions
 */
export const cancelJob = (jobId) => marketplace.actions.cancelJob({ jobId });

/**
 * Other actions
 */
export const inviteTradiesToQuote = ({ tradieIds, tradieJobId, workOrder }) =>
  marketplace.actions.createQuote({ tradieIds, tradieJobId, workOrder });

export const requestOwnerReview = (jobId) =>
  marketplace.actions.requestReview({ jobId });

export const recommendTradie = marketplace.actions.recommendTradie;
