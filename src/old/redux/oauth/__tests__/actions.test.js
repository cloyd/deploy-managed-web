import { authorizeOauthApp, fetchOauthApp } from '../actions';
import { AUTHORIZE_APP, FETCH_APP } from '../constants';

describe('oauth/actions', () => {
  it('should return action for fetchOauthApp', () => {
    const received = fetchOauthApp({ clientId: 'xyz' });
    const expected = { type: FETCH_APP, payload: { clientId: 'xyz' } };

    expect(received).toEqual(expected);
  });

  it('should return action for authorizeOauthApp', () => {
    const oauthParams = {
      clientId: 'xyz',
      redirectUri: 'https://flikitover.com',
      responseType: 'code',
    };
    const received = authorizeOauthApp({ oauthParams });
    const expected = {
      type: AUTHORIZE_APP,
      payload: { oauthParams },
    };

    expect(received).toEqual(expected);
  });
});
