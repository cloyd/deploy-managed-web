import {
  CONFIRM,
  CREATE_AVATAR,
  CREATE_SIGNATURE,
  DELETE_AVATAR,
  DISABLE_AUTHY,
  ENABLE_AUTHY,
  FETCH,
  FETCH_SESSION_TIMEOUT,
  LAUNCH_INTERCOM,
  LOGIN,
  LOGOUT,
  ONBOARDED,
  REQUEST_AUTHY_SMS,
  RESET,
  SEND_KEEP_ALIVE,
  SET_AUTH_TOKEN,
  UPDATE_PROFILE,
  VERIFY_AUTHY,
} from './constants';

export const confirmPassword = ({
  password,
  passwordConfirmation,
  resetPasswordToken,
  authyToken,
}) => ({
  type: CONFIRM,
  payload: {
    password,
    passwordConfirmation,
    resetPasswordToken,
    authyToken,
  },
});

export const markOnboarded = () => ({ type: ONBOARDED });

export const createAvatar = (dataURL) => ({
  type: CREATE_AVATAR,
  payload: { avatar: dataURL },
});

export const createSignature = ({ signature }) => ({
  type: CREATE_SIGNATURE,
  payload: { signature },
});

export const deleteAvatar = () => ({ type: DELETE_AVATAR });

export const fetchProfile = () => ({ type: FETCH });

export const loginUser = ({ email, password }) => ({
  type: LOGIN,
  payload: { email, password },
});

export const logoutUser = (
  isIdleTimeout = false,
  message = '',
  isForced = false
) => ({
  type: LOGOUT,
  payload: { isIdleTimeout, message, isForced },
});

export const resetPassword = ({ email }) => ({
  type: RESET,
  payload: { email },
});

export const setStoreAuthToken = (authToken) => ({
  type: SET_AUTH_TOKEN,
  payload: { authToken },
});

export const requestAuthySMS = (email) => ({
  type: REQUEST_AUTHY_SMS,
  payload: { email },
});

export const disableAuthy = ({ authyToken }) => ({
  type: DISABLE_AUTHY,
  payload: { authyToken },
});

export const enableAuthy = ({ authyToken, isForced = false }) => ({
  type: ENABLE_AUTHY,
  payload: { authyToken, isForced },
});

export const verifyAuthy = ({ authyToken, email }) => ({
  type: VERIFY_AUTHY,
  payload: { authyToken, email },
});

export const launchIntercom = (profile, settings) => ({
  type: LAUNCH_INTERCOM,
  payload: { profile, settings },
});

export const fetchSessionTimeout = () => ({
  type: FETCH_SESSION_TIMEOUT,
});

export const sendKeepAlive = () => ({
  type: SEND_KEEP_ALIVE,
});

export const updateProfile = (data) => ({
  type: UPDATE_PROFILE,
  payload: { data },
});
