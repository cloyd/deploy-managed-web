/* eslint-disable no-undef */
import { getProperties, getProperty } from '..';

describe('property/selectors', () => {
  it('should select getProperty', () => {
    const received = getProperty({ data: { 1: 'property' } }, 1);
    const expected = 'property';

    expect(received).toEqual(expected);
  });

  describe('getProperties', () => {
    const data = {
      1: 'Property 1',
      2: 'Property 2',
    };

    it('should return an empty array by default', () => {
      const received = getProperties({});
      const expected = [];

      expect(received).toEqual(expected);
    });

    it('should return an array of properties', () => {
      const received = getProperties({ results: [1, 2], data });
      const expected = ['Property 1', 'Property 2'];

      expect(received).toEqual(expected);
    });
  });
});
