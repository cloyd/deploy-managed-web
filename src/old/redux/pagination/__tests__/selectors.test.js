/* eslint-disable no-undef */
import { getPagination } from '..';

describe('pagination/selectors', () => {
  describe('getPagination', () => {
    it('should return pagination for the passed key', () => {
      const state = { data: { foo: 'bar' } };
      const received = getPagination(state, 'foo');
      const expected = 'bar';
      expect(received).toEqual(expected);
    });
  });
});
