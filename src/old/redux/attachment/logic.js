import keyBy from 'lodash/fp/keyBy';

import {
  ERROR,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  UPDATE_ALL,
  UPDATE_ALL_SUCCESS,
} from './constants';

const normalizeAttachments = ({ attachments }) => {
  return {
    data: keyBy('id', attachments),
    result: attachments.map((attachment) => attachment.id),
  };
};

export const logic = [
  {
    type: FETCH_ALL,
    processOptions: {
      successType: FETCH_ALL_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { params } = action.payload;

      return httpClient
        .get(`/attachments`, { params })
        .then(({ data }) => normalizeAttachments(data));
    },
  },

  {
    type: UPDATE_ALL,
    latest: true,
    processOptions: {
      successType: UPDATE_ALL_SUCCESS,
      failType: ERROR,
    },
    process({ action }) {
      return normalizeAttachments(action.payload);
    },
  },
];
