import merge from 'lodash/fp/merge';

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
  RESET_PROPERTY,
  RESET_RESULTS,
  SUCCESS,
  UNARCHIVE,
  UNARCHIVE_SUCCESS,
  UPDATE,
  UPDATE_ATTACHMENTS,
} from './constants';

// Initial state
export const initialState = {
  data: {},
  financials: {},
  isLoading: false,
  result: null,
  results: [],
};

// Reducer
export const reducer = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE:
    case DESTROY:
    case ARCHIVE:
    case UNARCHIVE:
    case FETCH:
    case FETCH_ALL:
    case FETCH_FINANCIALS:
    case FETCH_TRANSACTIONS:
    case FETCH_FEE_AUDITS:
    case UPDATE:
      return {
        ...state,
        isLoading: true,
      };

    case DESTROY_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          [payload.id]: undefined,
        },
        isLoading: false,
      };

    case ARCHIVE_SUCCESS:
      const { id, isArchived } = payload;

      return {
        ...state,
        isLoading: false,
        data: {
          ...state.data,
          [id]: {
            ...state.data[id],
            isArchived,
          },
        },
      };

    case UNARCHIVE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: {
          ...state.data,
          [id]: {
            ...state.data[id],
            isArchived,
          },
        },
      };

    case ERROR:
    case RESET_RESULTS:
      return {
        ...state,
        isLoading: false,
        result: null,
        results: [],
      };

    case RESET_PROPERTY:
      return {
        ...state,
        isLoading: false,
        result: null,
      };

    case FETCH_ALL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        results: payload.result,
        data: merge({ ...state.data }, payload.data),
      };

    case FETCH_FINANCIALS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        financials: {
          ...state.financials,
          ...payload,
        },
      };

    case FETCH_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        transactions: {
          ...state.transactions,
          ...payload,
        },
      };

    case FETCH_FEE_AUDITS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        audits: {
          ...state.audits,
          ...payload,
        },
      };

    case SUCCESS: {
      return {
        ...state,
        isLoading: false,
        result: payload.result,
        data: Object.assign({}, state.data, payload.data),
      };
    }

    case UPDATE_ATTACHMENTS:
      return {
        ...state,
        data: {
          ...state.data,
          [payload.attachableId]: {
            ...state.data[payload.attachableId],
            attachments: payload.attachments,
          },
        },
      };

    default:
      return state;
  }
};
