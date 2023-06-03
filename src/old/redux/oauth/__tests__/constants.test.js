import {
  AUTHORIZE_APP,
  AUTHORIZE_APP_SUCCESS,
  ERROR,
  FETCH_APP,
  FETCH_APP_ERROR,
  FETCH_APP_SUCCESS,
} from '../constants';

describe('profile/constants', () => {
  it('should return string for FETCH_APP', () => {
    const received = FETCH_APP;
    const expected = '@@app/oauth/FETCH_APP';
    expect(received).toBe(expected);
  });
  it('should return string for FETCH_APP_SUCCESS', () => {
    const received = FETCH_APP_SUCCESS;
    const expected = '@@app/oauth/FETCH_APP_SUCCESS';
    expect(received).toBe(expected);
  });
  it('should return string for FETCH_APP_ERROR', () => {
    const received = FETCH_APP_ERROR;
    const expected = '@@app/oauth/FETCH_APP_ERROR';
    expect(received).toBe(expected);
  });
  it('should return string for AUTHORIZE_APP', () => {
    const received = AUTHORIZE_APP;
    const expected = '@@app/oauth/AUTHORIZE_APP';
    expect(received).toBe(expected);
  });
  it('should return string for AUTHORIZE_APP_SUCCESS', () => {
    const received = AUTHORIZE_APP_SUCCESS;
    const expected = '@@app/oauth/AUTHORIZE_APP_SUCCESS';
    expect(received).toBe(expected);
  });
  it('should return string for ERROR', () => {
    const received = ERROR;
    const expected = '@@app/oauth/ERROR';
    expect(received).toBe(expected);
  });
});
