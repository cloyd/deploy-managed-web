import { createSelector } from 'reselect';

import { selectArg, sliceById, withDefault } from '@app/redux/selectors';

export const getJob = (state, id) => state.job.data[id] || {};

export const getJobs = (state) =>
  state.job.results ? state.job.results.map((id) => state.job.data[id]) : [];

export const getMessagesByQuoteId = (state, quoteId) =>
  (quoteId && state.message.data[quoteId]) || [];

export const getMarketplaceTags = (state) => state.meta.tags || [];

export const getQuote = (state, id) => state.quote.data[id] || {};

export const getQuotes = (state) =>
  state.quote.results
    ? state.quote.results.map((id) => state.quote.data[id])
    : [];

export const getQuotesByJobId = (state, jobId) => {
  const job = getJob(state, jobId);
  return job && job.tradieQuoteIds
    ? job.tradieQuoteIds.reduce(
        (results, quoteId) =>
          state.quote.data[quoteId]
            ? [...results, state.quote.data[quoteId]]
            : results,
        []
      )
    : [];
};

//
// Use new selectors when views are updated to useSelector
const quotesByTradieJobId = (quotes, tradieJobId) => {
  return Object.values(quotes).filter((quote) => {
    return +quote.tradieJobId === +tradieJobId;
  });
};

export const selectQuotes = (state) => {
  return state.marketplace.quote.data;
};

export const selectJobs = (state) => {
  return state.marketplace.job.data;
};

export const selectMessages = (state) => {
  return state.marketplace.message.data;
};

export const selectJob = createSelector(selectJobs, selectArg, sliceById);

export const selectMessagesForQuote = createSelector(
  selectMessages,
  selectArg,
  withDefault(sliceById, [])
);

export const selectQuote = createSelector(selectQuotes, selectArg, sliceById);

export const selectQuotesForJob = createSelector(
  selectQuotes,
  selectArg,
  withDefault(quotesByTradieJobId, [])
);
