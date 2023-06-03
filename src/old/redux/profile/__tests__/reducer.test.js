/* eslint-disable no-undef */
import reducer, { initialState } from '..';
import {
  CONFIRM,
  DISABLE_AUTHY,
  DISABLE_AUTHY_SUCCESS,
  ERROR,
  FETCH,
  FETCH_SUCCESS,
  LOGIN,
  ONBOARDED_SUCCESS,
  RESET,
  RESET_SUCCESS,
  SET_AUTH_TOKEN,
} from '../constants';

describe('profile/initialState', () => {
  it('should define the initialState', () => {
    const received = initialState;
    const expected = {
      authToken: null,
      isLoading: false,
      message: '',
      data: {},
    };

    expect(received).toEqual(expected);
  });
});

describe('user/reducer', () => {
  [CONFIRM, LOGIN, FETCH, RESET, DISABLE_AUTHY].map((type) => {
    it(`should handle ${type}`, () => {
      const state = {
        ...initialState,
        isLoading: false,
        message: 'message',
      };

      const received = reducer(state, { type });
      const expected = { ...state, isLoading: true, message: '' };

      expect(received).toEqual(expected);
    });
  });

  it('should handle ONBOARDED_SUCCESS', () => {
    const state = {
      ...initialState,
      data: {
        isOnboarded: false,
      },
    };

    const received = reducer(state, {
      type: ONBOARDED_SUCCESS,
    });

    const expected = {
      ...state,
      data: {
        isOnboarded: true,
      },
    };

    expect(received).toEqual(expected);
  });

  it('should handle FETCH_SUCCESS', () => {
    const state = { ...initialState, isLoading: true };
    const received = reducer(state, {
      type: FETCH_SUCCESS,
      payload: { hello: 'world' },
    });

    const expected = {
      ...state,
      isLoading: false,
      data: { hello: 'world' },
    };

    expect(received).toEqual(expected);
  });

  it('should handle RESET_SUCCESS', () => {
    const state = { ...initialState, isLoading: true, message: 'message' };
    const received = reducer(state, {
      type: RESET_SUCCESS,
      payload: {
        message: 'payload.message',
      },
    });

    const expected = {
      ...state,
      isLoading: false,
      message: 'payload.message',
    };

    expect(received).toEqual(expected);
  });

  it('should handle DISABLE_AUTHY_SUCCESS', () => {
    const state = { ...initialState, isLoading: true };
    const received = reducer(state, {
      type: DISABLE_AUTHY_SUCCESS,
      payload: {
        message: 'payload.message',
      },
    });

    const expected = {
      ...state,
      isLoading: false,
      message: 'payload.message',
    };

    expect(received).toEqual(expected);
  });

  it('should handle SET_AUTH_TOKEN', () => {
    const authToken = 'test-token';
    const state = { ...initialState, isLoading: true };
    const received = reducer(state, {
      type: SET_AUTH_TOKEN,
      payload: { authToken },
    });

    const expected = {
      ...state,
      authToken,
      isLoading: true,
    };

    expect(received).toEqual(expected);
  });

  [ERROR].map((type) => {
    it(`should handle ${type}`, () => {
      const state = {
        ...initialState,
        isLoading: true,
      };

      const received = reducer(state, { type });
      const expected = { ...state, isLoading: false };

      expect(received).toEqual(expected);
    });
  });
});
