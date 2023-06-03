/* eslint-disable no-undef */
import reducer, { initialState } from '..';
import { SET } from '../constants';

describe('pagination/reducer', () => {
  describe('initialState', () => {
    it('should define the initialState', () => {
      const received = initialState;
      const expected = { data: {} };
      expect(received).toEqual(expected);
    });
  });

  describe('SET', () => {
    it('should define isLoading as false', () => {
      const received = reducer(initialState, {
        type: SET,
        payload: {
          key: 'foo',
          data: 'bar',
        },
      });
      const expected = { ...initialState, data: { foo: 'bar' } };
      expect(received).toEqual(expected);
    });
  });
});
