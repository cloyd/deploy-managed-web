import { showAlert } from '../notifier';
import { ERROR, FETCH, SUCCESS, UPDATE } from './constants';

export const logic = [
  {
    type: FETCH,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { params } = action.payload;

      return httpClient
        .get(`/promisepay-companies`, { params })
        .then((response) => response.data.promisepayCompany);
    },
  },

  {
    type: UPDATE,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { params } = action.payload;

      return httpClient
        .put(`/promisepay-companies`, params)
        .then((response) => ({
          ...response.data.promisepayCompany,
          message: '<strong>Success:</strong> Your details have been updated.',
        }));
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
