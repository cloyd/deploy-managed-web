/* eslint-disable no-undef */
import reducer, { initialState, logic } from '..';
import { mockHttpClient, mockReduxLogic } from '../../__mocks__';
import { showAlert } from '../../notifier';
import {
  ARCHIVE,
  ARCHIVE_SUCCESS,
  CREATE,
  DESTROY,
  DESTROY_SUCCESS,
  ERROR,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  FETCH_FEE_AUDITS,
  FETCH_FEE_AUDITS_SUCCESS,
  SUCCESS,
  UPDATE,
} from '../constants';

// Mock decorateProperty and return response with added decorated key
jest.mock('../decorators', () => ({
  decorateProperty: jest
    .fn()
    .mockImplementation((resp) => ({ ...resp, decorated: true })),
}));

describe('property/logic', () => {
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
    beforeEach(() => {
      params = { a: 'a' };
      request = mockHttpClient.onPost(`/properties`, params);
    });

    it('should dispatch SUCCESS on success', (done) => {
      const response = { property: { ...params, id: 1 } };

      store.dispatch({
        type: CREATE,
        payload: { params },
      });

      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: SUCCESS,
          payload: {
            result: 1,
            data: {
              1: {
                ...response.property,
                decorated: true,
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
        type: CREATE,
        payload: { params },
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
    beforeEach(() => {
      params = { id: 1 };
      request = mockHttpClient.onDelete(`/properties/${params.id}`);
    });

    it('should dispatch SUCCESS on success', (done) => {
      store.dispatch({ type: DESTROY, payload: params });
      request.reply(200, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: DESTROY_SUCCESS,
          payload: params,
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: DESTROY, payload: params });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('ARCHIVE', () => {
    beforeEach(() => {
      params = { id: 1 };
      request = mockHttpClient.onPost(`/properties/${params.id}/archive`);
    });

    it('should dispatch ARCHIVE_SUCCESS on success', (done) => {
      store.dispatch({ type: ARCHIVE, payload: params });
      request.reply(200);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: ARCHIVE_SUCCESS,
          payload: Object.assign({}, params, {
            isArchived: true,
            message:
              '<strong>Success:</strong> Your property has been archived.',
          }),
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: ARCHIVE, payload: params });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('FETCH', () => {
    beforeEach(() => {
      params = { propertyId: 1 };
      request = mockHttpClient.onGet(`/properties/${params.propertyId}`);
    });

    it('should dispatch SUCCESS on success', (done) => {
      const response = { property: { ...params, id: 1 } };

      store.dispatch({ type: FETCH, payload: params });
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: SUCCESS,
          payload: {
            result: 1,
            data: {
              1: {
                ...response.property,
                decorated: true,
              },
            },
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
      request = mockHttpClient.onGet(`/properties`);
    });

    it('should dispatch SUCCESS on success', (done) => {
      const response = {
        properties: [{ id: 1 }, { id: 2 }],
      };

      store.dispatch({ type: FETCH_ALL, payload: { params } });
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: FETCH_ALL_SUCCESS,
          payload: {
            result: [1, 2],
            data: {
              1: { id: 1, decorated: true },
              2: { id: 2, decorated: true },
            },
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: FETCH_ALL, payload: { params } });
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
    beforeEach(() => {
      params = { a: 'a' };
      request = mockHttpClient.onPut(`/properties/1`, params);
    });

    it('should dispatch SUCCESS on success', (done) => {
      const response = { property: { ...params, id: 1 } };

      store.dispatch({ type: UPDATE, payload: { id: 1, params } });
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: SUCCESS,
          payload: {
            result: 1,
            data: {
              1: {
                ...response.property,
                decorated: true,
              },
            },
            message: '<strong>Success:</strong> Property has been updated.',
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: UPDATE, payload: { id: 1, params } });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('SUCCESS', () => {
    it('should dispatch showAlert when message is defined', (done) => {
      store.dispatch({
        type: SUCCESS,
        payload: { message: 'message' },
      });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = showAlert({ color: 'success', message: 'message' });

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('FETCH_FEE_AUDITS', () => {
    beforeEach(() => {
      params = { page: 1, propertyId: 1 };
      request = mockHttpClient.onGet(
        `/properties/${params.propertyId}/fees_audits`
      );
    });

    it('should dispatch SUCCESS on success', (done) => {
      const response = {
        audits: [],
      };

      store.dispatch({ type: FETCH_FEE_AUDITS, payload: params });
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = [
          { payload: params, type: FETCH_FEE_AUDITS },
          { payload: { 1: { audits: [] } }, type: FETCH_FEE_AUDITS_SUCCESS },
        ];
        expect(received).toEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: FETCH_FEE_AUDITS, payload: params });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });
});
