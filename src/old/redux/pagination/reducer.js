import { RESET, SET } from './constants';

export const initialState = {
  data: {},
};

export const reducer = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case SET:
      return {
        ...state,
        data: {
          ...state.data,
          [payload.key]: payload.data,
        },
      };
    case RESET:
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};
