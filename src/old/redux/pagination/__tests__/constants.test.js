/* eslint-disable no-undef */
import { SET } from '../constants';

describe('pagination/constants', () => {
  it('should return string for SET', () => {
    const received = SET;
    const expected = '@@app/pagination/SET';
    expect(received).toBe(expected);
  });
});
