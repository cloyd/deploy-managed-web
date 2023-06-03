import merge from 'lodash/fp/merge';

import {
  CONFIRM,
  CONFIRM_SUCCESS,
  CREATE_AVATAR_SUCCESS,
  DISABLE_AUTHY,
  DISABLE_AUTHY_SUCCESS,
  ENABLE_AUTHY,
  ENABLE_AUTHY_SUCCESS,
  ERROR,
  FETCH,
  FETCH_SESSION_TIMEOUT_SUCCESS,
  FETCH_SUCCESS,
  LOGIN,
  LOGIN_SUCCESS,
  LOGOUT,
  ONBOARDED_SUCCESS,
  REQUEST_AUTHY_SMS,
  REQUEST_AUTHY_SMS_ERROR,
  RESET,
  RESET_SUCCESS,
  SET_AUTH_TOKEN,
  SUCCESS,
  UPDATE_PROFILE,
  VERIFY_AUTHY,
  VERIFY_AUTHY_ERROR,
  VERIFY_AUTHY_SUCCESS,
} from './constants';

export const initialState = {
  authToken: null,
  data: {},
  isLoading: false,
  message: '',
};

export const reducer = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case CONFIRM:
    case FETCH:
    case LOGIN:
    case LOGOUT:
    case RESET:
    case ENABLE_AUTHY:
    case DISABLE_AUTHY:
    case VERIFY_AUTHY:
    case REQUEST_AUTHY_SMS:
      return {
        ...state,
        isLoading: true,
        message: '',
      };

    case CONFIRM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: payload,
      };

    case ENABLE_AUTHY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isForced: payload.isForced,
        message: payload.message,
      };

    case DISABLE_AUTHY_SUCCESS:
    case RESET_SUCCESS:
    case SUCCESS:
      return {
        ...state,
        isLoading: false,
        message: payload.message,
      };

    case ERROR:
    case REQUEST_AUTHY_SMS_ERROR:
    case VERIFY_AUTHY_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    case LOGIN_SUCCESS: {
      const { authToken, ...profile } = payload;
      return {
        ...state,
        authToken,
        data: profile,
        isLoading: false,
      };
    }

    case ONBOARDED_SUCCESS: {
      return {
        ...state,
        data: { ...state.data, isOnboarded: true },
      };
    }

    case FETCH_SESSION_TIMEOUT_SUCCESS:
      return {
        ...state,
        sessionTimeout: payload,
      };

    case FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: merge({ ...state.data }, payload),
      };

    case CREATE_AVATAR_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: merge({ ...state.data }, payload.data),
      };

    case SET_AUTH_TOKEN:
      return {
        ...state,
        authToken: payload.authToken,
      };

    case VERIFY_AUTHY_SUCCESS:
      const { authToken } = payload;
      return {
        ...state,
        authToken,
        data: { ...state.data, isAuthyVerified: true },
      };

    case UPDATE_PROFILE:
      const { data } = payload;

      return {
        ...state,
        data: {
          ...state.data,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
        },
      };
    default:
      return state;
  }
};
