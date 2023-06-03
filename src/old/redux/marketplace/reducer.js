import { createSlice } from '@reduxjs/toolkit';
import merge from 'lodash/fp/merge';

import { QUOTE_ACCEPTED_STATUSES } from './constants';

export const initialState = {
  isLoading: false,
  job: { data: {}, result: null, results: [] },
  message: { data: {} },
  meta: { tags: [] },
  quote: { data: {}, result: null, results: [] },
};

const cancelJobSuccess = (state, action) => {
  const { jobId } = action.payload.props;
  const { [jobId]: _, ...data } = state.job.data;

  return {
    ...state,
    isLoading: false,
    job: {
      data,
      result: null,
      results: Object.keys(data),
    },
  };
};

const createSuccess = (stateKey) => (state, action) => {
  const { data } = action?.payload || {};

  return merge(state, {
    isLoading: false,
    [stateKey]: {
      data: { [data.id]: { ...data } },
      result: data.id,
    },
  });
};

const createMessageSuccess = (state, action) => {
  const { data } = action?.payload || {};

  return merge(state, {
    isLoading: false,
    message: {
      data: {
        [data.tradieQuoteId]: [...state.message.data[data.tradieQuoteId], data],
      },
    },
  });
};

const fetchJobSuccess = (state, action) => {
  const { data } = action?.payload || {};
  let jobState = {};

  if (Array.isArray(data)) {
    // When array of jobs is returned
    jobState = data.reduce(
      (values, job) => ({
        data: { ...values.data, [job.id]: { ...job } },
        results: [...values.results, job.id],
      }),
      { data: {}, results: [] }
    );
  } else {
    // When single job is returned
    jobState = merge({ ...state.job }, { data: { [data.id]: { ...data } } });
  }

  return {
    ...state,
    isLoading: false,
    job: { ...state.job, ...jobState },
  };
};

const fetchMessageSuccess = (state, action) => {
  const { data, props } = action?.payload || {};

  return merge(state, {
    isLoading: false,
    message: { data: { [props.quoteId]: data } },
  });
};

const fetchMetaSuccess = (state, action) => {
  const { data, props } = action?.payload || {};

  return merge(state, {
    isLoading: false,
    meta: { [props.metaType]: data },
  });
};

const fetchQuoteSuccess = (state, action) => {
  const { data } = action?.payload || {};
  let quoteState = {};

  if (Array.isArray(data)) {
    // When array of quotes is returned
    quoteState = data.reduce(
      (values, quote) => ({
        data: { ...values.data, [quote.id]: quote },
        results: [...values.results, quote.id],
      }),
      { data: {}, results: [] }
    );
  } else {
    // When single quote is returned
    quoteState = merge({ ...state.quote }, { data: { [data.id]: data } });
  }

  return {
    ...state,
    isLoading: false,
    quote: { ...state.quote, ...quoteState },
  };
};

const updateAttachments = (state, action) => {
  const { attachableId, attachments, stateKey } = action?.payload || {};

  return {
    ...state,
    isLoading: false,
    [stateKey]: {
      ...state[stateKey],
      data: {
        ...state[stateKey].data,
        [attachableId]: {
          ...state[stateKey].data[attachableId],
          attachments,
        },
      },
    },
  };
};

const updateJobSuccess = (state, action) => {
  const { data } = action?.payload || {};

  return merge(state, {
    isLoading: false,
    job: { data: { [data.id]: { ...data } } },
  });
};

const updateQuoteSuccess = (state, action) => {
  const { data, props } = action?.payload || {};
  let job = {};

  if (QUOTE_ACCEPTED_STATUSES.includes(data.status) && data.tradieJobId) {
    // If quote has been accepted, then update job
    job = { data: { [data.tradieJobId]: { acceptedQuoteId: data.id } } };
  } else if (props?.hasReverted && data.tradieJobId) {
    // If accepted quote has been reverted, then update job
    job = { data: { [data.tradieJobId]: { acceptedQuoteId: null } } };
  }

  return merge(state, {
    isLoading: false,
    job,
    quote: { data: { [data.id]: { ...data } } },
  });
};

const isLoading = (value) => (state) =>
  merge(state, {
    isLoading: value,
    job: { result: null },
    quote: { result: null },
  });

export default createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    cancelJob: isLoading(true),
    cancelJobSuccess,
    createJob: isLoading(true),
    createJobSuccess: createSuccess('job'),
    createMessage: isLoading(true),
    createMessageSuccess,
    createQuote: isLoading(true),
    createQuoteSuccess: createSuccess('quote'),
    error: isLoading(false),
    fetchJob: isLoading(true),
    fetchJobSuccess,
    fetchMessage: isLoading(true),
    fetchMessageSuccess,
    fetchMeta: isLoading(true),
    fetchMetaSuccess,
    fetchQuote: isLoading(true),
    fetchQuoteSuccess,
    requestReview: isLoading(true),
    revertQuote: isLoading(true),
    recommendTradie: isLoading(true),
    success: isLoading(false),
    updateAttachments,
    updateJob: isLoading(true),
    updateJobSuccess,
    updateQuote: isLoading(true),
    updateQuoteSuccess,
  },
});
