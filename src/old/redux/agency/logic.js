import { showAlert } from '../notifier';
import {
  ERROR,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  SUCCESS,
  UPDATE,
} from './constants';

export const logic = [
  {
    type: FETCH,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      return httpClient
        .get(`/agencies/${action.payload.id}`)
        .then((response) => response.data.agency);
    },
  },

  {
    type: FETCH_ALL,
    processOptions: {
      successType: FETCH_ALL_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      return httpClient
        .get(`/agencies`)
        .then((response) => response.data.agencies);
    },
  },

  {
    type: UPDATE,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      return httpClient
        .put(`/agencies/${action.payload.id}`, action.payload)
        .then(() => {
          const { addressAttributes, ...agency } = action.payload;
          return {
            ...agency,
            address: addressAttributes,
            message:
              '<strong>Success:</strong> Your details have been updated.',
          };
        });
    },
  },

  {
    type: SUCCESS,
    process({ action, httpClient }, dispatch, done) {
      const { message } = action.payload;
      message && dispatch(showAlert({ color: 'success', message }));
      done();
    },
  },
];
