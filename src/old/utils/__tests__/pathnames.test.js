/* eslint-disable no-undef */
import { pathnameBack } from '../pathnames';

describe('pathnameBack', () => {
  it('should return undefined', () => {
    const received = pathnameBack();
    const expected = undefined;
    expect(received).toEqual(expected);
  });

  it('should return empty string', () => {
    const received = pathnameBack('');
    const expected = '';
    expect(received).toEqual(expected);
  });

  it('should return pathname', () => {
    const received = pathnameBack('/test/area/1/item/5');
    const expected = '/test/area/1';
    expect(received).toEqual(expected);
  });

  it('should return pathname when ending with /', () => {
    const received = pathnameBack('/test/area/1/item/');
    const expected = '/test/area/1';
    expect(received).toEqual(expected);
  });
});
