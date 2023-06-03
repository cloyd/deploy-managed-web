import {
  cancelJobLogic,
  createJobLogic,
  createMessageLogic,
  createQuoteLogic,
  errorMessageLogic,
  fetchJobLogic,
  fetchMessageLogic,
  fetchMetaLogic,
  fetchQuoteLogic,
  recommendTradieLogic,
  requestReviewLogic,
  revertQuoteLogic,
  successMessageLogic,
  updateJobLogic,
  updateQuoteLogic,
} from './logic';
import marketplace from './reducer';

// Logic
export const marketplaceLogic = [
  cancelJobLogic,
  createJobLogic,
  createMessageLogic,
  createQuoteLogic,
  errorMessageLogic,
  fetchJobLogic,
  fetchMessageLogic,
  fetchMetaLogic,
  fetchQuoteLogic,
  requestReviewLogic,
  revertQuoteLogic,
  recommendTradieLogic,
  successMessageLogic,
  updateJobLogic,
  updateQuoteLogic,
];

// Actions
export {
  acceptQuote,
  cancelJob,
  createJob,
  createQuote,
  createQuoteMessage,
  declineQuote,
  fetchJob,
  fetchJobs,
  fetchMarketplaceTags,
  fetchMessagesByQuoteId,
  fetchQuote,
  fetchQuotesByJobId,
  fetchQuotes,
  inviteTradiesToQuote,
  requestOwnerReview,
  recommendTradie,
  revertAcceptedQuote,
  statusesForPath,
  updateJob,
  updateJobAttachments,
  updateQuote,
  updateQuoteAttachments,
} from './actions';

// Constants
export {
  JOB_TYPES,
  JOB_TYPE,
  MY_QUOTE_ACCEPTED_STATUSES,
  MY_QUOTE_COMPLETED_STATUSES,
  MY_QUOTE_PENDING_STATUSES,
  QUOTE_ACCEPTED_STATUSES,
  QUOTE_PENDING_STATUSES,
  QUOTE_STATUSES,
} from './constants';

// Selectors
export {
  getJob,
  getJobs,
  getMessagesByQuoteId,
  getMarketplaceTags,
  getQuote,
  getQuotes,
  getQuotesByJobId,
  selectJob,
  selectQuote,
  selectMessagesForQuote,
  selectQuotesForJob,
} from './selectors';

// Reducer
export default marketplace.reducer;
