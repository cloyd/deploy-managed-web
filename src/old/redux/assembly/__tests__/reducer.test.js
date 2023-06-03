/* eslint-disable no-undef */
import reducer, { initialState } from '..';
import {
  CREATE_BANK,
  CREATE_CARD,
  DESTROY_ACCOUNT,
  ENABLE_PAYMENT,
  ERROR,
  FETCH,
  FETCH_ACCOUNTS_SUCCESS,
  FETCH_SUCCESS,
  RESET,
  SET_AUTO_PAY,
  SET_AUTO_PAY_SUCCESS,
  SET_PAYMENT,
  UPDATE_STATE_DATA,
} from '../constants';

describe('assembly/reducer', () => {
  it('should define the initialState', () => {
    const received = initialState;
    const expected = {
      hasDefaultPayment: false,
      isAgreementComplete: false,
      isAutoPay: false,
      isLoading: false,
      isSelectedLoading: false,
      isPayByBpay: false,
      securityCode: null,
      data: {},
      cards: [],
      banks: [],
      disbursements: {
        default: null,
      },
      payments: {},
    };

    expect(received).toEqual(expected);
  });

  [DESTROY_ACCOUNT, ENABLE_PAYMENT, SET_AUTO_PAY, FETCH].map((type) => {
    it(`should handle ${type}`, () => {
      const state = {
        ...initialState,
        isLoading: false,
      };

      const received = reducer(state, { type });
      const expected = { ...state, isLoading: true };

      expect(received).toEqual(expected);
    });
  });

  [CREATE_BANK, CREATE_CARD].map((type) => {
    it(`should handle ${type}`, () => {
      const state = {
        ...initialState,
        securityCode: '123456',
        isLoading: false,
      };

      const received = reducer(state, {
        type,
        payload: {
          params: {
            securityCode: '123456',
          },
        },
      });
      const expected = { ...state, securityCode: '123456', isLoading: true };

      expect(received).toEqual(expected);
    });
  });

  it('should handle ERROR', () => {
    const state = { ...initialState, isLoading: true };
    const received = reducer(state, { type: ERROR });
    const expected = { ...state, isLoading: false };

    expect(received).toEqual(expected);
  });

  it('should handle FETCH_ACCOUNTS_SUCCESS', () => {
    const received = reducer(initialState, {
      type: FETCH_ACCOUNTS_SUCCESS,
      payload: {
        disbursementAccountPromisepayId: 'disbursementAccountPromisepayId',
        ownerId: 'ownerId',
        propertyId: 'propertyId',
        paymentAccountId: 'paymentAccountId',
        paymentAccountPromisepayId: 'paymentAccountPromisepayId',
        paymentAccountType: 'paymentAccountType',
      },
    });

    const expected = {
      ...initialState,
      securityCode: null,
      disbursements: {
        default: null,
        'ownerId-propertyId': 'disbursementAccountPromisepayId',
      },
      payments: {
        'ownerId-propertyId': {
          id: 'paymentAccountId',
          promisepayId: 'paymentAccountPromisepayId',
          type: 'paymentAccountType',
        },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should handle FETCH_SUCCESS', () => {
    const received = reducer(initialState, {
      type: FETCH_SUCCESS,
      payload: {
        autoPay: true,
        banks: [1],
        cards: [2],
        data: [{ 1: 'bank', 2: 'card' }],
        disbursementAccount: { promisepayId: 1 },
        hasDefaultPayment: false,
      },
    });

    const expected = {
      ...initialState,
      isAutoPay: true,
      hasDefaultPayment: false,
      isPayByBpay: false, // Should set bpay to false - tenants do not have disbursements
      isLoading: false,
      banks: [1],
      cards: [2],
      data: [{ 1: 'bank', 2: 'card' }],
      disbursements: { default: 1 },
    };

    expect(received).toEqual(expected);
  });

  it('should handle RESET', () => {
    const state = {
      ...initialState,
      isAutoPay: true,
      hasDefaultPayment: true,
      isLoading: false,
      accounts: {
        bank: 'bank',
        card: 'card',
      },
    };

    const received = reducer(state, { type: RESET });
    const expected = initialState;

    expect(received).toEqual(expected);
  });

  it('should handle SET_AUTO_PAY', () => {
    const state = {
      ...initialState,
      isLoading: false,
    };

    const received = reducer(state, {
      type: SET_AUTO_PAY,
      payload: {},
    });

    const expected = { ...state, isLoading: true };

    expect(received).toEqual(expected);
  });

  it('should handle SET_AUTO_PAY_SUCCESS', () => {
    const state = {
      ...initialState,
      isLoading: true,
      isAutoPay: false,
    };

    const received = reducer(state, {
      type: SET_AUTO_PAY_SUCCESS,
      payload: { params: { autoPay: true } },
    });

    const expected = { ...state, isAutoPay: true, isLoading: false };

    expect(received).toEqual(expected);
  });

  it('should handle SET_PAYMENT', () => {
    const state = {
      ...initialState,
      isLoading: false,
      hasDefaultPayment: false,
    };

    const received = reducer(state, {
      type: SET_PAYMENT,
      payload: { params: { promisepayId: 1 } },
    });

    const expected = { ...state, hasDefaultPayment: true, isLoading: true };

    expect(received).toEqual(expected);
  });

  describe('UPDATE_STATE_DATA', () => {
    const promisepayId = 123456;
    const state = {
      ...initialState,
      banks: [11111, 22222],
      cards: [33333, 44444],
    };

    it('should handle updating state with a bank account', () => {
      const params = {
        bankName: 'Foo Bank',
        accountName: 'Bar Account',
      };

      const received = reducer(state, {
        type: UPDATE_STATE_DATA,
        payload: { promisepayId, params },
      });

      const expected = {
        ...state,
        banks: [...state.banks, promisepayId],
        data: { [promisepayId]: { ...params, promisepayId } },
      };

      expect(received).toEqual(expected);
    });

    it('should handle updating state with a card', () => {
      const params = {
        number: 999999,
      };

      const received = reducer(state, {
        type: UPDATE_STATE_DATA,
        payload: { promisepayId, params },
      });

      const expected = {
        ...state,
        cards: [...state.cards, promisepayId],
        data: { [promisepayId]: { ...params, promisepayId } },
      };

      expect(received).toEqual(expected);
    });
  });
});
