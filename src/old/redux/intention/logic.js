import keyBy from 'lodash/fp/keyBy';

import { hideLoading, showAlert, showLoading } from '../notifier';
import { updateTask } from '../task';
import { fetchIntentionsPayable } from './actions';
import {
  ADJUST_INTENTION,
  ADJUST_INTENTION_SUCCESS,
  DESTROY_INTENTION,
  DESTROY_INTENTION_SUCCESS,
  ERROR,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  FETCH_SUCCESS,
  PAY_INTENTION,
  PAY_INTENTION_SUCCESS,
} from './constants';
import { decorateIntention } from './decorators';

const normalizeIntentions = (intentions, property) => {
  return keyBy(
    'id',
    intentions.map((intention) => decorateIntention(intention, property))
  );
};

export const logic = [
  {
    type: ADJUST_INTENTION,
    processOptions: {
      successType: ADJUST_INTENTION_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { intentionId, params, propertyId } = action.payload;

      return httpClient
        .post(`/intentions/${intentionId}/adjust`, params)
        .then(() => ({
          ...action.payload,
          propertyId,
          message: 'Credit successfully applied.',
        }));
    },
  },

  {
    type: DESTROY_INTENTION,
    processOptions: {
      successType: DESTROY_INTENTION_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { intentionId, params, propertyId } = action.payload;

      return httpClient
        .delete(`/intentions/${intentionId}/remove`, params)
        .then(() => ({
          ...action.payload,
          propertyId,
          message: 'Successfully deleted the transaction.',
        }));
    },
  },

  /**
   * TODO: Delete when Proper fix is done
   * Proper fix should be done on the BE to automatically update a task when
   * a transaction is deleted
   */
  {
    type: DESTROY_INTENTION_SUCCESS,
    process({ action }, dispatch, done) {
      const { propertyId, params } = action.payload;

      if (propertyId && params?.taskId) {
        dispatch(
          updateTask({ propertyId, taskId: params?.taskId, status: 'draft' })
        );
        done();
      }

      done();
    },
  },

  {
    type: FETCH,
    processOptions: {
      successType: FETCH_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { intentionId } = action.payload;

      return httpClient.get(`/intentions/${intentionId}`).then((response) => {
        const { intention } = response.data;

        return {
          data: {
            [intention.id]: decorateIntention(intention),
          },
        };
      });
    },
  },

  {
    type: FETCH_ALL,
    processOptions: {
      successType: FETCH_ALL_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { fetchType = '', isFullDetail, params, property } = action.payload;
      const path = isFullDetail ? '/intentions/details' : 'intentions';

      return httpClient.get(path, { params }).then((response) => {
        const { intentions } = response.data;

        return intentions.length > 0
          ? fetchType
            ? // If fetchType exists, then results will be keyed against fetchType
              {
                data: normalizeIntentions(intentions, property),
                results: intentions.reduce((acc, { id, property }) => {
                  acc[property.id] = [...(acc[property.id] || []), id];
                  return acc;
                }, {}),
                type: fetchType,
              }
            : // Otherwise, results can be returned as an array of keys
              {
                data: normalizeIntentions(intentions, property),
                results: intentions.reduce((acc, { id }) => [...acc, id], []),
              }
          : { data: [], results: [], type: fetchType || '' };
      });
    },
  },

  {
    type: PAY_INTENTION,
    processOptions: {
      successType: PAY_INTENTION_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { intentionId, payingWalletId } = action.payload;

      return httpClient
        .post(`/intentions/${intentionId}/pay`, { payingWalletId })
        .then(() => {
          return {
            color: 'warning',
            message:
              'A payment is currently processing. You will be able to process further payments as soon as it completes.',
          };
        });
    },
  },

  {
    type: [
      ADJUST_INTENTION_SUCCESS,
      DESTROY_INTENTION_SUCCESS,
      PAY_INTENTION_SUCCESS,
    ],
    process({ action }, dispatch, done) {
      const { message, color } = action.payload;

      if (message) {
        dispatch(
          showAlert({
            color: color || 'success',
            isRedirect: action.type === PAY_INTENTION_SUCCESS,
            message,
          })
        );
      }
      done();
    },
  },

  {
    type: [ADJUST_INTENTION_SUCCESS, DESTROY_INTENTION_SUCCESS],
    process({ action }, dispatch, done) {
      const { propertyId, params } = action.payload;

      if (params?.currentPage) {
        dispatch(
          fetchIntentionsPayable({
            propertyId,
            page: 1,
            perPage: params?.currentPage * 10,
          })
        );
      } else {
        dispatch(fetchIntentionsPayable({ propertyId }));
      }

      done();
    },
  },

  {
    type: [
      ERROR,
      FETCH,
      FETCH_SUCCESS,
      FETCH_ALL,
      FETCH_ALL_SUCCESS,
      PAY_INTENTION,
      PAY_INTENTION_SUCCESS,
    ],
    process({ action }, dispatch, done) {
      switch (action.type) {
        case FETCH:
        case PAY_INTENTION:
          dispatch(showLoading());
          break;

        case ERROR:
        case FETCH_SUCCESS:
        case FETCH_ALL_SUCCESS:
        case PAY_INTENTION_SUCCESS:
          dispatch(hideLoading());
          break;
      }
      done();
    },
  },
];
