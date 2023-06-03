/* eslint-disable no-undef */
import { fullName } from '../fullName';

describe('fullName', () => {
  it('should return empty string when firstName & lastName is undefined', () => {
    const expected = '';
    const received = fullName();
    expect(received).toBe(expected);
  });

  it('should return firstName when lastName is undefined', () => {
    const expected = 'Joe';
    const received = fullName({ firstName: 'Joe' });
    expect(received).toBe(expected);
  });

  it('should return lastName when firstName is undefined', () => {
    const expected = 'Blogs';
    const received = fullName({ lastName: 'Blogs' });
    expect(received).toBe(expected);
  });

  it('should return firstName & lastName joined', () => {
    const expected = 'Joe Blogs';
    const received = fullName({ firstName: 'Joe', lastName: 'Blogs' });
    expect(received).toBe(expected);
  });
});
