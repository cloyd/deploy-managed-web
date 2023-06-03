/* eslint-disable no-undef */
import {
  CREATE_BANK,
  CREATE_CARD,
  DESTROY_ACCOUNT,
  ENABLE_PAYMENT,
  ERROR,
  FETCH,
  FETCH_ACCOUNTS,
  FETCH_ACCOUNTS_SUCCESS,
  FETCH_SUCCESS,
  RESET,
  SET_AUTO_PAY,
  SET_AUTO_PAY_SUCCESS,
  SET_DISBURSEMENT,
  SET_DISBURSEMENT_PROPERTY,
  SET_PAYMENT,
  SET_PAYMENT_PROPERTY,
  UPDATE_STATE_DATA,
} from '../constants';

describe('assembly/constants', () => {
  it('should return string for CREATE_BANK', () => {
    const received = CREATE_BANK;
    const expected = '@@app/assembly/CREATE_BANK';
    expect(received).toBe(expected);
  });

  it('should return string for CREATE_CARD', () => {
    const received = CREATE_CARD;
    const expected = '@@app/assembly/CREATE_CARD';
    expect(received).toBe(expected);
  });

  it('should return string for DESTROY_ACCOUNT', () => {
    const received = DESTROY_ACCOUNT;
    const expected = '@@app/assembly/DESTROY_ACCOUNT';
    expect(received).toBe(expected);
  });

  it('should return string for ERROR', () => {
    const received = ERROR;
    const expected = '@@app/assembly/ERROR';
    expect(received).toBe(expected);
  });

  it('should return string for ENABLE_PAYMENT', () => {
    const received = ENABLE_PAYMENT;
    const expected = '@@app/assembly/ENABLE_PAYMENT';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH', () => {
    const received = FETCH;
    const expected = '@@app/assembly/FETCH';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_SUCCESS', () => {
    const received = FETCH_SUCCESS;
    const expected = '@@app/assembly/FETCH_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_ACCOUNTS', () => {
    const received = FETCH_ACCOUNTS;
    const expected = '@@app/assembly/FETCH_ACCOUNTS';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_ACCOUNTS_SUCCESS', () => {
    const received = FETCH_ACCOUNTS_SUCCESS;
    const expected = '@@app/assembly/FETCH_ACCOUNTS_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for RESET', () => {
    const received = RESET;
    const expected = '@@app/assembly/RESET';
    expect(received).toBe(expected);
  });

  it('should return string for SET_AUTO_PAY', () => {
    const received = SET_AUTO_PAY;
    const expected = '@@app/assembly/SET_AUTO_PAY';
    expect(received).toBe(expected);
  });

  it('should return string for SET_AUTO_PAY_SUCCESS', () => {
    const received = SET_AUTO_PAY_SUCCESS;
    const expected = '@@app/assembly/SET_AUTO_PAY_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for SET_PAYMENT', () => {
    const received = SET_PAYMENT;
    const expected = '@@app/assembly/SET_PAYMENT';
    expect(received).toBe(expected);
  });

  it('should return string for SET_DISBURSEMENT', () => {
    const received = SET_DISBURSEMENT;
    const expected = '@@app/assembly/SET_DISBURSEMENT';
    expect(received).toBe(expected);
  });

  it('should return string for SET_DISBURSEMENT_PROPERTY', () => {
    const received = SET_DISBURSEMENT_PROPERTY;
    const expected = '@@app/assembly/SET_DISBURSEMENT_PROPERTY';
    expect(received).toBe(expected);
  });

  it('should return string for SET_PAYMENT_PROPERTY', () => {
    const received = SET_PAYMENT_PROPERTY;
    const expected = '@@app/assembly/SET_PAYMENT_PROPERTY';
    expect(received).toBe(expected);
  });

  it('should return string for UPDATE_STATE_DATA', () => {
    const received = UPDATE_STATE_DATA;
    const expected = '@@app/assembly/UPDATE_STATE_DATA';
    expect(received).toBe(expected);
  });
});
