/* eslint-disable no-undef */
import reducer, {
  decorateIntention,
  fetchIntentions,
  fetchIntentionsCompleted,
  fetchIntentionsPayable,
  initialState,
  logic,
  payIntention,
} from '..';
import { mockHttpClient, mockReduxLogic } from '../../__mocks__';
import { hideLoading, showAlert, showLoading } from '../../notifier';
import {
  ADJUST_INTENTION_SUCCESS,
  DESTROY_INTENTION_SUCCESS,
  ERROR,
  FETCH,
  FETCH_ALL_SUCCESS,
  FETCH_SUCCESS,
  PAY_INTENTION,
  PAY_INTENTION_SUCCESS,
} from '../constants';

jest.mock('../decorators', () => {
  const passThrough = (a) => a;

  return {
    decorateIntention: jest.fn().mockImplementation(passThrough),
  };
});

describe('intention/logic', () => {
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

  describe('FETCH_ALL', () => {
    const params = {};

    it.skip('should dispatch FETCH_ALL_SUCCESS for no fetchType', (done) => {
      const intentions = [
        { id: 1, status: 'active', property: { id: 5 } },
        { id: 2, status: 'draft', property: { id: 5 } },
        { id: 3, status: 'active', property: { id: 4 } },
      ];

      store.dispatch(fetchIntentions({}));

      request = mockHttpClient.onGet('/intentions');
      request.reply(200, { intentions });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: FETCH_ALL_SUCCESS,
          payload: {
            data: {
              1: intentions[0],
              2: intentions[1],
              3: intentions[2],
            },
            results: [1, 2, 3],
          },
        };

        expect(received).toContainEqual(expect.objectContaining(expected));
        done();
      });
    });

    it('should dispatch FETCH_ALL_SUCCESS for fetchType completed', (done) => {
      const type = 'completed';
      const intentions = [
        { id: 1, status: 'active', property: { id: 5 } },
        { id: 2, status: 'draft', property: { id: 5 } },
        { id: 3, status: 'active', property: { id: 4 } },
      ];

      store.dispatch(fetchIntentionsCompleted());

      request = mockHttpClient.onGet('/intentions');
      request.reply(200, { intentions });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: FETCH_ALL_SUCCESS,
          payload: {
            data: {
              1: intentions[0],
              2: intentions[1],
              3: intentions[2],
            },
            results: {
              4: [3],
              5: [1, 2],
            },
            type,
          },
        };

        expect(received).toContainEqual(expect.objectContaining(expected));
        done();
      });
    });

    describe('when fetchType payable', () => {
      beforeEach(() => {
        request = mockHttpClient.onGet('/intentions/details');
      });

      it('should dispatch FETCH_ALL_SUCCESS', (done) => {
        const type = 'payable';
        const intentions = [
          { id: 1, status: 'active', property: { id: 5 } },
          { id: 2, status: 'draft', property: { id: 5 } },
          { id: 3, status: 'active', property: { id: 4 } },
        ];

        store.dispatch(fetchIntentionsPayable());
        request.reply(200, { intentions });

        store.whenComplete(() => {
          const received = store.actions;
          const expected = {
            type: FETCH_ALL_SUCCESS,
            payload: {
              data: {
                1: intentions[0],
                2: intentions[1],
                3: intentions[2],
              },
              results: {
                4: [3],
                5: [1, 2],
              },
              type,
            },
          };

          expect(received).toContainEqual(expect.objectContaining(expected));
          done();
        });
      });

      it('should call decorateIntention on success', (done) => {
        const intentions = [
          { id: 1, status: 'draft' },
          { id: 2, status: 'active' },
        ];

        store.dispatch(fetchIntentionsPayable(params));
        request.reply(200, { intentions });

        store.whenComplete(() => {
          expect(decorateIntention).toHaveBeenCalled();
          done();
        });
      });

      it('should return an empty object when intentions are empty', (done) => {
        const payload = [];

        store.dispatch(fetchIntentionsPayable(params));
        request.reply(200, { intentions: payload });

        store.whenComplete(() => {
          const received = store.actions;
          const expected = {
            type: FETCH_ALL_SUCCESS,
            payload: { data: [], results: [], type: 'payable' },
          };

          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should dispatch ERROR on fail', (done) => {
        store.dispatch(fetchIntentionsPayable(params));
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

  describe('PAY_INTENTION', () => {
    const intentionId = 2;
    const payingWalletId = 3;

    beforeEach(() => {
      request = mockHttpClient.onPost(`/intentions/${intentionId}/pay`, {
        payingWalletId,
      });
    });

    it('should dispatch showLoading', (done) => {
      store.dispatch(payIntention({ ...params }));

      store.whenComplete(() => {
        const received = store.actions;
        const expected = showLoading();

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch PAY_INTENTION_SUCCESS on success', (done) => {
      store.dispatch(payIntention({ intentionId, payingWalletId }));
      request.reply(200, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: PAY_INTENTION_SUCCESS,
          payload: expect.any(Object),
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch hideLoading on success', (done) => {
      store.dispatch(payIntention({ intentionId, payingWalletId }));
      request.reply(200, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = hideLoading();

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch(payIntention({ intentionId, payingWalletId }));
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

  describe('showAlert', () => {
    [PAY_INTENTION_SUCCESS].map((type) => {
      it(`should dispatch showAlert when for ${type}`, (done) => {
        store.dispatch({ type, payload: { message: 'message' } });

        store.whenComplete(() => {
          const received = store.actions;
          const expected = showAlert({
            color: 'success',
            isRedirect: true,
            message: 'message',
          });

          expect(received).toContainEqual(expected);
          done();
        });
      });
    });
  });

  describe('showLoading', () => {
    [FETCH, PAY_INTENTION].map((type) => {
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
    [ERROR, FETCH_SUCCESS, FETCH_ALL_SUCCESS, PAY_INTENTION_SUCCESS].map(
      (type) => {
        it(`should dispatch showLoading when for ${type}`, (done) => {
          store.dispatch({ type, payload: {} });

          store.whenComplete(() => {
            const received = store.actions;
            const expected = hideLoading();
            expect(received).toContainEqual(expected);
            done();
          });
        });
      }
    );
  });

  describe('fetch intentions following adjustment', () => {
    [ADJUST_INTENTION_SUCCESS, DESTROY_INTENTION_SUCCESS].map((type) => {
      it(`should dispatch fetchIntentionsPayable when ${type}`, (done) => {
        store.dispatch({ type, payload: { propertyId: 123 } });

        store.whenComplete(() => {
          const received = store.actions;
          const expected = fetchIntentionsPayable({ propertyId: 123 });
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });
  });
});
