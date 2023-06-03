import {
  ATTACHED,
  ERROR,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  UPDATE_ALL,
  UPDATE_ALL_SUCCESS,
  UPDATE_TASK,
} from '../constants';

describe('attachment/constants', () => {
  it('should return string for ATTACHED', () => {
    const received = ATTACHED;
    const expected = '@@app/attachment/ATTACHED';
    expect(received).toBe(expected);
  });

  it('should return string for ERROR', () => {
    const received = ERROR;
    const expected = '@@app/attachment/ERROR';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_ALL', () => {
    const received = FETCH_ALL;
    const expected = '@@app/attachment/FETCH_ALL';
    expect(received).toBe(expected);
  });

  it('should return string for FETCH_ALL_SUCCESS', () => {
    const received = FETCH_ALL_SUCCESS;
    const expected = '@@app/attachment/FETCH_ALL_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for UPDATE_ALL', () => {
    const received = UPDATE_ALL;
    const expected = '@@app/attachment/UPDATE_ALL';
    expect(received).toBe(expected);
  });

  it('should return string for UPDATE_ALL_SUCCESS', () => {
    const received = UPDATE_ALL_SUCCESS;
    const expected = '@@app/attachment/UPDATE_ALL_SUCCESS';
    expect(received).toBe(expected);
  });

  it('should return string for UPDATE_TASK', () => {
    const received = UPDATE_TASK;
    const expected = '@@app/attachment/UPDATE_TASK';
    expect(received).toBe(expected);
  });
});
