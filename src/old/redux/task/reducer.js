import {
  ARCHIVE,
  ARCHIVE_SUCCESS,
  CREATE,
  CREATE_MESSAGE,
  CREATE_QUOTE,
  CREATE_SUCCESS,
  DESTROY,
  DESTROY_SUCCESS,
  DONE,
  ERROR,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_PROPERTY,
  FETCH_ALL_SUCCESS,
  FETCH_BPAY_BILLERS,
  FETCH_MESSAGES,
  FETCH_MESSAGES_SUCCESS,
  FETCH_META,
  FETCH_META_SUCCESS,
  FETCH_SIMILAR,
  FETCH_SIMILAR_SUCCESS,
  FETCH_TASK_ACTIVITIES,
  FETCH_TASK_ACTIVITIES_SUCCESS,
  SUCCESS,
  UPDATE,
  UPDATE_ATTACHMENTS,
} from './constants';

export const initialState = {
  isLoading: false,
  isLoadingIndex: false,
  isLoadingActivities: false,
  result: null,
  results: [],
  data: {},
  messages: {},
  activities: {},
  meta: {},
  categories: [],
  statuses: [],
  types: [],
  similar: {},
};

export const reducer = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE:
    case CREATE_QUOTE:
    case DESTROY:
    case ARCHIVE:
    case FETCH:
    case FETCH_MESSAGES:
    case FETCH_META:
    case FETCH_SIMILAR:
    case UPDATE:
      return {
        ...state,
        isLoading: true,
      };

    case CREATE_MESSAGE:
    case FETCH_TASK_ACTIVITIES:
      return {
        ...state,
        isLoadingActivities: true,
      };

    case FETCH_ALL:
    case FETCH_ALL_PROPERTY:
    case FETCH_BPAY_BILLERS:
      return {
        ...state,
        isLoadingIndex: true,
      };

    case CREATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        result: payload.result,
        results: [payload.result, ...state.results],
        data: {
          ...state.data,
          ...payload.data,
        },
      };

    case DESTROY_SUCCESS:
    case ARCHIVE_SUCCESS:
      const { [payload.taskId]: deleted, ...data } = state.data;

      return {
        ...state,
        data,
        isLoading: false,
      };

    case DONE:
    case ERROR:
      return {
        ...state,
        isLoading: false,
      };

    case FETCH_ALL_SUCCESS:
      return {
        ...state,
        isLoadingIndex: false,
        results: payload.result,
        data: {
          ...state.data,
          ...payload.data,
        },
      };

    case FETCH_MESSAGES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        messages: {
          ...state.messages,
          ...payload,
        },
      };

    case FETCH_SIMILAR_SUCCESS: {
      const { data, propertyId } = payload;
      const similarTasks = state.similar[propertyId]
        ? { ...state.similar[propertyId], ...data }
        : { ...data };

      return {
        ...state,
        isLoading: false,
        similar: {
          ...state.similar,
          [propertyId]: similarTasks,
        },
      };
    }

    case FETCH_TASK_ACTIVITIES_SUCCESS:
      return {
        ...state,
        isLoadingActivities: false,
        activities: {
          ...state.activities,
          ...payload,
        },
      };

    case FETCH_META_SUCCESS:
      const categories = Object.keys(payload)
        .reduce((acc, key) => acc.concat(payload[key].categories), [])
        .sort();

      const statuses = Object.keys(payload)
        .reduce((acc, key) => acc.concat(payload[key].statuses), [])
        .sort();

      return {
        ...state,
        isLoading: false,
        categories: [...new Set(categories)],
        statuses: [...new Set(statuses)],
        meta: {
          ...state.meta,
          ...payload,
        },
      };

    case SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: {
          ...state.data,
          ...payload.data,
        },
      };

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
