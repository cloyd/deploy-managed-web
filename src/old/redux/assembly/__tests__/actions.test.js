/* eslint-disable no-undef */
import {
  createBank,
  createCard,
  destroyAccount,
  enablePayment,
  fetchAccounts,
  fetchPropertyAccounts,
  resetAccounts,
  setAutoPay,
  setDisbursement,
  setDisbursementProperty,
  setNoDefaultPayment,
  setNoDefaultPaymentProperty,
  setPayment,
  setPaymentProperty,
} from '..';
import {
  CREATE_BANK,
  CREATE_CARD,
  DESTROY_ACCOUNT,
  ENABLE_PAYMENT,
  FETCH,
  FETCH_ACCOUNTS,
  RESET,
  SET_AUTO_PAY,
  SET_DISBURSEMENT,
  SET_DISBURSEMENT_PROPERTY,
  SET_PAYMENT,
  SET_PAYMENT_PROPERTY,
} from '../constants';

describe('assembly/actions', () => {
  it('should return action for createBank', () => {
    const params = {
      amountCents: 'amountCents',
      externalCreditorId: 'externalCreditorId',
      isDefault: 'isDefault',
      isDisbursement: 'isDisbursement',
    };

    const received = createBank({ ...params, a: 'b' });
    const expected = {
      type: CREATE_BANK,
      payload: { ...params, params: { a: 'b' } },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for createCard', () => {
    const params = {
      isDefault: 'isDefault',
    };

    const received = createCard({ ...params, a: 'b' });
    const expected = {
      type: CREATE_CARD,
      payload: { ...params, params: { a: 'b' } },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for destroyAccount', () => {
    const params = {
      externalCreditorId: 'externalCreditorId',
      promisepayId: 'promisepayId',
      fingerprint: 'owner:2',
    };

    const received = destroyAccount(params);
    const expected = {
      type: DESTROY_ACCOUNT,
      payload: {
        promisepayId: 'promisepayId',
        params: {
          externalCreditorId: 'externalCreditorId',
          fingerprint: 'owner:2',
        },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for enablePayment', () => {
    const received = enablePayment({
      amountCents: 100000,
      externalCreditorId: 2,
      promisepayId: 3,
      a: 'b',
    });
    const expected = {
      type: ENABLE_PAYMENT,
      payload: {
        amountCents: 100000,
        externalCreditorId: 2,
        promisepayId: 3,
      },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchAccounts', () => {
    const received = fetchAccounts({ externalCreditorId: 1 });
    const expected = {
      type: FETCH,
      payload: { params: { externalCreditorId: 1 } },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchPropertyAccounts', () => {
    const received = fetchPropertyAccounts({ ownerId: 'a', propertyId: 'b' });
    const expected = {
      type: FETCH_ACCOUNTS,
      payload: { ownerId: 'a', propertyId: 'b' },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for resetAccounts', () => {
    const received = resetAccounts();
    const expected = { type: RESET };
    expect(received).toEqual(expected);
  });

  it('should return action for setAutoPay', () => {
    const received = setAutoPay({
      autoPay: true,
      fingerprint: '123',
      propertyId: 1,
    });
    const expected = {
      type: SET_AUTO_PAY,
      payload: { params: { autoPay: true, fingerprint: '123', propertyId: 1 } },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for setNoDefaultPayment', () => {
    const fingerprint = 'owner:1';
    const received = setNoDefaultPayment({ fingerprint });
    const expected = {
      type: SET_PAYMENT,
      payload: { params: { promisepayId: null, fingerprint } },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for setNoDefaultPaymentProperty', () => {
    const received = setNoDefaultPaymentProperty({
      ownerId: 11,
      propertyId: 22,
    });
    const expected = {
      type: SET_PAYMENT_PROPERTY,
      payload: {
        ownerId: 11,
        propertyId: 22,
        promisepayId: null,
      },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for setPayment', () => {
    const params = { promisepayId: 'promisepayId' };
    const received = setPayment(params);
    const expected = { type: SET_PAYMENT, payload: { params } };

    expect(received).toEqual(expected);
  });

  it('should return action for setDisbursement', () => {
    const params = { promisepayId: 'promisepayId' };
    const received = setDisbursement(params);
    const expected = { type: SET_DISBURSEMENT, payload: { params } };

    expect(received).toEqual(expected);
  });

  it('should return action for setDisbursementProperty', () => {
    const received = setDisbursementProperty({ a: 'a', b: 'b' });
    const expected = {
      type: SET_DISBURSEMENT_PROPERTY,
      payload: { a: 'a', b: 'b' },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for setPaymentProperty', () => {
    const received = setPaymentProperty({ a: 'a', b: 'b' });
    const expected = {
      type: SET_PAYMENT_PROPERTY,
      payload: { a: 'a', b: 'b' },
    };

    expect(received).toEqual(expected);
  });
});
