/* eslint-disable no-undef */
import {
  ADJUST_INTENTION,
  ADJUST_INTENTION_SUCCESS,
  ERROR,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  FETCH_SUCCESS,
  PAY_INTENTION,
  PAY_INTENTION_SUCCESS,
} from '../constants';

describe('intention/constants', () => {
  it('should return string for ADJUST_INTENTION', () => {
    const received = ADJUST_INTENTION;
    const expected = '@@app/intention/ADJUST_INTENTION';
    expect(received).toBe(expected);
  });

  it('should return string for ADJUST_INTENTION_SUCCESS', () => {
    const received = ADJUST_INTENTION_SUCCESS;
    const expected = '@@app/intention/ADJUST_INTENTION_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for ERROR', () => {
    const received = ERROR;
    const expected = '@@app/intention/ERROR';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH', () => {
    const received = FETCH;
    const expected = '@@app/intention/FETCH';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_SUCCESS', () => {
    const received = FETCH_SUCCESS;
    const expected = '@@app/intention/FETCH_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_ALL', () => {
    const received = FETCH_ALL;
    const expected = '@@app/intention/FETCH_ALL';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_ALL_SUCCESS', () => {
    const received = FETCH_ALL_SUCCESS;
    const expected = '@@app/intention/FETCH_ALL_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for PAY_INTENTION', () => {
    const received = PAY_INTENTION;
    const expected = '@@app/intention/PAY_INTENTION';
    expect(received).toBe(expected);
  });

  it('should return string for PAY_INTENTION_SUCCESS', () => {
    const received = PAY_INTENTION_SUCCESS;
    const expected = '@@app/intention/PAY_INTENTION_SUCCESS';
    expect(received).toBe(expected);
  });
});
