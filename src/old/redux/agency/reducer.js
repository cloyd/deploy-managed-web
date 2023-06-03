import {
  ERROR,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  SUCCESS,
  UPDATE,
} from './constants';

export const initialState = {
  isLoading: false,
  agencies: [],
  agency: {},
};

export const reducer = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH:
    case FETCH_ALL:
    case UPDATE:
      return {
        ...state,
        isLoading: true,
      };

    case SUCCESS:
      return {
        ...state,
        isLoading: false,
        agency: {
          ...state.agency,
          ...payload,
        },
      };

    case FETCH_ALL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        results: payload.results,
        agencies: payload,
      };

    case ERROR:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
};
