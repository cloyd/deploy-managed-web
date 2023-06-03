import { camelizeKeys } from 'humps';

import reducer, { initialState, logic } from '..';
import { mockHttpOauthClient, mockReduxLogic } from '../../__mocks__';
import {
  AUTHORIZE_APP,
  AUTHORIZE_APP_SUCCESS,
  FETCH_APP,
  FETCH_APP_SUCCESS,
} from '../constants';

describe('oauth/logic', () => {
  let params;
  let request;
  let store;

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

  describe('FETCH_APP', () => {
    const clientId = 'xxyyzz';
    beforeEach(() => {
      params = { clientId };
      request = mockHttpOauthClient.onGet(`/applications/info/${clientId}`);
    });

    it('should dispatch FETCH_APP_SUCCESS on success', (done) => {
      const response = {
        'doorkeeper/application': {
          name: "FLK It Over'",
          logo_url: 'https://flkitover.com/logo.png',
          redirect_uri: 'http://flkitover.com/',
          client_id: 'xxyyzz',
        },
      };

      store.dispatch({ type: FETCH_APP, payload: params });
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: FETCH_APP_SUCCESS,
          payload: camelizeKeys(response['doorkeeper/application']),
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('AUTHORIZE_APP', () => {
    const clientId = 'xxyyzz';
    const redirectUri = 'http://flkitover.com/';
    const responseType = 'code';

    beforeEach(() => {
      params = { clientId, redirectUri, responseType };
      request = mockHttpOauthClient.onPost(`/authorize`);
    });

    it('should dispatch AUTHORIZE_APP_SUCCESS on success', (done) => {
      const response = {
        redirect_uri:
          'http://flkitover.com/?code=FbeSt83Fp_bhwUm8a-CDEVz_0lRgGVWp0U6lLBu3w9g',
        status: 'redirect',
      };

      store.dispatch({ type: AUTHORIZE_APP, payload: params });
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: AUTHORIZE_APP_SUCCESS,
          payload: camelizeKeys(response),
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });
});
