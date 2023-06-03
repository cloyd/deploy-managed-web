import {
  ADJUST_INTENTION,
  ADJUST_INTENTION_SUCCESS,
  DESTROY_INTENTION,
  DESTROY_INTENTION_SUCCESS,
  ERROR,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  FETCH_SUCCESS,
  PAY_INTENTION,
} from './constants';

export const initialState = {
  isLoading: false,
  payableLoading: false,
  completedLoading: false,
  intentionToDelete: 0,
  data: {},
  completed: {},
  payable: {},
  results: [],
};

export const reducer = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_ALL:
      return {
        ...state,
        ...(['payable', 'completed'].includes(payload?.fetchType) && {
          [`${payload.fetchType}Loading`]: true,
        }),
        isLoading: true,
      };
    case FETCH:
    case ADJUST_INTENTION:
    case PAY_INTENTION:
      return {
        ...state,
        isLoading: true,
      };

    case DESTROY_INTENTION:
      return {
        ...state,
        intentionToDelete: action?.payload?.intentionId,
      };

    case FETCH_ALL_SUCCESS:
      // Check if results are to be keyed to a certain type e.g. 'payable' or 'completed'
      const resultsKey = payload.type ? payload.type : 'results';

      return {
        ...state,
        isLoading: false,
        isDeleting: false,
        [resultsKey]: payload.results,
        ...(['payable', 'completed'].includes(payload?.type) && {
          [`${payload.type}Loading`]: false,
        }),
        data: {
          ...state.data,
          ...payload.data,
        },
      };

    case FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: {
          ...state.data,
          ...payload.data,
        },
      };

    case ERROR:
    case ADJUST_INTENTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };

    case DESTROY_INTENTION_SUCCESS:
      return {
        ...state,
        intentionToDelete: 0,
      };
    default:
      return state;
  }
};
