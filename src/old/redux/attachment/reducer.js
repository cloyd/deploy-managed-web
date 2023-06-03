import {
  ATTACHED,
  ERROR,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  UPDATE_ALL,
  UPDATE_ALL_SUCCESS,
  UPDATE_TASK,
} from './constants';

export const initialState = {
  data: {},
  isLoading: false,
  result: null,
  results: [],
};

export const reducer = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case ATTACHED:
      return {
        ...state,
        isLoading: false,
        data: {
          ...state.data,
          [payload.attachmentId]: {
            ...state.data[payload.attachmentId],
            isAttached: true,
          },
        },
      };

    // Set Task associated to Attachment
    case UPDATE_TASK:
      const { attachmentId, propertyId, taskId } = payload;

      return {
        ...state,
        isLoading: false,
        data: {
          ...state.data,
          [attachmentId]: {
            ...state.data[attachmentId],
            propertyId,
            taskId,
          },
        },
      };

    case FETCH_ALL:
      return {
        ...state,
        isLoading:
          payload && payload.params ? !!payload.params.isLoading : true,
      };

    case UPDATE_ALL:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_ALL_SUCCESS:
    case UPDATE_ALL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        results: payload.result,
        data: {
          ...state.data,
          ...payload.data,
        },
      };

    case ERROR:
      return {
        ...state,
        isLoading: false,
        result: null,
        results: [],
      };

    default:
      return state;
  }
};
