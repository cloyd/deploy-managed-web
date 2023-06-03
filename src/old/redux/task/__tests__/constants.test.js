/* eslint-disable no-undef */
import {
  ARCHIVE,
  ARCHIVE_SUCCESS,
  CANCEL,
  CREATE,
  CREATE_MESSAGE,
  CREATE_QUOTE,
  CREATE_SUCCESS,
  DESTROY,
  DESTROY_SUCCESS,
  ERROR,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_PROPERTY,
  FETCH_MESSAGES,
  FETCH_MESSAGES_SUCCESS,
  SUCCESS,
  UPDATE,
  UPDATE_ATTACHMENTS,
  UPDATE_SUCCESS,
} from '../constants';

describe('task/constants', () => {
  it('should return string for CANCEL', () => {
    const received = CANCEL;
    const expected = '@@app/task/CANCEL';
    expect(received).toBe(expected);
  });

  it('should return string for CREATE', () => {
    const received = CREATE;
    const expected = '@@app/task/CREATE';
    expect(received).toBe(expected);
  });

  it('should return string for CREATE_MESSAGE', () => {
    const received = CREATE_MESSAGE;
    const expected = '@@app/task/CREATE_MESSAGE';
    expect(received).toBe(expected);
  });

  it('should return string for CREATE_QUOTE', () => {
    const received = CREATE_QUOTE;
    const expected = '@@app/task/CREATE_QUOTE';
    expect(received).toBe(expected);
  });

  it('should return string for CREATE_SUCCESS', () => {
    const received = CREATE_SUCCESS;
    const expected = '@@app/task/CREATE_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for DESTROY', () => {
    const received = DESTROY;
    const expected = '@@app/task/DESTROY';
    expect(received).toBe(expected);
  });

  it('should return string for ARCHIVE', () => {
    const received = ARCHIVE;
    const expected = '@@app/task/ARCHIVE';
    expect(received).toBe(expected);
  });

  it('should return string for DESTROY_SUCCESS', () => {
    const received = DESTROY_SUCCESS;
    const expected = '@@app/task/DESTROY_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for ARCHIVE_SUCCESS', () => {
    const received = ARCHIVE_SUCCESS;
    const expected = '@@app/task/ARCHIVE_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for ERROR', () => {
    const received = ERROR;
    const expected = '@@app/task/ERROR';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH', () => {
    const received = FETCH;
    const expected = '@@app/task/FETCH';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_ALL', () => {
    const received = FETCH_ALL;
    const expected = '@@app/task/FETCH_ALL';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_ALL_PROPERTY', () => {
    const received = FETCH_ALL_PROPERTY;
    const expected = '@@app/task/FETCH_ALL_PROPERTY';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_MESSAGES', () => {
    const received = FETCH_MESSAGES;
    const expected = '@@app/task/FETCH_MESSAGES';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_MESSAGES_SUCCESS', () => {
    const received = FETCH_MESSAGES_SUCCESS;
    const expected = '@@app/task/FETCH_MESSAGES_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for SUCCESS', () => {
    const received = SUCCESS;
    const expected = '@@app/task/SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for UPDATE', () => {
    const received = UPDATE;
    const expected = '@@app/task/UPDATE';
    expect(received).toBe(expected);
  });

  it('should return string for UPDATE_SUCCESS', () => {
    const received = UPDATE_SUCCESS;
    const expected = '@@app/task/UPDATE_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for UPDATE_ATTACHMENTS', () => {
    const received = UPDATE_ATTACHMENTS;
    const expected = '@@app/task/UPDATE_ATTACHMENTS';
    expect(received).toBe(expected);
  });
});
