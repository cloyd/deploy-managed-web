import reducer, { initialState } from '..';
import {
  AUTHORIZE_APP,
  AUTHORIZE_APP_SUCCESS,
  FETCH_APP,
  FETCH_APP_ERROR,
  FETCH_APP_SUCCESS,
} from '../constants';

describe('oauth/reducer', () => {
  it('should define the initial state', () => {
    const received = initialState;
    const expected = {
      isLoading: false,
      oauthAppInfo: {
        isSuccess: false,
        hasTried: false,
      },
      oauthAuthorization: { redirectUri: '' },
    };

    expect(received).toEqual(expected);
  });

  [AUTHORIZE_APP, FETCH_APP].map((type) => {
    it(`should handle ${type}`, () => {
      const state = {
        ...initialState,
        isLoading: false,
      };

      const received = reducer(state, { type });
      const expected = { ...state, isLoading: true };

      expect(received).toEqual(expected);
    });
  });

  it('should handle FETCH_APP_SUCCESS', () => {
    const state = {
      ...initialState,
      isLoading: true,
    };

    const received = reducer(state, {
      type: FETCH_APP_SUCCESS,
      payload: {
        name: "FLK It Over'",
        logoUrl: 'https://flkitover.com/logo.png',
        redirectUri: 'http://flkitover.com/',
        clientId: 'xxyyzz',
      },
    });

    const expected = {
      ...state,
      isLoading: false,
      oauthAppInfo: {
        name: "FLK It Over'",
        logoUrl: 'https://flkitover.com/logo.png',
        redirectUri: 'http://flkitover.com/',
        clientId: 'xxyyzz',
        hasTried: true,
        isSuccess: true,
      },
    };

    expect(received).toEqual(expected);
  });

  it('should handle AUTHORIZE_APP_SUCCESS', () => {
    const state = {
      ...initialState,
      isLoading: true,
    };

    const received = reducer(state, {
      type: AUTHORIZE_APP_SUCCESS,
      payload: {
        redirect_uri: 'http://flkitover.com/',
        response_type: 'code',
      },
    });

    const expected = {
      ...state,
      isLoading: false,
      oauthAuthorization: {
        redirect_uri: 'http://flkitover.com/',
        response_type: 'code',
      },
    };

    expect(received).toEqual(expected);
  });

  it('should handle FETCH_APP_ERROR', () => {
    const state = {
      ...initialState,
      isLoading: true,
    };

    const received = reducer(state, {
      type: FETCH_APP_ERROR,
      payload: {
        error: 'invalid_client',
        error_description:
          'Client authentication failed due to unknown client, no client authentication included, or unsupported authentication method.',
      },
    });

    const expected = {
      ...state,
      isLoading: false,
      oauthAppInfo: {
        hasTried: true,
        isSuccess: false,
      },
    };

    expect(received).toEqual(expected);
  });
});
