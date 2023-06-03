/* eslint-disable no-undef */
import {
  replaceSearchParams,
  toQueryObject,
  toQueryString,
} from '../queryParams';

describe('toQueryObject', () => {
  it('should return the search params', () => {
    const expected = { a: 'a', b: 'b' };
    const received = toQueryObject('?a=a&b=b');
    expect(received).toEqual(expected);
  });

  it('should return the search params with camelized keys', () => {
    const expected = { aB: 'ab', cD: 'cd' };
    const received = toQueryObject('?a_b=ab&c_d=cd');
    expect(received).toEqual(expected);
  });

  it('should filter out empty params', () => {
    const expected = { a: 'a', c: 'c' };
    const received = toQueryObject('?a=a&b=&c=c');
    expect(received).toEqual(expected);
  });
});

describe('toQueryString', () => {
  it('should return the params object as string', () => {
    const expected = '?a=b&c=d';
    const received = toQueryString({
      a: 'b',
      c: 'd',
    });

    expect(received).toEqual(expected);
  });

  it('should return the params object as string with decamlized keys', () => {
    const expected = '?a_b=ab&c_d=cd';
    const received = toQueryString({
      aB: 'ab',
      cD: 'cd',
    });

    expect(received).toEqual(expected);
  });
});

describe('replaceSearchParams', () => {
  it('should return an empty string', () => {
    const expected = '';
    const received = replaceSearchParams({});
    expect(received).toBe(expected);
  });

  it('should return an unchanged path', () => {
    const expected = 'some/path?hello=world';
    const received = replaceSearchParams({
      pathname: 'some/path',
      search: '?hello=world',
    });
    expect(received).toBe(expected);
  });

  it('should return path with new params', () => {
    const params = { foo: 'bar', a: 1 };
    const expected = 'some/path?a=1&foo=bar';
    const received = replaceSearchParams({
      params,
      pathname: 'some/path',
    });
    expect(received).toBe(expected);
  });

  it('should return path with new params added on', () => {
    const params = { foo: 'bar', a: 1 };
    const expected = 'some/path?a=1&foo=bar&hello=world';
    const received = replaceSearchParams({
      params,
      pathname: 'some/path',
      search: '?hello=world',
    });
    expect(received).toBe(expected);
  });

  it('should return path with updated param', () => {
    const params = { foo: 'bar', hello: 123 };
    const expected = 'some/path?foo=bar&hello=123';
    const received = replaceSearchParams({
      params,
      pathname: 'some/path',
      search: '?hello=world',
    });
    expect(received).toBe(expected);
  });
});
