import { AUTHORIZE_APP, FETCH_APP } from './constants';

export const fetchOauthApp = ({ clientId }) => {
  return {
    type: FETCH_APP,
    payload: { clientId },
  };
};

export const authorizeOauthApp = ({ oauthParams }) => {
  return {
    type: AUTHORIZE_APP,
    payload: { oauthParams },
  };
};
