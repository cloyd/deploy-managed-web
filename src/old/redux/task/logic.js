import flow from 'lodash/fp/flow';
import keyBy from 'lodash/fp/keyBy';

import { processGetWithProps } from '../helpers/logic';
import { fetchLeases } from '../lease';
import { showAlert } from '../notifier';
import {
  ARCHIVE,
  ARCHIVE_SUCCESS,
  CREATE,
  CREATE_MESSAGE,
  CREATE_QUOTE,
  CREATE_SUCCESS,
  DESTROY,
  DESTROY_SUCCESS,
  ERROR,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_PROPERTY,
  FETCH_ALL_SUCCESS,
  FETCH_BPAY_BILLERS,
  FETCH_MESSAGES,
  FETCH_MESSAGES_SUCCESS,
  FETCH_META,
  FETCH_META_SUCCESS,
  FETCH_SIMILAR,
  FETCH_SIMILAR_SUCCESS,
  FETCH_TASK_ACTIVITIES,
  FETCH_TASK_ACTIVITIES_SUCCESS,
  SEND_ENTRY_FORM,
  SEND_INVOICE,
  SUCCESS,
  UPDATE,
  UPDATE_SUCCESS,
} from './constants';
import { decorateTask } from './decorators';

const normalizeTask = (response) => {
  const task = Array.isArray(response)
    ? response[0].data.task
    : response.data.task;

  return {
    data: { [task.id]: decorateTask(task) },
    result: task.id,
  };
};

const normalizeTasks = (response) => {
  const { tasks } = response.data;

  return {
    data: keyBy('id', tasks.map(decorateTask)),
    result: tasks.map((task) => task.id),
  };
};

const normalizeBills = (response) =>
  response.map(({ data: { task } }) => ({
    data: { [task.id]: decorateTask(task) },
    result: task.id,
  }));

export const logic = [
  {
    type: CREATE,
    processOptions: {
      successType: CREATE_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { params, propertyId } = action.payload;
      const {
        isScheduledForAutoPayment,
        invoiceAttributes,
        billieAttachmentIds,
      } = params;
      const attachments = [...(billieAttachmentIds || [])];

      if (invoiceAttributes) {
        return Promise.resolve()
          .then(() => {
            // Duplicate the billie attachment for the second invoice
            if (invoiceAttributes.length > 1 && billieAttachmentIds?.length) {
              return httpClient
                .post(`/attachments/${billieAttachmentIds[0]}/duplicate`)
                .then(({ data }) => {
                  attachments.push(data.attachments);
                  return attachments;
                });
            } else {
              return attachments;
            }
          })
          .then((attachments) =>
            Promise.all(
              invoiceAttributes.map((invoice, index) =>
                httpClient.post(`/properties/${propertyId}/tasks`, {
                  ...params,
                  // Add debtor to the task title on split bill
                  ...(invoiceAttributes.length > 1 && {
                    title: `${params.title} - ${invoice.debtorType}`,
                  }),
                  invoiceAttributes: invoice,
                  ...(attachments[index] && {
                    billieAttachmentIds: [attachments[index]],
                  }),
                  followedByOwner: !!invoice.followers?.find(
                    ({ value }) => value === 'owners'
                  ),
                  followedByTenant: !!invoice.followers?.find(
                    ({ value }) => value === 'tenants'
                  ),
                })
              )
            )
          )
          .then(normalizeBills)
          .then((bills) => {
            const secondBill = bills[1];
            return {
              ...bills[0],
              data: {
                ...bills[0].data,
                [bills[0].result]: {
                  ...bills[0].data[bills[0].result],
                  ...(params?.attachments && {
                    attachmentIds:
                      params?.attachments.map(({ id }) => id) || [],
                  }),
                },
              },
              message: '<strong>Success:</strong> Task has been created.',
              isScheduledForAutoPayment:
                invoiceAttributes[0].isScheduledForAutoPayment,
              ...(secondBill && {
                secondBill: {
                  id: secondBill.data[secondBill.result].id,
                  propertyId: secondBill.data[secondBill.result].propertyId,
                  isScheduledForAutoPayment:
                    invoiceAttributes[1].isScheduledForAutoPayment,
                },
              }),
            };
          });
      } else {
        return httpClient
          .post(`/properties/${propertyId}/tasks`, params)
          .then(normalizeTask)
          .then((task) => {
            return {
              ...task,
              data: {
                ...task.data,
                [task.result]: {
                  ...task.data[task.result],
                  ...(params?.attachments && {
                    attachmentIds:
                      params?.attachments.map(({ id }) => id) || [],
                  }),
                },
              },
              message: '<strong>Success:</strong> Task has been created.',
              isScheduledForAutoPayment: isScheduledForAutoPayment,
            };
          });
      }
    },
  },

  {
    type: DESTROY,
    processOptions: {
      successType: DESTROY_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { taskId, propertyId } = action.payload;

      return httpClient
        .delete(`/properties/${propertyId}/tasks/${taskId}`)
        .then(() => ({
          taskId,
          message: '<strong>Success:</strong> Task has been removed.',
        }));
    },
  },

  {
    type: ARCHIVE,
    processOptions: {
      successType: ARCHIVE_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { taskId, propertyId } = action.payload;

      return httpClient
        .post(`/properties/${propertyId}/tasks/${taskId}/archive`)
        .then(() => ({
          taskId,
          message: '<strong>Success:</strong> Task has been archived.',
        }));
    },
  },

  {
    type: FETCH,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { propertyId, taskId, message } = action.payload;

      return httpClient
        .get(`/properties/${propertyId}/tasks/${taskId}`)
        .then(normalizeTask)
        .then((task) => ({ ...task, message }));
    },
  },

  {
    type: FETCH_ALL,
    debounce: 500,
    latest: true,
    processOptions: {
      successType: FETCH_ALL_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { params } = action.payload;

      return httpClient.get(`/tasks`, { params }).then(normalizeTasks);
    },
  },

  {
    type: FETCH_ALL_PROPERTY,
    debounce: 500,
    latest: true,
    processOptions: {
      successType: FETCH_ALL_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { propertyId, params } = action.payload;

      return httpClient
        .get(`/properties/${propertyId}/tasks`, { params })
        .then(normalizeTasks);
    },
  },

  {
    type: FETCH_BPAY_BILLERS,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    transform: ({ action }, next) => {
      const { params, onComplete } = action.payload;

      next({
        type: action.type,
        payload: {
          endpoint: `/bpay-billers`,
          params,
          props: {
            onComplete,
          },
        },
      });
    },
    process: flow(processGetWithProps, async (response) => {
      const payload = await response;
      const { onComplete } = payload.props;
      const { data } = payload.response;

      onComplete(data);

      return { data };
    }),
  },

  {
    type: FETCH_MESSAGES,
    debounce: 500,
    latest: true,
    processOptions: {
      successType: FETCH_MESSAGES_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { propertyId, taskId } = action.payload;

      return httpClient
        .get(`/properties/${propertyId}/tasks/${taskId}/messages`)
        .then((response) => ({ [taskId]: response.data.messages }));
    },
  },

  {
    type: FETCH_META,
    processOptions: {
      successType: FETCH_META_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { propertyId } = action.payload;
      return httpClient
        .get(`/tasks/meta?property_id=${propertyId}`)
        .then((response) => response.data);
    },
  },

  {
    type: FETCH_SIMILAR,
    debounce: 500,
    latest: true,
    processOptions: {
      successType: FETCH_SIMILAR_SUCCESS,
      failType: ERROR,
    },
    transform({ action }, next) {
      const { propertyId, invoiceCategory, type } = action.payload;

      next({
        ...action,
        payload: {
          invoiceCategory,
          propertyId,
          endpoint: `/properties/${propertyId}/tasks/billie`,
          params: {
            'q[taskCategoryKeyOrInvoiceCategoryEq]': invoiceCategory,
            'q[taskTypeKeyEq]': type,
          },
        },
      });
    },
    process({ action, httpClient }) {
      const { endpoint, invoiceCategory, params, propertyId } = action.payload;

      return httpClient.get(endpoint, { params }).then((response) => ({
        propertyId,
        data: { [invoiceCategory]: response.data },
      }));
    },
  },

  {
    type: FETCH_TASK_ACTIVITIES,
    debounce: 500,
    latest: true,
    processOptions: {
      successType: FETCH_TASK_ACTIVITIES_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { propertyId, taskId } = action.payload;

      return httpClient
        .get(`/properties/${propertyId}/tasks/${taskId}/activities`)
        .then((response) => ({ [taskId]: response.data }));
    },
  },

  {
    type: CREATE_QUOTE,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { propertyId, taskId, ...params } = action.payload;

      return httpClient
        .post(`/properties/${propertyId}/tasks/${taskId}/quotes`, params)
        .then(() => ({
          isScroll: true,
          message: '<strong>Success:</strong> submission created.',
        }));
    },
  },

  {
    type: CREATE_MESSAGE,
    processOptions: {
      successType: FETCH_TASK_ACTIVITIES,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { propertyId, taskId, params } = action.payload;

      return httpClient
        .post(`/properties/${propertyId}/tasks/${taskId}/messages`, params)
        .then(() => ({ propertyId, taskId }));
    },
  },

  {
    type: UPDATE,
    processOptions: {
      successType: UPDATE_SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const {
        propertyId,
        taskId,
        params,
        message = 'Task has been updated',
      } = action.payload;
      const { isScheduledForAutoPayment } = action.payload.params;

      return httpClient
        .put(`/properties/${propertyId}/tasks/${taskId}`, params)
        .then(normalizeTask)
        .then((task) => ({
          ...task,
          isScheduledForAutoPayment: isScheduledForAutoPayment,
          message: `<strong>Success:</strong> ${message}.`,
        }));
    },
  },

  {
    type: UPDATE_SUCCESS,
    process({ action }, dispatch, done) {
      const { data, result, isScheduledForAutoPayment } = action.payload;
      const task = data && data[result] ? data[result] : {};
      const { propertyId, status } = task;

      if (status && status === 'completed') {
        dispatch(fetchLeases({ propertyId }));
      }

      if (task.id && isScheduledForAutoPayment) {
        dispatch({
          type: SEND_INVOICE,
          payload: { propertyId: task.propertyId, taskId: task.id },
        });
      }

      dispatch({ type: SUCCESS, payload: action.payload });
      done();
    },
  },

  {
    type: SEND_ENTRY_FORM,
    processOptions: {
      successType: SUCCESS,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { params, propertyId, taskId } = action.payload;

      return httpClient
        .post(
          `/properties/${propertyId}/tasks/${taskId}/send-entry-form`,
          params
        )
        .then(normalizeTask)
        .then((task) => ({
          ...task,
          isScroll: true,
          message: '<strong>Success:</strong> Form 9 has been sent.',
        }));
    },
  },

  {
    type: SEND_INVOICE,
    processOptions: {
      successType: FETCH,
      failType: ERROR,
    },
    process({ action, httpClient }) {
      const { propertyId, taskId } = action.payload;

      return httpClient
        .post(`/properties/${propertyId}/tasks/${taskId}/action-invoice`)
        .then(() => ({
          ...action.payload,
          message: '<strong>Success:</strong> Invoice has been sent.',
        }));
    },
  },

  {
    type: [CREATE_SUCCESS, DESTROY_SUCCESS, SUCCESS, ARCHIVE_SUCCESS],
    process({ action }, dispatch, done) {
      const {
        data,
        isScheduledForAutoPayment,
        isScroll,
        message,
        result,
        secondBill,
      } = action.payload;
      const task = data && data[result] ? data[result] : {};

      if (task.id && isScheduledForAutoPayment) {
        dispatch({
          type: SEND_INVOICE,
          payload: { propertyId: task.propertyId, taskId: task.id },
        });
      }

      if (secondBill && secondBill.isScheduledForAutoPayment) {
        dispatch({
          type: SEND_INVOICE,
          payload: { propertyId: secondBill.propertyId, taskId: secondBill.id },
        });
      }

      if (message) {
        dispatch(
          showAlert({
            color: 'success',
            isScroll: isScroll || false,
            message,
          })
        );
      }

      done();
    },
  },
];
