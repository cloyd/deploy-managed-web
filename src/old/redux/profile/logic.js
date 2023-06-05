import localStorage from 'store';

// Fetch user role info
import { INACTIVITY_TIMEOUT_MESSAGE, showAlert } from '../notifier';
import { fetchSettings } from '../settings';
import { fetchUser } from '../users';
import { fetchProfile, logoutUser } from './actions';
import {
  CONFIRM,
  CONFIRM_SUCCESS,
  CREATE_AVATAR,
  CREATE_AVATAR_SUCCESS,
  CREATE_SIGNATURE,
  DELETE_AVATAR,
  DISABLE_AUTHY,
  DISABLE_AUTHY_SUCCESS,
  ENABLE_AUTHY,
  ENABLE_AUTHY_SUCCESS,
  ERROR,
  FETCH,
  FETCH_SESSION_TIMEOUT,
  FETCH_SESSION_TIMEOUT_SUCCESS,
  FETCH_SUCCESS,
  LAUNCH_INTERCOM,
  LOGIN,
  LOGIN_SUCCESS,
  LOGOUT,
  LOGOUT_SUCCESS,
  ONBOARDED,
  ONBOARDED_SUCCESS,
  REQUEST_AUTHY_SMS,
  REQUEST_AUTHY_SMS_ERROR,
  RESET,
  RESET_SUCCESS,
  SEND_KEEP_ALIVE,
  SEND_KEEP_ALIVE_SUCCESS,
  SUCCESS,
  VERIFY_AUTHY,
  VERIFY_AUTHY_ERROR,
  VERIFY_AUTHY_SUCCESS,
} from './constants';

export const logic = [
  {
    type: CONFIRM,
    processOptions: {
      successType: CONFIRM_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      return httpClient
        .post(`/user/password-reset`, action.payload)
        .then((response) => response.data);
    },
  },

  {
    type: CREATE_AVATAR,
    processOptions: {
      successType: CREATE_AVATAR_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { avatar } = action.payload;

      return httpClient.post(`/user/avatar`, { avatar }).then((response) => ({
        data: response.data.user,
        isScroll: true,
        message: '<strong>Success:</strong> Avatar has been updated',
      }));
    },
  },

  {
    type: CREATE_SIGNATURE,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { signature } = action.payload;

      return httpClient
        .post(`/user/create-signature`, { signature })
        .then(({ data }) => ({
          data: data && data.user ? data.user : {},
          isScroll: false,
          message: '<strong>Success:</strong> Signature has been created.',
          type: 'profile',
        }));
    },
  },

  {
    type: DELETE_AVATAR,
    processOptions: {
      successType: CREATE_AVATAR_SUCCESS,
      failType: ERROR,
    },
    process({ httpClient }) {
      return httpClient.delete('/user/avatar').then((response) => {
        return {
          data: response.data.user,
          isScroll: true,
          message: '<strong>Success:</strong> Avatar has been deleted.',
        };
      });
    },
  },

  {
    type: FETCH,
    processOptions: {
      successType: FETCH_SUCCESS,
      failType: ERROR,
    },
    process({ httpClient }) {
      return httpClient
        .get(`/user/profile`)
        .then((response) => response.data.user);
    },
  },

  {
    type: FETCH_SESSION_TIMEOUT,
    processOptions: {
      successType: FETCH_SESSION_TIMEOUT_SUCCESS,
      failType: ERROR,
    },
    process({ httpClient }) {
      return httpClient
        .get(`/check-session-timeout`)
        .then((response) => response.data.remainingTime);
    },
  },

  {
    type: SEND_KEEP_ALIVE,
    processOptions: {
      successType: SEND_KEEP_ALIVE_SUCCESS,
      failType: ERROR,
    },
    process({ httpClient }) {
      return httpClient.post(`/keep-alive`).then((response) => response.data);
    },
  },

  {
    type: LOGIN,
    processOptions: {
      successType: LOGIN_SUCCESS,
      failType: ERROR,
    },
    async transform({ action }, next) {
      next({
        ...action,
        payload: action.payload,
      });
    },
    process({ action, httpClient }) {
      console.log('httpClient', httpClient);
      console.log('baseURL', httpClient.baseURL);

      debugger;
      return httpClient
        .post(`/login`, action.payload)
        .then((response) => response.data);
    },
  },

  {
    type: LOGOUT,
    processOptions: {
      successType: LOGOUT_SUCCESS,
      failType: ERROR,
    },
    debounce: 500,
    latest: true,
    process({ httpClient, action }) {
      const { isIdleTimeout, message, isForced = false } = action.payload;

      /*
         In the case where multiple tabs are logging out around the same time,
         the first tab to logout will invalidate the token and cause the rest
         of the logouts to fail. For the remaining logouts, the following
         code block should still proceed.

         TODO: Proceed only for a 401 logout return. Redirect with an error messsage
               for other error types.
      */
      return httpClient.post(`/logout`).finally(() => {
        localStorage.each(function (_, key) {
          if (key.includes('persist')) return;
          localStorage.remove(key);
        });

        if (message) {
          localStorage.set('notifier', message);
          localStorage.set('notifier_type', 'success');
        }

        // Redirect if not already on index or reset-password
        if (isIdleTimeout) {
          localStorage.set('notifier', INACTIVITY_TIMEOUT_MESSAGE);
          window.location.assign('/');
        } else if (
          window.location.pathname !== '/' &&
          window.location.pathname !== '/reset-password' &&
          !isForced
        ) {
          window.location.assign('/');
        }
      });
    },
  },

  {
    type: ONBOARDED,
    processOptions: {
      successType: ONBOARDED_SUCCESS,
      failType: ERROR,
    },
    process({ httpClient }) {
      return httpClient.post(`/onboarded`).then(() => {
        window.location.assign('/');
      });
    },
  },

  {
    type: RESET,
    processOptions: {
      successType: RESET_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      return httpClient
        .post('/user/trigger-password-reset', action.payload)
        .then((response) => response.data);
    },
  },

  {
    type: REQUEST_AUTHY_SMS,
    processOptions: {
      successType: SUCCESS,
      failType: REQUEST_AUTHY_SMS_ERROR,
    },
    process({ action, httpClient }) {
      return httpClient
        .post(`/user/request-authy-sms`, action.payload)
        .then((response) => response.data);
    },
  },

  {
    type: ENABLE_AUTHY,
    processOptions: {
      successType: ENABLE_AUTHY_SUCCESS,
      failType: ERROR,
    },
    async transform({ action }, next) {
      next({
        ...action,
        payload: action.payload,
      });
    },
    process({ action, httpClient }) {
      return httpClient
        .post('user/enable-authy', action.payload)
        .then((response) => ({
          ...response.data,
          isForced: action.payload?.isForced,
        }));
    },
  },

  {
    type: VERIFY_AUTHY,
    processOptions: {
      successType: VERIFY_AUTHY_SUCCESS,
      failType: VERIFY_AUTHY_ERROR,
    },
    async transform({ action }, next) {
      next({
        ...action,
        payload: action.payload,
      });
    },
    process({ action, httpClient }) {
      return httpClient
        .post('/user/verify-authy', action.payload)
        .then((response) => response.data);
    },
  },

  {
    type: DISABLE_AUTHY,
    processOptions: {
      successType: DISABLE_AUTHY_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      return httpClient
        .post(`/user/disable-authy`, action.payload)
        .then((response) => response.data);
    },
  },

  {
    type: LOGIN_SUCCESS,
    process({ action }, dispatch, done) {
      const { authToken, isAuthyEnabled, isThisDeviceRemembered } =
        action.payload;

      if (!isAuthyEnabled || isThisDeviceRemembered) {
        localStorage.set('authToken', authToken);
        dispatch(fetchProfile());
      }
      done();
    },
  },

  {
    type: CONFIRM_SUCCESS,
    process({ action }, dispatch, done) {
      localStorage.set('authToken', action.payload.authToken);
      dispatch(fetchProfile());
      done();
    },
  },

  {
    type: [VERIFY_AUTHY_SUCCESS],
    process({ action }, dispatch, done) {
      localStorage.set('authToken', action.payload.authToken);
      done();
    },
  },

  {
    type: [SUCCESS, RESET_SUCCESS, CREATE_AVATAR_SUCCESS],
    process({ action, httpClient }, dispatch, done) {
      const { isScroll, message } = action.payload;
      message && dispatch(showAlert({ color: 'success', isScroll, message }));
      done();
    },
  },

  {
    type: [ENABLE_AUTHY_SUCCESS, DISABLE_AUTHY_SUCCESS],
    process({ action }, dispatch, done) {
      const { message, isForced } = action.payload;
      if (isForced) {
        dispatch(logoutUser(false, null, true));
      } else {
        message && dispatch(showAlert({ color: 'success', message }));
        dispatch(fetchProfile());
      }
      done();
    },
  },

  {
    type: FETCH_SUCCESS,
    process({ action }, dispatch, done) {
      const { id, role } = action.payload;

      if (id && role) {
        dispatch(fetchUser({ id, type: role }));
        dispatch(fetchSettings());
      }
      done();
    },
  },

  {
    type: LAUNCH_INTERCOM,
    process({ action }) {
      const { firstName, lastName, email, role, associatedAgencies } =
        action.payload.profile;

      const { intercomAppId, intercomVerticalPadding } =
        action.payload.settings;

      const isMobile = window.innerWidth < 992;
      // do not show by default on mobile screen width
      window.Intercom('boot', {
        app_id: intercomAppId,
        custom_launcher_selector: '#intercom_launcher',
        vertical_padding: intercomVerticalPadding,
        name: `${firstName} ${lastName}`,
        email: email,
        role: role,
        associatedAgencies: associatedAgencies,
        hide_default_launcher: isMobile,
      });
    },
  },
];
