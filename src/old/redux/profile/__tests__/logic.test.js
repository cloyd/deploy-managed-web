/* eslint-disable no-undef */
import localStorage from 'store';

import reducer, { fetchProfile, initialState, logic } from '..';
import { mockHttpClient, mockReduxLogic } from '../../__mocks__';
import {
  CONFIRM,
  CONFIRM_SUCCESS,
  CREATE_SIGNATURE,
  DISABLE_AUTHY,
  DISABLE_AUTHY_SUCCESS,
  ERROR,
  FETCH,
  FETCH_SUCCESS,
  LOGIN,
  LOGIN_SUCCESS,
  LOGOUT,
  ONBOARDED,
  ONBOARDED_SUCCESS,
  RESET,
  RESET_SUCCESS,
  SUCCESS,
} from '../constants';

describe('profile/logic', () => {
  let params;
  let request;
  let store;

  const reduxErrorLogic = {
    error: true,
    payload: new Error('Request failed with status code 500'),
    type: ERROR,
  };

  beforeEach(() => {
    store = mockReduxLogic({
      initialState,
      logic,
      reducer,
    });
  });

  afterEach(() => {
    params = undefined;
    request = undefined;
    store = undefined;
  });

  describe('CONFIRM', () => {
    beforeEach(() => {
      params = { password: 'passwordpassword' };
      request = mockHttpClient.onPost(`/user/password-reset`, params);
    });

    it('should dispatch CONFIRM_SUCCESS on success', (done) => {
      store.dispatch({ type: CONFIRM, payload: params });
      request.reply(200, 'response');

      store.whenComplete(() => {
        const received = store.actions;
        const expected = { type: CONFIRM_SUCCESS, payload: 'response' };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: CONFIRM, payload: params });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxErrorLogic;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('CREATE_SIGNATURE', () => {
    beforeEach(() => {
      params = { signature: 'b' };
      request = mockHttpClient.onPost(`/user/create-signature`, params);
    });

    it('should dispatch SUCCESS on success', (done) => {
      store.dispatch({
        type: CREATE_SIGNATURE,
        payload: { ...params },
      });

      request.reply(200, { user: { id: 1 } });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: SUCCESS,
          payload: {
            data: { id: 1 },
            isScroll: false,
            message: '<strong>Success:</strong> Signature has been created.',
            type: 'profile',
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({
        type: CREATE_SIGNATURE,
        payload: { ...params },
      });

      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        expect(received).toContainEqual(reduxErrorLogic);
        done();
      });
    });
  });

  describe('ONBOARDED', () => {
    beforeEach(() => {
      request = mockHttpClient.onPost(`/onboarded`);
    });

    it('should dispatch ONBOARDED_SUCCESS on success', (done) => {
      request.reply(200, {});

      store.dispatch({
        type: ONBOARDED,
      });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = { type: ONBOARDED_SUCCESS };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      request.reply(500, {});

      store.dispatch({
        type: ONBOARDED,
      });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxErrorLogic;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('LOGIN', () => {
    beforeEach(() => {
      params = { password: 'passwordpassword', deviceFingerprint: 'abc' };
      request = mockHttpClient.onPost('/login', params);
    });

    it('should dispatch LOGIN_SUCCESS on success', (done) => {
      store.dispatch({ type: LOGIN, payload: params });
      request.reply(200, 'response');

      store.whenComplete(() => {
        const received = store.actions;
        const expected = { type: LOGIN_SUCCESS, payload: 'response' };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: LOGIN, payload: params });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxErrorLogic;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('LOGOUT', () => {
    beforeEach(() => {
      localStorage.each = (fn) => fn(undefined, 'test');
      window.location.assign = jest.fn();
      request = mockHttpClient.onPost('/logout');
    });

    it('should clear localStorage', (done) => {
      store.dispatch({ type: LOGOUT, payload: { isIdleTimeout: false } });

      request.reply(200);

      store.whenComplete(() => {
        const received = localStorage.remove;
        expect(received).toHaveBeenCalledWith('test');
        done();
      });
    });

    it('should assign location to /', (done) => {
      window.history.pushState({}, '', '/path');

      store.dispatch({ type: LOGOUT, payload: { isIdleTimeout: false } });

      request.reply(200);

      store.whenComplete(() => {
        const received = window.location.assign;
        const expected = '/';

        expect(received).toHaveBeenCalledWith(expected);
        done();
      });
    });

    it('should assign location to / when isIdleTimeout is true', (done) => {
      window.history.pushState({}, '', '/');

      store.dispatch({ type: LOGOUT, payload: { isIdleTimeout: true } });

      request.reply(200);

      store.whenComplete(() => {
        const received = window.location.assign;
        const expected = '/';

        expect(received).toHaveBeenCalledWith(expected);
        done();
      });
    });

    it('should not assign location to / when path is /', (done) => {
      window.history.pushState({}, '', '/');

      store.dispatch({ type: LOGOUT, payload: { isIdleTimeout: false } });

      request.reply(200);

      store.whenComplete(() => {
        const received = window.location.assign;
        expect(received).not.toHaveBeenCalled();
        done();
      });
    });

    it('should not assign location to / when path is /reset-password', (done) => {
      window.history.pushState({}, '', '/reset-password');

      store.dispatch({ type: LOGOUT, payload: { isIdleTimeout: false } });

      request.reply(200);

      store.whenComplete(() => {
        const received = window.location.assign;
        expect(received).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('FETCH', () => {
    beforeEach(() => {
      request = mockHttpClient.onGet(`/user/profile`);
    });

    it('should dispatch PROFILE_SUCCESS on success', (done) => {
      store.dispatch({ type: FETCH });
      request.reply(200, { user: 'response' });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = { type: FETCH_SUCCESS, payload: 'response' };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: FETCH });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxErrorLogic;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('RESET', () => {
    beforeEach(() => {
      params = { password: 'passwordpassword' };
      request = mockHttpClient.onPost(`/user/trigger-password-reset`, params);
    });

    it('should dispatch RESET_SUCCESS on success', (done) => {
      store.dispatch({ type: RESET, payload: params });
      request.reply(200, 'response');

      store.whenComplete(() => {
        const received = store.actions;
        const expected = { type: RESET_SUCCESS, payload: 'response' };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: RESET, payload: params });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxErrorLogic;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('DISABLE_AUTHY', () => {
    beforeEach(() => {
      request = mockHttpClient.onPost(`/user/disable-authy`);
    });

    it('should dispatch DISABLE_AUTHY_SUCCESS on success', (done) => {
      store.dispatch({ type: DISABLE_AUTHY });
      request.reply(204, { message: 'message' });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: DISABLE_AUTHY_SUCCESS,
          payload: {
            message: 'message',
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: DISABLE_AUTHY, payload: params });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxErrorLogic;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('LOGIN_SUCCESS', () => {
    beforeEach(() => {
      localStorage.set = jest.fn();
      store.dispatch({
        type: LOGIN_SUCCESS,
        payload: { authToken: '123', isAuhtyEnabled: false },
      });
    });

    it('should set the authToken in localStorage', () => {
      const received = localStorage.set;
      const expected = '123';

      expect(received).toHaveBeenCalledWith('authToken', expected);
    });

    it('should dipatch fetchProfile', () => {
      const received = store.actions;
      const expected = fetchProfile();

      expect(received).toContainEqual(expected);
    });
  });
});
