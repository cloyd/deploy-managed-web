/* eslint-disable no-undef */
import reducer, { decorateTask, initialState, logic } from '..';
import { mockHttpClient, mockReduxLogic } from '../../__mocks__';
import { fetchLeases } from '../../lease';
import { showAlert } from '../../notifier';
import { fetchBpayBillers } from '../actions';
import {
  ARCHIVE,
  ARCHIVE_SUCCESS,
  CREATE,
  CREATE_QUOTE,
  CREATE_SUCCESS,
  DESTROY,
  DESTROY_SUCCESS,
  ERROR,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_PROPERTY,
  FETCH_ALL_SUCCESS,
  FETCH_MESSAGES,
  FETCH_MESSAGES_SUCCESS,
  FETCH_SIMILAR,
  FETCH_SIMILAR_SUCCESS,
  SUCCESS,
  UPDATE,
  UPDATE_SUCCESS,
} from '../constants';

describe('task/logic', () => {
  let params;
  let request;
  let store;

  const reduxLogicError = {
    error: true,
    payload: new Error('Request failed with status code 500'),
    type: ERROR,
  };

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

  describe('CREATE', () => {
    const propertyId = 1;
    const taskId = 1;
    const invoice = {
      amountCents: 100,
      category: 'advertising_for_tenants',
      creditorId: '4',
      creditorType: 'Agency',
      debtorId: '3',
      debtorType: 'Owner',
      gstIncluded: true,
      isAgencyCoveringFees: false,
      referenceNumber: '',
      isScheduledForAutoPayment: false,
      followers: [{ label: 'Owners', value: 'owners' }],
    };
    const secondInvoice = {
      amountCents: 100,
      category: 'advertising_for_tenants',
      creditorId: '3',
      creditorType: 'Owner',
      debtorId: '4',
      debtorType: 'Agency',
      gstIncluded: true,
      isAgencyCoveringFees: false,
      referenceNumber: '123',
      isScheduledForAutoPayment: false,
      followers: [{ label: 'Owners', value: 'owners' }],
    };

    beforeEach(() => {
      params = {
        title: 'title',
        invoiceAttributes: [invoice],
        followedByOwner: true,
        followedByTenant: false,
      };
      request = mockHttpClient.onPost(`/properties/${propertyId}/tasks`, {
        ...params,
        invoiceAttributes: invoice,
      });
    });

    it('should dispatch CREATE_SUCCESS on success', (done) => {
      const response = {
        task: {
          ...params,
          id: taskId,
          taskType: { id: '1', key: 'key' },
          taskStatus: {},
        },
      };

      store.dispatch({ type: CREATE, payload: { propertyId, params } });
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: CREATE_SUCCESS,
          payload: {
            result: taskId,
            data: { [taskId]: decorateTask(response.task) },
            message: '<strong>Success:</strong> Task has been created.',
            isScheduledForAutoPayment: false,
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: CREATE, payload: { propertyId, params } });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch CREATE_SUCCESS on success of split bill', (done) => {
      request = mockHttpClient.onPost(`/properties/${propertyId}/tasks`, {
        ...params,
        title: `${params.title} - ${invoice.debtorType}`,
        invoiceAttributes: invoice,
      });

      const secondRequest = mockHttpClient.onPost(
        `/properties/${propertyId}/tasks`,
        {
          ...params,
          title: `${params.title} - ${secondInvoice.debtorType}`,
          invoiceAttributes: secondInvoice,
        }
      );

      const response = {
        task: {
          ...params,
          id: taskId,
          taskType: { id: '1', key: 'key' },
          taskStatus: {},
        },
      };

      const secondResponse = {
        task: {
          id: 2,
          propertyId,
        },
      };

      store.dispatch({
        type: CREATE,
        payload: {
          propertyId,
          params: {
            ...params,
            invoiceAttributes: [invoice, secondInvoice],
          },
        },
      });

      request.reply(200, response);
      secondRequest.reply(200, secondResponse);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: CREATE_SUCCESS,
          payload: {
            result: taskId,
            data: { [taskId]: decorateTask(response.task) },
            message: '<strong>Success:</strong> Task has been created.',
            isScheduledForAutoPayment: false,
            secondBill: {
              ...secondResponse.task,
              isScheduledForAutoPayment: false,
            },
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch CREATE_SUCCESS on success of billie split bill', (done) => {
      const attachmentId = 20;
      params.billieAttachmentIds = [attachmentId];

      const duplicateRequest = mockHttpClient.onPost(
        `/attachments/${attachmentId}/duplicate`
      );

      const duplicateResponse = {
        attachments: 21,
      };

      request = mockHttpClient.onPost(`/properties/${propertyId}/tasks`, {
        ...params,
        title: `${params.title} - ${invoice.debtorType}`,
        invoiceAttributes: params.invoiceAttributes[0],
        billieAttachmentIds: [attachmentId],
      });

      const secondRequest = mockHttpClient.onPost(
        `/properties/${propertyId}/tasks`,
        {
          ...params,
          title: `${params.title} - ${secondInvoice.debtorType}`,
          invoiceAttributes: secondInvoice,
          billieAttachmentIds: [duplicateResponse.attachments],
        }
      );

      const response = {
        task: {
          ...params,
          id: taskId,
          taskType: { id: '1', key: 'key' },
          taskStatus: {},
        },
      };

      const secondResponse = {
        task: {
          id: 2,
          propertyId,
        },
      };

      store.dispatch({
        type: CREATE,
        payload: {
          propertyId,
          params: {
            ...params,
            invoiceAttributes: [invoice, secondInvoice],
          },
        },
      });
      duplicateRequest.reply(200, duplicateResponse);
      request.reply(200, response);
      secondRequest.reply(200, secondResponse);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: CREATE_SUCCESS,
          payload: {
            result: taskId,
            data: { [taskId]: decorateTask(response.task) },
            message: '<strong>Success:</strong> Task has been created.',
            isScheduledForAutoPayment: false,
            secondBill: {
              ...secondResponse.task,
              isScheduledForAutoPayment: false,
            },
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail of split bill', (done) => {
      request = mockHttpClient.onPost(`/properties/${propertyId}/tasks`, {
        ...params,
        title: `${params.title} - ${invoice.debtorType}`,
        invoiceAttributes: invoice,
      });

      const secondRequest = mockHttpClient.onPost(
        `/properties/${propertyId}/tasks`,
        {
          ...params,
          title: `${params.title} - ${secondInvoice.debtorType}`,
          invoiceAttributes: secondInvoice,
        }
      );

      const response = {
        task: {
          ...params,
          id: taskId,
          taskType: { id: '1', key: 'key' },
          taskStatus: {},
        },
      };

      store.dispatch({
        type: CREATE,
        payload: {
          propertyId,
          params: {
            ...params,
            invoiceAttributes: [invoice, secondInvoice],
          },
        },
      });
      request.reply(200, response);
      secondRequest.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('CREATE_QUOTE', () => {
    const propertyId = 1;
    const taskId = 1;
    const note = 'Hello world';

    beforeEach(() => {
      params = { note };
      request = mockHttpClient.onPost(
        `/properties/${propertyId}/tasks/${taskId}/quotes`,
        params
      );
    });

    it('should dispatch SUCCESS on success', (done) => {
      store.dispatch({
        type: CREATE_QUOTE,
        payload: { propertyId, taskId, note },
      });
      request.reply(200, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: SUCCESS,
          payload: {
            isScroll: true,
            message: '<strong>Success:</strong> submission created.',
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({
        type: CREATE_QUOTE,
        payload: { propertyId, taskId, note },
      });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('DESTROY', () => {
    const propertyId = 1;
    const taskId = 1;

    beforeEach(() => {
      request = mockHttpClient.onDelete(
        `/properties/${propertyId}/tasks/${taskId}`
      );
    });

    it('should dispatch SUCCESS on success', (done) => {
      store.dispatch({ type: DESTROY, payload: { propertyId, taskId } });
      request.reply(204);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: DESTROY_SUCCESS,
          payload: {
            taskId,
            message: '<strong>Success:</strong> Task has been removed.',
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: DESTROY, payload: { propertyId, taskId } });
      request.reply(500);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('ARCHIVE', () => {
    const propertyId = 1;
    const taskId = 1;

    beforeEach(() => {
      request = mockHttpClient.onPost(
        `/properties/${propertyId}/tasks/${taskId}/archive`
      );
    });

    it('should dispatch SUCCESS on success', (done) => {
      store.dispatch({ type: ARCHIVE, payload: { propertyId, taskId } });
      request.reply(204);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: ARCHIVE_SUCCESS,
          payload: {
            taskId,
            message: '<strong>Success:</strong> Task has been archived.',
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: ARCHIVE, payload: { propertyId, taskId } });
      request.reply(500);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('FETCH', () => {
    const propertyId = 1;
    const taskId = 1;
    beforeEach(() => {
      params = { propertyId, taskId };
      request = mockHttpClient.onGet(
        `/properties/${propertyId}/tasks/${taskId}`
      );
    });

    it('should dispatch SUCCESS on success', (done) => {
      const response = {
        task: {
          id: taskId,
          title: 'title',
          taskType: { id: '1', key: 'key' },
          taskStatus: {},
        },
      };

      store.dispatch({ type: FETCH, payload: params });
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: SUCCESS,
          payload: {
            result: taskId,
            data: { [taskId]: decorateTask(response.task) },
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: FETCH, payload: params });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('FETCH_ALL', () => {
    beforeEach(() => {
      request = mockHttpClient.onGet(`/tasks`);
    });

    it('should dispatch SUCCESS on success', (done) => {
      const response = {
        tasks: [
          {
            id: 1,
            title: 'title-1',
            taskType: { id: '1', key: 'key-1' },
            taskStatus: {},
          },
          {
            id: 2,
            title: 'title-2',
            taskType: { id: '2', key: 'key-2' },
            taskStatus: {},
          },
        ].map(decorateTask),
      };

      store.dispatch({ type: FETCH_ALL, payload: {} });
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: FETCH_ALL_SUCCESS,
          payload: {
            result: [1, 2],
            data: { 1: response.tasks[0], 2: response.tasks[1] },
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: FETCH_ALL, payload: {} });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('FETCH_ALL_PROPERTY', () => {
    const propertyId = 1;

    beforeEach(() => {
      request = mockHttpClient.onGet(`/properties/${propertyId}/tasks`);
    });

    it('should dispatch SUCCESS on success', (done) => {
      const response = {
        tasks: [
          {
            id: 1,
            title: 'title-1',
            taskType: { id: '1', key: 'key-1' },
            taskStatus: {},
          },
          {
            id: 2,
            title: 'title-2',
            taskType: { id: '2', key: 'key-2' },
            taskStatus: {},
          },
        ].map(decorateTask),
      };

      store.dispatch({ type: FETCH_ALL_PROPERTY, payload: { propertyId } });
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: FETCH_ALL_SUCCESS,
          payload: {
            result: [1, 2],
            data: { 1: response.tasks[0], 2: response.tasks[1] },
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: FETCH_ALL_PROPERTY, payload: { propertyId } });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('FETCH_BPAY_BILLERS', () => {
    let onComplete;
    const data = [
      {
        biller_code: '93880',
        id: 11,
        name: 'IINET LIMITED',
      },
    ];

    beforeEach(() => {
      request = mockHttpClient.onGet(`/bpay-billers`);
      onComplete = jest.fn();
    });

    it('should dispatch SUCCESS on success', (done) => {
      store.dispatch(
        fetchBpayBillers({
          params: { 'q[biller_code_eq]': data[0].biller_code },
          onComplete,
        })
      );

      request.reply(200, data);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          payload: {
            data,
          },
          type: SUCCESS,
        };

        expect(onComplete).toHaveBeenCalledWith(data);
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch(
        fetchBpayBillers({
          params: { 'q[biller_code_eq]': data[0].biller_code },
          onComplete,
        })
      );

      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(onComplete).not.toHaveBeenCalled();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('FETCH_MESSAGES', () => {
    const propertyId = 1;
    const taskId = 1;

    beforeEach(() => {
      request = mockHttpClient.onGet(
        `/properties/${propertyId}/tasks/${taskId}/messages`
      );
    });

    it('should dispatch SUCCESS on success', (done) => {
      const response = {
        messages: ['foo', 'bar'],
      };

      store.dispatch({ type: FETCH_MESSAGES, payload: { propertyId, taskId } });
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: FETCH_MESSAGES_SUCCESS,
          payload: {
            1: ['foo', 'bar'],
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: FETCH_MESSAGES, payload: { propertyId, taskId } });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('FETCH_SIMILAR', () => {
    const propertyId = 1;
    const invoiceCategory = 'test-invoice-category';
    const type = 'test-type';

    beforeEach(() => {
      request = mockHttpClient.onGet(`/properties/${propertyId}/tasks/billie`);
    });

    it('should dispatch FETCH_SIMILAR_SUCCESS on success', (done) => {
      const response = {
        id: 777,
        type,
      };

      store.dispatch({
        type: FETCH_SIMILAR,
        payload: { propertyId, invoiceCategory, type },
      });
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: FETCH_SIMILAR_SUCCESS,
          payload: {
            propertyId,
            data: {
              [invoiceCategory]: {
                id: 777,
                type,
              },
            },
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({
        type: FETCH_SIMILAR,
        payload: { propertyId, invoiceCategory, type },
      });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('UPDATE', () => {
    const propertyId = 1;
    const taskId = 1;

    beforeEach(() => {
      params = {
        id: taskId,
        title: 'title',
        taskType: { id: '1', key: 'key' },
        taskStatus: {},
      };
      request = mockHttpClient.onPut(
        `/properties/${propertyId}/tasks/${taskId}`,
        params
      );
    });

    it('should dispatch UPDATE_SUCCESS on success', (done) => {
      const response = { task: { ...params } };

      store.dispatch({ type: UPDATE, payload: { propertyId, taskId, params } });
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: UPDATE_SUCCESS,
          payload: {
            result: 1,
            data: { 1: decorateTask(response.task) },
            message: '<strong>Success:</strong> Task has been updated.',
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: UPDATE, payload: { propertyId, taskId, params } });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should set a custom success message when defined', (done) => {
      const response = { task: { ...params } };
      const message = 'custom message';

      store.dispatch({
        type: UPDATE,
        payload: { propertyId, taskId, params, message },
      });

      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: UPDATE_SUCCESS,
          payload: {
            result: 1,
            data: { 1: decorateTask(response.task) },
            message: `<strong>Success:</strong> ${message}.`,
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('UPDATE_SUCCESS', () => {
    const propertyId = 123;
    const taskId = 456;
    const message = 'UPDATE_SUCCESS: test message';
    const showAlertAction = showAlert({
      color: 'success',
      isScroll: false,
      message,
    });

    it('should dispatch SUCCESS', (done) => {
      const task = {
        id: taskId,
        propertyId,
        title: 'title',
        status: 'draft',
        taskType: { id: '1', key: 'key' },
        taskStatus: {},
      };

      const dispatchAction = {
        type: UPDATE_SUCCESS,
        payload: {
          result: propertyId,
          message,
          data: { [propertyId]: decorateTask(task) },
        },
      };

      store.dispatch(dispatchAction);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = [
          dispatchAction,
          {
            type: SUCCESS,
            payload: {
              result: propertyId,
              data: { [propertyId]: decorateTask(task) },
              message,
            },
          },
          showAlertAction,
        ];

        expect(received).toEqual(expected);
        done();
      });
    });

    it('should dispatch lease/FETCH_ALL when task status equals completed', (done) => {
      const task = {
        id: taskId,
        propertyId,
        title: 'title',
        status: 'completed',
        taskType: { id: '1', key: 'key' },
        taskStatus: {},
      };
      const dispatchAction = {
        type: UPDATE_SUCCESS,
        payload: {
          result: propertyId,
          message,
          data: { [propertyId]: decorateTask(task) },
        },
      };

      store.dispatch(dispatchAction);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = [
          dispatchAction,
          fetchLeases({ propertyId }),
          {
            type: SUCCESS,
            payload: {
              result: propertyId,
              data: { [propertyId]: decorateTask(task) },
              message,
            },
          },
          showAlertAction,
        ];

        expect(received).toEqual(expected);
        done();
      });
    });
  });

  describe('showAlert', () => {
    [CREATE_SUCCESS, DESTROY_SUCCESS, SUCCESS, ARCHIVE_SUCCESS].map((type) => {
      it('should dispatch showAlert with isScroll as false when message is defined', () => {
        store.dispatch({ type, payload: { message: `${type} message` } });

        return store.whenComplete(() => {
          const received = store.actions;
          const expected = showAlert({
            color: 'success',
            isScroll: false,
            message: `${type} message`,
          });

          expect(received).toContainEqual(expected);
        });
      });
    });
  });
});
