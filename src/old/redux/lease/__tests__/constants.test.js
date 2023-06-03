/* eslint-disable no-undef */
import {
  ACTIVATE,
  ADD_TENANT,
  CANCEL,
  DISBURSE,
  ERROR,
  FETCH,
  FETCH_ALL,
  FETCH_MODIFICATIONS,
  FETCH_MODIFICATIONS_SUCCESS,
  MODIFY_RENT,
  MODIFY_RENT_SUCCESS,
  SUCCESS,
  UPDATE,
} from '../constants';

describe('lease/constants', () => {
  it('should return string for ACTIVATE', () => {
    const received = ACTIVATE;
    const expected = '@@app/lease/ACTIVATE';
    expect(received).toBe(expected);
  });

  it('should return string for ADD_TENANT', () => {
    const received = ADD_TENANT;
    const expected = '@@app/lease/ADD_TENANT';
    expect(received).toBe(expected);
  });

  it('should return string for CANCEL', () => {
    const received = CANCEL;
    const expected = '@@app/lease/CANCEL';
    expect(received).toBe(expected);
  });

  it('should return string for DISBURSE', () => {
    const received = DISBURSE;
    const expected = '@@app/lease/DISBURSE';
    expect(received).toBe(expected);
  });

  it('should return string for ERROR', () => {
    const received = ERROR;
    const expected = '@@app/lease/ERROR';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH', () => {
    const received = FETCH;
    const expected = '@@app/lease/FETCH';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_ALL', () => {
    const received = FETCH_ALL;
    const expected = '@@app/lease/FETCH_ALL';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_MODIFICATIONS', () => {
    const received = FETCH_MODIFICATIONS;
    const expected = '@@app/lease/FETCH_MODIFICATIONS';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_MODIFICATIONS_SUCCESS', () => {
    const received = FETCH_MODIFICATIONS_SUCCESS;
    const expected = '@@app/lease/FETCH_MODIFICATIONS_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for MODIFY_RENT', () => {
    const received = MODIFY_RENT;
    const expected = '@@app/lease/MODIFY_RENT';
    expect(received).toBe(expected);
  });

  it('should return string for MODIFY_RENT_SUCCESS', () => {
    const received = MODIFY_RENT_SUCCESS;
    const expected = '@@app/lease/MODIFY_RENT_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for SUCCESS', () => {
    const received = SUCCESS;
    const expected = '@@app/lease/SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for UPDATE', () => {
    const received = UPDATE;
    const expected = '@@app/lease/UPDATE';
    expect(received).toBe(expected);
  });
});
