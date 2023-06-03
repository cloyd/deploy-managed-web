/* eslint-disable no-undef */
import { calculateAami } from '../utils';

describe('calculateAami', () => {
  it('should return the correct aami value when fee is 5.9%', () => {
    const expected = 153821.42857142858;
    const received = calculateAami(50000, 590);
    expect(received).toBe(expected);
  });

  it('should return the aami value when fee is 2.59%', () => {
    const expected = 2971.1;
    const received = calculateAami(2200, 259);
    expect(received).toBe(expected);
  });
});
