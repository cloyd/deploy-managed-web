import {
  AUTHORIZE_APP,
  AUTHORIZE_APP_SUCCESS,
  FETCH_APP,
  FETCH_APP_ERROR,
  FETCH_APP_SUCCESS,
} from './constants';

export const initialState = {
  isLoading: false,
  oauthAppInfo: {
    isSuccess: false,
    hasTried: false,
  },
  oauthAuthorization: { redirectUri: '' },
};

export const reducer = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_APP:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_APP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        oauthAppInfo: { ...payload, hasTried: true, isSuccess: true },
      };
    case FETCH_APP_ERROR:
      return {
        ...state,
        isLoading: false,
        oauthAppInfo: { hasTried: true, isSuccess: false },
      };
    case AUTHORIZE_APP:
      return {
        ...state,
        isLoading: true,
      };
    case AUTHORIZE_APP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        oauthAuthorization: payload,
      };
    default:
      return state;
  }
};
