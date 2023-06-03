/* eslint-disable no-undef */
import {
  CONFIRM,
  ERROR,
  FETCH,
  FETCH_SUCCESS,
  LOGIN,
  LOGIN_SUCCESS,
  LOGOUT,
  ONBOARDED,
  ONBOARDED_SUCCESS,
  RESET,
  RESET_SUCCESS,
  SUCCESS,
} from '../constants';

describe('profile/constants', () => {
  it('should return string for CONFIRM', () => {
    const received = CONFIRM;
    const expected = '@@app/profile/CONFIRM';
    expect(received).toBe(expected);
  });

  it('should return string for ONBOARDED', () => {
    const received = ONBOARDED;
    const expected = '@@app/profile/ONBOARDED';
    expect(received).toBe(expected);
  });

  it('should return string for ONBOARDED_SUCCESS', () => {
    const received = ONBOARDED_SUCCESS;
    const expected = '@@app/profile/ONBOARDED_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for ERROR', () => {
    const received = ERROR;
    const expected = '@@app/profile/ERROR';
    expect(received).toBe(expected);
  });

  it('should return string for LOGIN', () => {
    const received = LOGIN;
    const expected = '@@app/profile/LOGIN';
    expect(received).toBe(expected);
  });

  it('should return string for LOGOUT', () => {
    const received = LOGOUT;
    const expected = '@@app/profile/LOGOUT';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH', () => {
    const received = FETCH;
    const expected = '@@app/profile/FETCH';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_SUCCESS', () => {
    const received = FETCH_SUCCESS;
    const expected = '@@app/profile/FETCH_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for RESET', () => {
    const received = RESET;
    const expected = '@@app/profile/RESET';
    expect(received).toBe(expected);
  });

  it('should return string for RESET_SUCCESS', () => {
    const received = RESET_SUCCESS;
    const expected = '@@app/profile/RESET_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for SUCCESS', () => {
    const received = SUCCESS;
    const expected = '@@app/profile/SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for LOGIN_SUCCESS', () => {
    const received = LOGIN_SUCCESS;
    const expected = '@@app/profile/LOGIN_SUCCESS';
    expect(received).toBe(expected);
  });
});
