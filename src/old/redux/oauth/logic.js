import { camelizeKeys, decamelizeKeys } from 'humps';

import { httpOauthClient } from '../../utils';
import { showAlert } from '../notifier';
import {
  AUTHORIZE_APP,
  AUTHORIZE_APP_SUCCESS,
  ERROR,
  FETCH_APP,
  FETCH_APP_ERROR,
  FETCH_APP_SUCCESS,
} from './constants';

export const logic = [
  {
    type: FETCH_APP,
    processOptions: {
      successType: FETCH_APP_SUCCESS,
      failType: FETCH_APP_ERROR,
    },
    process({ action }) {
      return httpOauthClient
        .get(`/applications/info/${action.payload.clientId}`)
        .then((response) =>
          camelizeKeys(response.data['doorkeeper/application'])
        );
    },
  },
  {
    type: FETCH_APP_ERROR,
    process({ action }, dispatch, done) {
      const message = action.payload.response.data;
      message && dispatch(showAlert({ color: 'danger', message }));
      done();
    },
  },
  {
    type: AUTHORIZE_APP,
    processOptions: {
      successType: AUTHORIZE_APP_SUCCESS,
      failType: ERROR,
    },
    process({ action }) {
      const oauthParams = decamelizeKeys(action.payload.oauthParams);

      return httpOauthClient
        .post(`/authorize`, oauthParams)
        .then((response) => camelizeKeys(response.data));
    },
  },
];
