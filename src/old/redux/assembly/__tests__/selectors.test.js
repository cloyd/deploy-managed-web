/* eslint-disable no-undef */
import {
  getAvailableDisbursementAccounts,
  getBankAccounts,
  getBankAccountsKeyed,
  getCardAccounts,
  getCardAccountsKeyed,
  getDisbursementAccount,
  getPaymentAccount,
  hasBankAccount,
  hasCardAccount,
  hasDefaultAccount,
  hasDisbursementAccount,
  hasPaymentMethod,
  initialState,
} from '..';

describe('assembly/selectors', () => {
  describe('get accounts keyed', () => {
    const keys = ['foo', 'bar'];
    const data = {
      foo: { id: 111, promisepayId: 'aaa' },
      hello: { id: 222, promisepayId: 'bbb' },
      bar: { id: 444, promisepayId: 'ccc' },
    };

    const expected = {
      111: { id: 111, promisepayId: 'aaa' },
      444: { id: 444, promisepayId: 'ccc' },
    };

    it('should select getBankAccountsKeyed', () => {
      const received = getBankAccountsKeyed({
        ...initialState,
        banks: keys,
        data,
      });

      expect(received).toEqual(expected);
    });

    it('should select getCardAccountsKeyed', () => {
      const received = getCardAccountsKeyed({
        ...initialState,
        cards: keys,
        data,
      });

      expect(received).toEqual(expected);
    });
  });

  it('should select getAvailableDisbursementAccounts', () => {
    const received = getAvailableDisbursementAccounts(
      {
        ...initialState,
        banks: ['foo', 'bar', 'hello'],
        data: {
          foo: { id: 111, promisepayId: 'aaa' },
          hello: { id: 222, promisepayId: 'bbb' },
          bar: { id: 444, promisepayId: 'ccc' },
        },
      },
      { promisepayId: 'ccc' }
    );

    const expected = [
      { id: 111, promisepayId: 'aaa' },
      { id: 222, promisepayId: 'bbb' },
    ];

    expect(received).toEqual(expected);
  });

  it('should select getCardAccounts', () => {
    const received = getCardAccounts({
      ...initialState,
      data: { 1: 'card' },
      cards: [1],
    });
    const expected = ['card'];

    expect(received).toEqual(expected);
  });

  it('should select getBankAccounts', () => {
    const received = getBankAccounts({
      ...initialState,
      data: { 1: 'bank' },
      banks: [1],
    });
    const expected = ['bank'];

    expect(received).toEqual(expected);
  });

  describe('getPaymentAccount', () => {
    const state = {
      ...initialState,
      data: {
        1: { id: 1, promisepayId: 1, isDefault: false },
        2: { id: 2, promisepayId: 2, isDefault: false },
        3: { id: 3, promisepayId: 3, isDefault: false },
        4: { id: 4, promisepayId: 4, isDefault: true },
      },
      banks: [1, 2],
      cards: [3, 4],
    };

    it('should select getPaymentAccount for card account', () => {
      const received = getPaymentAccount(state);
      const expected = 4;

      expect(received.id).toEqual(expected);
    });

    it('should select getPaymentAccount for bank account', () => {
      const received = getPaymentAccount({
        ...state,
        data: {
          1: { id: 1, isDefault: true },
          4: { id: 4, isDefault: false },
        },
      });

      const expected = 1;

      expect(received.id).toEqual(expected);
    });

    it('should select getPaymentAccount for the owner/property', () => {
      const received = getPaymentAccount(
        {
          ...state,
          payments: {
            'ownerId-propertyId': { id: 666, type: 'type', promisepayId: 3 },
          },
        },
        {
          ownerId: 'ownerId',
          propertyId: 'propertyId',
        }
      );
      const expected = 3;

      expect(received.id).toEqual(expected);
    });
  });

  describe('getDisbursementAccount', () => {
    let state;

    beforeEach(() => {
      state = {
        ...initialState,
        data: {
          1: { id: 1 },
          2: { id: 2 },
        },
        disbursements: {
          default: 2,
          'ownerId-propertyId': 1,
        },
      };
    });

    it('should select getDisbursementAccount default', () => {
      const received = getDisbursementAccount(state);
      const expected = 2;
      expect(received.id).toEqual(expected);
    });

    it('should select getDisbursementAccount for the owner/property', () => {
      const received = getDisbursementAccount(state, {
        ownerId: 'ownerId',
        propertyId: 'propertyId',
      });
      const expected = 1;
      expect(received.id).toEqual(expected);
    });
  });

  describe('hasBankAccount', () => {
    it('should return false when banks.length === 0', () => {
      const received = hasBankAccount(initialState);
      const expected = false;

      expect(received).toEqual(expected);
    });

    it('should return true when banks.length > 0', () => {
      const received = hasBankAccount({
        ...initialState,
        banks: [1],
      });
      const expected = true;

      expect(received).toEqual(expected);
    });
  });

  describe('hasCardAccount', () => {
    it('should return false when cards.length === 0', () => {
      const received = hasCardAccount(initialState);
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should return true when cards.length > 0', () => {
      const received = hasCardAccount({ ...initialState, cards: [1] });
      const expected = true;
      expect(received).toEqual(expected);
    });
  });

  describe('hasDefaultAccount', () => {
    it('should return false when no accounts isDefault', () => {
      const state = {
        ...initialState,
        data: {
          1: { id: 1, isDefault: false },
          2: { id: 2, isDefault: false },
        },
        cards: [1],
        banks: [2],
      };

      const received = hasDefaultAccount(state);
      const expected = false;

      expect(received).toBe(expected);
    });

    it('should return true when a card account has isDefault', () => {
      const state = {
        ...initialState,
        data: {
          1: { id: 1, isDefault: true },
          2: { id: 2, isDefault: false },
        },
        cards: [1],
        banks: [2],
      };

      const received = hasDefaultAccount(state);
      const expected = true;

      expect(received).toBe(expected);
    });

    it('should return true when a bank account has isDefault', () => {
      const state = {
        ...initialState,
        data: {
          1: { id: 1, isDefault: false },
          2: { id: 2, isDefault: true },
        },
        cards: [1],
        banks: [2],
      };

      const received = hasDefaultAccount(state);
      const expected = true;

      expect(received).toBe(expected);
    });
  });

  describe('hasDisbursementAccount', () => {
    it('should return false when no disbursement accounts are set', () => {
      const state = {
        ...initialState,
        data: {
          1: { id: 1 },
          2: { id: 2 },
        },
        disbursements: {},
      };

      const received = hasDisbursementAccount(state);
      const expected = false;

      expect(received).toBe(expected);
    });

    it('should return true when disbursement accounts are set', () => {
      const state = {
        ...initialState,
        data: {
          1: { id: 1 },
          2: { id: 2 },
        },
        disbursements: {
          default: 1,
        },
      };

      const received = hasDisbursementAccount(state);
      const expected = true;

      expect(received).toBe(expected);
    });
  });

  describe('hasPaymentMethod', () => {
    it('should return false by default', () => {
      const received = hasPaymentMethod(initialState);
      const expected = false;

      expect(received).toEqual(expected);
    });

    it('should return true when banks.length > 0', () => {
      const received = hasPaymentMethod({
        ...initialState,
        banks: [1],
      });
      const expected = true;

      expect(received).toEqual(expected);
    });

    it('should return true when cards.length > 0', () => {
      const received = hasPaymentMethod({
        ...initialState,
        cards: [1],
      });
      const expected = true;

      expect(received).toEqual(expected);
    });
  });
});
