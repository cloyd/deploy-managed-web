/* eslint-disable no-undef */
import { filterEmptyValues } from '../filterEmptyValues';

describe('filterEmptyValues', () => {
  it('should return empty object', () => {
    const expected = {};
    const received = filterEmptyValues({ foo: null, bar: undefined });
    expect(received).toEqual(expected);
  });

  it('should return object with empty values filtered', () => {
    const expected = { bar: 'hello' };
    const received = filterEmptyValues({ foo: null, bar: 'hello' });
    expect(received).toEqual(expected);
  });

  it('should return object unfiltered', () => {
    const expected = { foo: 123, bar: 'hello' };
    const received = filterEmptyValues({ foo: 123, bar: 'hello' });
    expect(received).toEqual(expected);
  });
});
