import { getAppAuthorization, getOauthAppInfo } from '../selectors';

describe('oauth/selectors', () => {
  let state;

  beforeEach(() => {
    state = {
      isLoading: false,
      oauthAppInfo: {
        name: "FLK It Over'",
        logoUrl: 'https://flkitover.com/logo.png',
        redirectUri: 'http://flkitover.com/',
        clientId: 'xxyyzz',
        isSuccess: true,
        hasTried: true,
      },
      oauthAuthorization: {
        redirect_uri: 'http://flkitover.com/',
        response_type: 'code',
      },
    };
  });

  describe('getOauthAppInfo', () => {
    it('should return oauthAppInfo', () => {
      const received = getOauthAppInfo(state);
      const expected = {
        name: "FLK It Over'",
        logoUrl: 'https://flkitover.com/logo.png',
        redirectUri: 'http://flkitover.com/',
        clientId: 'xxyyzz',
        isSuccess: true,
        hasTried: true,
      };

      expect(received).toEqual(expected);
    });
  });

  describe('getAppAuthorization', () => {
    it('should return oauthAppInfo', () => {
      const received = getAppAuthorization(state);
      const expected = {
        redirect_uri: 'http://flkitover.com/',
        response_type: 'code',
      };

      expect(received).toEqual(expected);
    });
  });
});
