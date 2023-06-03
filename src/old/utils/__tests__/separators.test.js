/* eslint-disable no-undef */
import { addSeparators, removeSeparators } from '../separators';

describe('addSeparators', () => {
  it('should add a separator at position 1', () => {
    const expected = '1-';
    const received = addSeparators({
      prevValue: '',
      value: '1',
      gaps: [1],
      separator: '-',
    });

    expect(received).toBe(expected);
  });

  it('should handle multipe seperators', () => {
    const expected = '1111-1111-';
    const received = addSeparators({
      prevValue: '1111-111',
      value: '1111-1111',
      gaps: [4, 8],
      separator: '-',
    });

    expect(received).toBe(expected);
  });

  it('should handle spaces seperators', () => {
    const expected = '1111 1111 ';
    const received = addSeparators({
      prevValue: '1111 111',
      value: '1111 1111',
      gaps: [4, 8],
      separator: ' ',
    });

    expect(received).toBe(expected);
  });

  it('should return false if the values have not changed', () => {
    const expected = false;
    const received = addSeparators({
      prevValue: '1',
      value: '1',
      gaps: [1],
      separator: '-',
    });

    expect(received).toBe(expected);
  });

  it('should return false if gaps is null', () => {
    const expected = false;
    const received = addSeparators({
      prevValue: '',
      value: '1',
      gaps: null,
      separator: '-',
    });

    expect(received).toBe(expected);
  });

  it('should return false if gaps is undefined', () => {
    const expected = false;
    const received = addSeparators({
      prevValue: '',
      value: '1',
      gaps: undefined,
      separator: '-',
    });

    expect(received).toBe(expected);
  });
});

describe('removeSeparators', () => {
  it('should remove the separator from a string', () => {
    const expected = '11111111';
    const received = removeSeparators('11-11-11-11', '-');
    expect(received).toBe(expected);
  });
});
