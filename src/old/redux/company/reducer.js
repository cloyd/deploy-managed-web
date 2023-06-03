import { ERROR, FETCH, SUCCESS, UPDATE } from './constants';

export const initialState = {
  isLoading: false,
};

export const reducer = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH:
    case UPDATE:
      return {
        ...state,
        isLoading: true,
      };

    case SUCCESS:
      return {
        ...state,
        isLoading: false,
        [payload.ownerType]: {
          ...state[payload.ownerType],
          [payload.ownerId]: payload,
        },
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
