import { ERROR, FETCH, SUCCESS } from './constants';

export const logic = [
  {
    type: FETCH,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      return httpClient
        .get('/app/settings', {
          params: action.payload,
        })
        .then((response) => response.data);
    },
  },
];
