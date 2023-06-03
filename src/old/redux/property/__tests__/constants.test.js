/* eslint-disable no-undef */
import {
  ARCHIVE,
  ARCHIVE_SUCCESS,
  CANCEL,
  CREATE,
  DESTROY,
  DESTROY_SUCCESS,
  ERROR,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  FETCH_FEE_AUDITS,
  FETCH_FEE_AUDITS_SUCCESS,
  REMOVE_OWNER,
  SUCCESS,
  UPDATE,
} from '../constants';

describe('assembly/constants', () => {
  it('should return string for CREATE', () => {
    const received = CREATE;
    const expected = '@@app/property/CREATE';
    expect(received).toBe(expected);
  });

  it('should return string for CANCEL', () => {
    const received = CANCEL;
    const expected = '@@app/property/CANCEL';
    expect(received).toBe(expected);
  });

  it('should return string for DESTROY', () => {
    const received = DESTROY;
    const expected = '@@app/property/DESTROY';
    expect(received).toBe(expected);
  });

  it('should return string for DESTROY_SUCCESS', () => {
    const received = DESTROY_SUCCESS;
    const expected = '@@app/property/DESTROY_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for ARCHIVE', () => {
    const received = ARCHIVE;
    const expected = '@@app/property/ARCHIVE';
    expect(received).toBe(expected);
  });

  it('should return string for ARCHIVE_SUCCESS', () => {
    const received = ARCHIVE_SUCCESS;
    const expected = '@@app/property/ARCHIVE_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for ERROR', () => {
    const received = ERROR;
    const expected = '@@app/property/ERROR';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH', () => {
    const received = FETCH;
    const expected = '@@app/property/FETCH';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_ALL', () => {
    const received = FETCH_ALL;
    const expected = '@@app/property/FETCH_ALL';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_ALL_SUCCESS', () => {
    const received = FETCH_ALL_SUCCESS;
    const expected = '@@app/property/FETCH_ALL_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for REMOVE_OWNER', () => {
    const received = REMOVE_OWNER;
    const expected = '@@app/property/REMOVE_OWNER';
    expect(received).toBe(expected);
  });

  it('should return string for SUCCESS', () => {
    const received = SUCCESS;
    const expected = '@@app/property/SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for UPDATE', () => {
    const received = UPDATE;
    const expected = '@@app/property/UPDATE';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_FEE_AUDITS', () => {
    const received = FETCH_FEE_AUDITS;
    const expected = '@@app/property/FETCH_FEE_AUDITS';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_FEE_AUDITS_SUCCESS', () => {
    const received = FETCH_FEE_AUDITS_SUCCESS;
    const expected = '@@app/property/FETCH_FEE_AUDITS_SUCCESS';
    expect(received).toBe(expected);
  });
});
