import flow from 'lodash/fp/flow';
import { createLogic } from 'redux-logic';

import {
  getDataWithProps,
  processDeleteWithProps,
  processError,
  processGetWithProps,
  processPostWithProps,
  processPutWithProps,
  processSuccess,
} from '../helpers/logic';
import { JOB_TYPE } from './constants';
import marketplace from './reducer';

const {
  cancelJob,
  cancelJobSuccess,
  createJob,
  createJobSuccess,
  createMessage,
  createMessageSuccess,
  createQuote,
  createQuoteSuccess,
  error,
  fetchJob,
  fetchJobSuccess,
  fetchMessage,
  fetchMessageSuccess,
  fetchMeta,
  fetchMetaSuccess,
  fetchQuote,
  fetchQuoteSuccess,
  requestReview,
  revertQuote,
  recommendTradie,
  success,
  updateJob,
  updateJobSuccess,
  updateQuote,
  updateQuoteSuccess,
} = marketplace.actions;

/**
 * Process helpers
 */
const processGet = flow(processGetWithProps, getDataWithProps);

const processPost = flow(processPostWithProps, getDataWithProps);

const processPut = flow(processPutWithProps, getDataWithProps);

const processDelete = flow(processDeleteWithProps, getDataWithProps);

/**
 * Actions logic
 */
export const cancelJobLogic = createLogic({
  type: cancelJob,
  processOptions: {
    successType: cancelJobSuccess,
    failType: error,
  },
  transform: ({ action }, next, reject) => {
    const { jobId } = action.payload;

    if (jobId) {
      next({
        ...action,
        payload: {
          endpoint: `/tradie-jobs/${jobId}`,
          props: {
            jobId,
            isRedirect: true,
            message: 'job is cancelled',
          },
        },
      });
    } else {
      reject(error({ message: 'job ID is required' }));
    }
  },
  process: processDelete,
});

export const createJobLogic = createLogic({
  type: createJob,
  processOptions: {
    successType: createJobSuccess,
    failType: error,
  },
  transform: ({ action }, next, reject) => {
    const params = action.payload;
    const endpoint =
      params.jobType === JOB_TYPE.quote
        ? '/tradie-jobs'
        : '/tradie-jobs/work-orders';

    if (params.propertyTaskId) {
      next({
        type: action.type,
        payload: {
          endpoint,
          params,
          props: { message: 'job has been created.' },
        },
      });
    } else {
      reject(error({ message: 'task id is required' }));
    }
  },
  process: processPost,
});

export const createMessageLogic = createLogic({
  type: createMessage,
  processOptions: {
    successType: createMessageSuccess,
    failType: error,
  },
  transform: ({ action }, next, reject) => {
    const params = action.payload;

    if (params.tradieQuoteId) {
      next({
        type: action.type,
        payload: { endpoint: '/tradie-quote-messages', params },
      });
    } else {
      reject(error({ message: 'quote id is required' }));
    }
  },
  process: processPost,
});

export const createQuoteLogic = createLogic({
  type: createQuote,
  processOptions: {
    successType: createQuoteSuccess,
    failType: error,
  },
  transform: ({ action }, next, reject) => {
    const params = action.payload;

    if (params.tradieJobId) {
      next({
        type: action.type,
        payload: {
          endpoint: '/tradie-quotes',
          params,
          props: {
            isRedirect: !!params.tradieIds,
            message: params.tradieIds
              ? 'tradies have been notified about the job.'
              : 'job has been updated.',
          },
        },
      });
    } else {
      reject(error({ message: 'job id is required' }));
    }
  },
  process: processPost,
});

export const errorMessageLogic = createLogic({
  type: [error],
  process: flow(processError),
});

export const fetchJobLogic = createLogic({
  type: fetchJob,
  processOptions: {
    successType: fetchJobSuccess,
    failType: error,
  },
  transform: ({ action }, next) => {
    const { jobId, ...params } = action.payload;
    const endpoint = jobId ? `/tradie-jobs/${jobId}` : '/tradie-jobs';

    next({
      type: action.type,
      payload: { endpoint, params },
    });
  },
  process: processGet,
});

export const fetchMessageLogic = createLogic({
  type: fetchMessage,
  processOptions: {
    successType: fetchMessageSuccess,
    failType: error,
  },
  transform: ({ action }, next) => {
    const { quoteId, ...params } = action.payload;

    next({
      type: action.type,
      payload: {
        endpoint: `/tradie-quotes/${quoteId}/activities`,
        params,
        props: { quoteId },
      },
    });
  },
  process: processGet,
});

export const fetchMetaLogic = createLogic({
  type: fetchMeta,
  processOptions: {
    successType: fetchMetaSuccess,
    failType: error,
  },
  transform: ({ action }, next, reject) => {
    const { metaType } = action.payload;

    if (metaType) {
      next({
        type: action.type,
        payload: {
          endpoint: `/${metaType}`,
          props: { metaType },
        },
      });
    } else {
      reject(error({ message: 'meta type is required' }));
    }
  },
  process: processGet,
});

export const fetchQuoteLogic = createLogic({
  type: fetchQuote,
  processOptions: {
    successType: fetchQuoteSuccess,
    failType: error,
  },
  transform: ({ action }, next) => {
    const { quoteId, ...params } = action.payload;
    const endpoint = quoteId ? `/tradie-quotes/${quoteId}` : '/tradie-quotes';

    next({
      type: action.type,
      payload: { endpoint, params },
    });
  },
  process: processGet,
});

export const requestReviewLogic = createLogic({
  type: requestReview,
  processOptions: {
    successType: success,
    failType: error,
  },
  transform: ({ action }, next) => {
    const { jobId } = action.payload;

    next({
      type: action.type,
      payload: {
        endpoint: `/tradie-jobs/${jobId}/owner-review-requests`,
        props: { message: 'owner has been requested to review this job.' },
      },
    });
  },
  process: processPost,
});

export const revertQuoteLogic = createLogic({
  type: revertQuote,
  processOptions: {
    successType: updateQuoteSuccess,
    failType: error,
  },
  transform: ({ action }, next, reject) => {
    const { quoteId } = action.payload;

    if (quoteId) {
      next({
        type: action.type,
        payload: {
          endpoint: `/tradie-quotes/${quoteId}/reversals`,
          props: {
            hasReverted: true,
            message: 'acceptance has been reverted.',
          },
        },
      });
    } else {
      reject(error({ message: 'item ID is required' }));
    }
  },
  process: processPost,
});

export const recommendTradieLogic = createLogic({
  type: recommendTradie,
  processOptions: {
    successType: updateQuoteSuccess,
    failType: error,
  },
  transform: ({ action }, next, reject) => {
    const { quoteId, ...params } = action.payload;

    if (quoteId) {
      next({
        type: action.type,
        payload: {
          endpoint: `/tradie-quotes/${quoteId}/recommends`,
          params,
        },
      });
    } else {
      reject(error({ message: 'quote ID is required' }));
    }
  },
  process: processPost,
});

export const successMessageLogic = createLogic({
  type: [
    cancelJobSuccess,
    createJobSuccess,
    createQuoteSuccess,
    success,
    updateJobSuccess,
    updateQuoteSuccess,
  ],
  process: flow(processSuccess),
});

export const updateJobLogic = createLogic({
  type: updateJob,
  processOptions: {
    successType: updateJobSuccess,
    failType: error,
  },
  transform: ({ action }, next, reject) => {
    const { jobId, ...params } = action.payload;

    if (jobId) {
      next({
        type: action.type,
        payload: {
          endpoint: `/tradie-jobs/${jobId}`,
          params,
          props: { message: 'job has been updated.' },
        },
      });
    } else {
      reject(error({ message: 'job ID is required' }));
    }
  },
  process: processPut,
});

export const updateQuoteLogic = createLogic({
  type: updateQuote,
  processOptions: {
    successType: updateQuoteSuccess,
    failType: error,
  },
  transform: ({ action }, next, reject) => {
    const { quoteId, ...params } = action.payload;

    if (quoteId) {
      next({
        type: action.type,
        payload: {
          endpoint: `/tradie-quotes/${quoteId}`,
          params,
          props: { message: 'job has been updated.' },
        },
      });
    } else {
      reject(error({ message: 'quote ID is required' }));
    }
  },
  process: processPut,
});
