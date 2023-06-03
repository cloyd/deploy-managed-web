/* eslint-disable no-undef */
import reducer, {
  enableDisbursement,
  enablePayment,
  fetchAccounts,
  initialState,
  logic,
  setDisbursement,
} from '..';
import { mockHttpClient, mockReduxLogic } from '../../__mocks__';
import { hideLoading, showAlert, showLoading } from '../../notifier';
import {
  CREATE_BANK,
  CREATE_CARD,
  DESTROY_ACCOUNT,
  ERROR,
  FETCH,
  FETCH_ACCOUNTS,
  FETCH_ACCOUNTS_SUCCESS,
  FETCH_SUCCESS,
  SET_AUTO_PAY,
  SET_AUTO_PAY_SUCCESS,
  SET_DISBURSEMENT,
  SET_DISBURSEMENT_PROPERTY,
  SET_DISBURSEMENT_PROPERTY_SUCCESS,
  SET_PAYMENT,
  SET_PAYMENT_PROPERTY,
  SET_PAYMENT_PROPERTY_SUCCESS,
} from '../constants';

// Mock promisepay
window.promisepay = {
  createBankAccount: jest.fn(),
  createCardAccount: jest.fn(),
};

describe('assembly/logic', () => {
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

  describe('CREATE_BANK', () => {
    const promisepayId = 1;
    const externalCreditorId = 'externalCreditorId';
    const fingerprint = 'owner:1';
    const onFail = showAlert({
      color: 'danger',
      message: `<b>Error</b>: An error occured adding your bank account.`,
    });

    beforeEach(() => {
      params = {
        externalCreditorId,
        params: {
          fingerprint,
          promisepayId,
        },
      };

      request = {
        addAccount: mockHttpClient.onPost('/assembly/add-bank-account', {
          fingerprint,
          externalCreditorId,
          promisepayId,
        }),
      };
    });

    describe('addAccount', () => {
      it('should dispatch fetchAccounts onSuccess', (done) => {
        store.dispatch({
          type: CREATE_BANK,
          payload: { ...params },
        });

        request.addAccount.reply(200, {});

        store.whenComplete(() => {
          const received = store.actions;
          const expected = fetchAccounts({ externalCreditorId });

          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should dispatch showAlert when request.addAccount fails', (done) => {
        store.dispatch({ type: CREATE_BANK, payload: params });
        request.addAccount.reply(422, {});

        store.whenComplete(() => {
          const received = store.actions;
          const expected = onFail;

          expect(received).toContainEqual(expected);
          done();
        });
      });
    });

    describe('onSuccess', () => {
      beforeEach(() => {
        request.addAccount.reply(200, {});
      });

      it('should dispatch enablePayment onSuccess when isDefault', () => {
        store.dispatch({
          type: CREATE_BANK,
          payload: { ...params, isDefault: true },
        });

        return store.whenComplete(() => {
          const received = store.actions;
          const expected = enablePayment({
            ...params,
            promisepayId,
            fingerprint,
          });

          expect(received).toContainEqual(expected);
        });
      });

      it('should dispatch setDisbursement onSuccess when isDisbursement and is onboarding', () => {
        store.dispatch({
          type: CREATE_BANK,
          payload: {
            ...params,
            externalCreditorId,
            isDisbursement: true,
            isOnboarding: true,
          },
        });

        return store.whenComplete(() => {
          const received = store.actions;
          const expected = setDisbursement({
            promisepayId,
            externalCreditorId,
            fingerprint,
          });

          expect(received).toContainEqual(expected);
        });
      });

      it('should dispatch enableDisbursement onSuccess when isDisbursement and is not onboarding', () => {
        store.dispatch({
          type: CREATE_BANK,
          payload: {
            ...params,
            externalCreditorId,
            isDisbursement: true,
            isOnboarding: false,
          },
        });

        return store.whenComplete(() => {
          const received = store.actions;
          const expected = enableDisbursement({
            ...params,
            fingerprint,
            promisepayId,
            externalCreditorId,
          });

          expect(received).toContainEqual(expected);
        });
      });

      it('should dispatch fetchAccounts onSuccess by default', () => {
        store.dispatch({
          type: CREATE_BANK,
          payload: { ...params, externalCreditorId },
        });

        return store.whenComplete(() => {
          const received = store.actions;
          const expected = fetchAccounts({ externalCreditorId });

          expect(received).toContainEqual(expected);
        });
      });
    });
  });

  describe('CREATE_CARD', () => {
    const onFail = showAlert({
      color: 'danger',
      message: `<b>Error</b>: An error occured adding your credit card`,
    });

    beforeEach(() => {
      params = {
        params: { aB: 'ab' },
      };

      request = {
        addAccount: mockHttpClient.onPost('/assembly/add-credit-card'),
      };
    });

    describe('onFail', () => {
      it('should call onFail when addAccount fails', (done) => {
        request.addAccount.reply(500, {});
        store.dispatch({ type: CREATE_CARD, payload: params });

        store.whenComplete(() => {
          const received = store.actions;
          const expected = onFail;

          expect(received).toContainEqual(expected);
          done();
        });
      });
    });

    describe('onSuccess', () => {
      it('should dispatch fetchAccounts onSuccess', (done) => {
        store.dispatch({
          type: CREATE_CARD,
          payload: { ...params },
        });

        request.addAccount.reply(200, {});

        store.whenComplete(() => {
          const received = store.actions;
          const expected = fetchAccounts();

          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should dispatch showAlert onFail', (done) => {
        store.dispatch({ type: CREATE_CARD, payload: params });
        request.addAccount.reply(422, {});

        store.whenComplete(() => {
          const received = store.actions;
          const expected = onFail;

          expect(received).toContainEqual(expected);
          done();
        });
      });
    });
  });

  describe('DESTROY_ACCOUNT', () => {
    let payload;

    beforeEach(() => {
      payload = { promisepayId: 1 };
      request = mockHttpClient.onDelete(`/assembly/account/1`);
    });

    it('should dispatch fetchAccounts on success with passed params', (done) => {
      store.dispatch({
        type: DESTROY_ACCOUNT,
        payload: { ...payload, params: { externalCreditorId: 2 } },
      });

      request.reply(200);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = fetchAccounts({ externalCreditorId: 2 });

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: DESTROY_ACCOUNT, payload });
      request.reply(500);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch showLoading', (done) => {
      store.dispatch({ type: DESTROY_ACCOUNT, payload });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = showLoading();

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('ERROR', () => {
    it('should dispatch hideLoading', (done) => {
      store.dispatch({ type: ERROR, payload: {} });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = hideLoading();

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('FETCH', () => {
    beforeEach(() => {
      request = mockHttpClient.onGet(`/assembly/list-accounts`, {
        params: 'params',
      });
    });

    it('should dispatch FETCH_SUCCESS on success', (done) => {
      store.dispatch({ type: FETCH, payload: { params: 'params' } });
      request.reply(200, {
        bank: [{ id: 1, promisepayId: '1' }],
        card: [{ id: 2, promisepayId: '2' }],
      });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: FETCH_SUCCESS,
          payload: {
            banks: ['1'],
            cards: ['2'],
            data: {
              1: { id: 1, promisepayId: '1' },
              2: { id: 2, promisepayId: '2' },
            },
          },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: FETCH, payload: { params: 'params' } });
      request.reply(500);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch showLoading', (done) => {
      store.dispatch({ type: FETCH, payload: { params: 'params' } });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = showLoading();

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('FETCH_ACCOUNTS', () => {
    const ownerId = 1;
    const propertyId = 2;

    beforeEach(() => {
      request = mockHttpClient.onGet(
        `/properties/${propertyId}/owners/${ownerId}`
      );
    });

    it('should dispatch FETCH_ACCOUNTS_SUCCESS on success', (done) => {
      store.dispatch({
        type: FETCH_ACCOUNTS,
        payload: { ownerId, propertyId },
      });
      request.reply(200, {
        ownerProperty: 'ownerProperty',
      });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: FETCH_ACCOUNTS_SUCCESS,
          payload: 'ownerProperty',
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({
        type: FETCH_ACCOUNTS,
        payload: { ownerId, propertyId },
      });
      request.reply(500);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('FETCH_SUCCESS', () => {
    it('should dispatch hideLoading', (done) => {
      store.dispatch({ type: FETCH_SUCCESS, payload: {} });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = hideLoading();

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('SET_AUTO_PAY', () => {
    const params = {
      autoPay: true,
    };

    beforeEach(() => {
      request = mockHttpClient.onPost(`/assembly/set-auto-pay`, params);
    });

    it('should dispatch SET_AUTO_PAY_SUCCESS on success', (done) => {
      store.dispatch({ type: SET_AUTO_PAY, payload: { params } });
      request.reply(200, 'response');

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: SET_AUTO_PAY_SUCCESS,
          payload: { params },
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: SET_AUTO_PAY, payload: { params } });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('SET_PAYMENT', () => {
    const params = {
      promisepayId: 1,
    };

    beforeEach(() => {
      request = mockHttpClient.onPost(`/assembly/set-default`, params);
    });

    it('should dispatch fetchAccounts on success', (done) => {
      store.dispatch({ type: SET_PAYMENT, payload: { params } });
      request.reply(200, 'response');

      store.whenComplete(() => {
        const received = store.actions;
        const expected = fetchAccounts(expect.any(Object));

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: SET_PAYMENT, payload: { params } });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch showLoading', (done) => {
      store.dispatch({ type: SET_PAYMENT, payload: { params } });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = showLoading();

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('SET_DISBURSEMENT', () => {
    const params = {
      promisepayId: 1,
    };

    beforeEach(() => {
      request = mockHttpClient.onPost(
        `/assembly/set-disbursement-account`,
        params
      );
    });

    it('should dispatch fetchAccounts on success', (done) => {
      store.dispatch({ type: SET_DISBURSEMENT, payload: { params } });
      request.reply(200, 'response');

      store.whenComplete(() => {
        const received = store.actions;
        const expected = fetchAccounts(expect.any(Object));

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({ type: SET_DISBURSEMENT, payload: { params } });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch showLoading', (done) => {
      store.dispatch({ type: SET_DISBURSEMENT, payload: { params } });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = showLoading();

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('SET_DISBURSEMENT_PROPERTY', () => {
    const promisepayId = 1;
    const propertyId = 2;
    const ownerId = 3;
    const securityCode = '123456';

    beforeEach(() => {
      request = mockHttpClient.onPut(
        `/properties/${propertyId}/owners/${ownerId}`,
        {
          disbursementAccountPromisepayId: promisepayId,
          authyToken: securityCode,
        }
      );
    });

    it('should dispatch SET_DISBURSEMENT_PROPERTY_SUCCESS on success', (done) => {
      store.dispatch({
        type: SET_DISBURSEMENT_PROPERTY,
        payload: {
          promisepayId,
          propertyId,
          ownerId,
          securityCode,
        },
      });
      request.reply(200, { ownerProperty: 'ownerProperty' });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: SET_DISBURSEMENT_PROPERTY_SUCCESS,
          payload: 'ownerProperty',
        };

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({
        type: SET_DISBURSEMENT_PROPERTY,
        payload: { promisepayId, propertyId, ownerId, securityCode },
      });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch showLoading', (done) => {
      store.dispatch({ type: SET_DISBURSEMENT, payload: { params } });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = showLoading();

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('SET_PAYMENT_PROPERTY', () => {
    const promisepayId = 1;
    const propertyId = 2;
    const ownerId = 3;
    const securityCode = '123456';

    beforeEach(() => {
      request = mockHttpClient.onPut(
        `/properties/${propertyId}/owners/${ownerId}`,
        { paymentAccountPromisepayId: promisepayId, authyToken: securityCode }
      );
    });

    it('should dispatch SET_PAYMENT_PROPERTY_SUCCESS on success', (done) => {
      store.dispatch({
        type: SET_PAYMENT_PROPERTY,
        payload: { promisepayId, propertyId, ownerId, securityCode },
      });
      request.reply(200, { ownerProperty: 'ownerProperty' });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = {
          type: SET_PAYMENT_PROPERTY_SUCCESS,
          payload: 'ownerProperty',
        };
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch ERROR on fail', (done) => {
      store.dispatch({
        type: SET_PAYMENT_PROPERTY,
        payload: { promisepayId, propertyId, ownerId, securityCode },
      });
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = reduxLogicError;

        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should dispatch showLoading', (done) => {
      store.dispatch({ type: FETCH, payload: { params } });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = showLoading();

        expect(received).toContainEqual(expected);
        done();
      });
    });
  });
});
