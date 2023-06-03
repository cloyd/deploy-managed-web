/* eslint-disable no-undef */
import reducer, {
  decorateLease,
  fetchLease,
  fetchLeases,
  initialState,
  logic,
} from '..';
import { mockHttpClient, mockReduxLogic } from '../../__mocks__';
import { hideLoading, showLoading } from '../../notifier';
import {
  ACTIVATE,
  ADD_TENANT,
  DISBURSE,
  ERROR,
  FETCH_ALL_SUCCESS,
  FETCH_MODIFICATIONS,
  FETCH_MODIFICATIONS_SUCCESS,
  MODIFY_RENT_SUCCESS,
  SUCCESS,
  UPDATE,
} from '../constants';

jest.mock('../decorators', () => {
  const passThrough = (a) => a;

  return {
    decorateLease: jest.fn().mockImplementation(passThrough),
    decorateModifications: jest.fn().mockImplementation(passThrough),
  };
});

describe('lease/logic', () => {
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

  describe('ACTIVATE', () => {
    const { leaseId, params } = { leaseId: 1, params: { a: 'a', b: 'b' } };

    beforeEach(() => {
      request = mockHttpClient.onPost(`/leases/${leaseId}/activate`, params);
    });

    it('should dispatch SUCCESS on success', (done) => {
      store.dispatch({ type: ACTIVATE, payload: { leaseId, params } });
      request.reply(200, { lease: { id: leaseId } });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: SUCCESS,
          payload: {
            data: { [leaseId]: { id: leaseId } },
            result: leaseId,
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: ACTIVATE, payload: { leaseId, params } });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('ADD_TENANT', () => {
    const leaseId = 1;

    jest.mock('settings', () => ({
      notifications: {
        userInvited: false,
      },
    }));

    beforeEach(() => {
      params = {
        firstName: 'Joe',
        lastName: 'Blogs',
      };

      request = mockHttpClient.onPost(`/leases/1/add-tenant`, params);
    });

    it('should dispatch SUCCESS with userIsInvited', (done) => {
      store.dispatch({ type: ADD_TENANT, payload: { leaseId, params } });
      request.reply(200, { lease: { id: leaseId } });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: SUCCESS,
          payload: {
            data: { [leaseId]: { id: leaseId } },
            result: leaseId,
            alert: {
              color: 'info',
              message:
                'The tenant has been sent an activation email. Please follow up with them to make sure they complete their welcome steps.',
            },
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: ADD_TENANT, payload: { leaseId, params } });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('DISBURSE', () => {
    beforeEach(() => {
      params = { bondReturnedCents: 10000, bondNumber: 123 };
      request = mockHttpClient.onPost(`/leases/1/disburse-bond`, params);
    });

    it('should dispatch SUCCESS on success', (done) => {
      const payload = { id: 1, params };

      store.dispatch({ type: DISBURSE, payload });
      request.reply(200, { lease: payload });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: SUCCESS,
          payload: { data: { 1: payload }, result: 1 },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should call decorateLease on success', (done) => {
      const payload = { id: 1, params };

      store.dispatch({ type: DISBURSE, payload });
      request.reply(200, { lease: payload });

      store.whenComplete(() => {
        expect(decorateLease).toHaveBeenCalledWith(payload);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      const payload = { id: 1, params };

      store.dispatch({ type: DISBURSE, payload });
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
    const leaseId = 1;

    beforeEach(() => {
      request = mockHttpClient.onGet(`/leases/${leaseId}`);
    });

    it('should dispatch SUCCESS on success', (done) => {
      const lease = { id: 1, title: 'Title' };

      store.dispatch(fetchLease({ leaseId: lease.id }));
      request.reply(200, { lease });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: SUCCESS,
          payload: { data: { 1: lease }, result: 1 },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should call decorateLease on success', (done) => {
      const lease = { id: 1, title: 'Title' };

      store.dispatch(fetchLease({ leaseId: lease.id }));
      request.reply(200, { lease });

      store.whenComplete(() => {
        expect(decorateLease).toHaveBeenCalledWith(lease);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch(fetchLease({ leaseId }));
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
    const leases = [
      { id: 1, title: 'Title 1' },
      { id: 2, title: 'Title 2' },
    ];

    describe('with propertyId', () => {
      const propertyId = 1;

      beforeEach(() => {
        request = mockHttpClient.onGet(`/properties/${propertyId}/leases`);
      });

      it('should dispatch SUCCESS on success', (done) => {
        store.dispatch(fetchLeases({ propertyId }));
        request.reply(200, { leases });

        store.whenComplete(() => {
          const received = store.actions;
          const expected = {
            type: FETCH_ALL_SUCCESS,
            payload: {
              data: { 1: leases[0], 2: leases[1] },
              results: [1, 2],
            },
          };

          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should dispatch ERROR on fail', (done) => {
        store.dispatch(fetchLeases({ propertyId }));
        request.reply(500, {});

        store.whenComplete(() => {
          const received = store.actions;
          const expected = reduxLogicError;

          expect(received).toContainEqual(expected);
          done();
        });
      });
    });

    describe('without propertyId', () => {
      beforeEach(() => {
        request = mockHttpClient.onGet(`/leases`);
      });

      it('should dispatch SUCCESS on success', (done) => {
        store.dispatch(fetchLeases());
        request.reply(200, { leases });

        store.whenComplete(() => {
          const received = store.actions;
          const expected = {
            type: FETCH_ALL_SUCCESS,
            payload: {
              data: { 1: leases[0], 2: leases[1] },
              results: [1, 2],
            },
          };

          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should dispatch ERROR on fail', (done) => {
        store.dispatch(fetchLeases());
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

  describe('FETCH_MODIFICATIONS', () => {
    const leaseId = 1;
    const params = { foo: 'bar' };

    beforeEach(() => {
      request = mockHttpClient.onGet(`/leases/${leaseId}/rent-modifications`);
    });

    it('should dispatch FETCH_MODIFICATIONS_SUCCESS on success', (done) => {
      store.dispatch({
        type: FETCH_MODIFICATIONS,
        payload: { leaseId, params },
      });

      request.reply(200, { leaseRents: ['a'] });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: FETCH_MODIFICATIONS_SUCCESS,
          payload: {
            leaseId,
            modifications: ['a'],
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({
        type: FETCH_MODIFICATIONS,
        payload: { leaseId, params },
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

  describe('ERROR', () => {
    it('should dispatch hideLoading on ERROR', (done) => {
      store.dispatch(reduxLogicError);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = hideLoading();

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('UPDATE', () => {
    beforeEach(() => {
      params = { a: 'a' };
      request = mockHttpClient.onPut(`/leases/1`, params);
    });

    it('should dispatch SUCCESS on success', (done) => {
      const payload = { id: 1, params };

      store.dispatch({ type: UPDATE, payload: { leaseId: 1, params } });
      request.reply(200, { lease: payload });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: SUCCESS,
          payload: {
            data: { 1: payload },
            result: 1,
            alert: {
              color: 'success',
              message:
                '<strong>Success:</strong> The lease has been successfully updated.',
            },
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should call decorateLease on success', (done) => {
      const payload = { id: 1, params };

      store.dispatch({ type: UPDATE, payload: { leaseId: 1, params } });
      request.reply(200, { lease: payload });

      store.whenComplete(() => {
        expect(decorateLease).toHaveBeenCalledWith(payload);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: UPDATE, payload: { leaseId: 1, params } });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('showLoading', () => {
    [DISBURSE].map((type) => {
      it(`should dispatch showLoading when for ${type}`, (done) => {
        store.dispatch({ type, payload: {} });

        store.whenComplete(() => {
          const received = store.actions;
          const expected = showLoading();
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });
  });

  describe('hideLoading', () => {
    [ERROR, MODIFY_RENT_SUCCESS, SUCCESS].map((type) => {
      it(`should dispatch showLoading when for ${type}`, (done) => {
        store.dispatch({ type, payload: {} });

        store.whenComplete(() => {
          const received = store.actions;
          const expected = hideLoading();
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });
  });
});
