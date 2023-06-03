import { ERROR, FETCH, SUCCESS } from './constants';

export const initialState = {
  isLoading: false,
};

export const reducer = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH:
      return {
        ...state,
        isLoading: true,
      };

    case SUCCESS:
      return {
        ...state,
        ...payload,
        isLoading: false,
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
