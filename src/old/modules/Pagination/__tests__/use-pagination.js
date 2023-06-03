/* eslint-disable no-undef */
import { getPageNumbers } from '../use-pagination';

describe('getPageNumbers', () => {
  it('should return an empty array', () => {
    const expected = [];
    const received = getPageNumbers({});
    expect(received).toEqual(expected);
  });

  it('should return an array with pages is greater than totalPages', () => {
    const expected = [1];
    const received = getPageNumbers({
      currentPage: 208,
      maxPagesShown: 3,
      totalPages: 1,
    });
    expect(received).toEqual(expected);
  });

  it('should return an array with pages for odd maxPagesShown', () => {
    const expected = [4, 5, 6];
    const received = getPageNumbers({
      currentPage: 5,
      maxPagesShown: 3,
      totalPages: 10,
    });
    expect(received).toEqual(expected);
  });

  it('should return an array with first most pages for odd maxPagesShown', () => {
    const expected = [1, 2, 3, 4, 5];
    const received = getPageNumbers({
      currentPage: 1,
      maxPagesShown: 5,
      totalPages: 10,
    });
    expect(received).toEqual(expected);
  });

  it('should return an array with last most pages for odd maxPagesShown', () => {
    const expected = [6, 7, 8, 9, 10];
    const received = getPageNumbers({
      currentPage: 10,
      maxPagesShown: 5,
      totalPages: 10,
    });
    expect(received).toEqual(expected);
  });

  it('should return an array with pages for even maxPagesShown', () => {
    const expected = [2, 3];
    const received = getPageNumbers({
      currentPage: 3,
      maxPagesShown: 2,
      totalPages: 10,
    });
    expect(received).toEqual(expected);
  });

  it('should return an array with first most pages for even maxPagesShown', () => {
    const expected = [1, 2, 3, 4, 5, 6];
    const received = getPageNumbers({
      currentPage: 2,
      maxPagesShown: 6,
      totalPages: 10,
    });
    expect(received).toEqual(expected);
  });

  it('should return an array with last most pages for even maxPagesShown', () => {
    const expected = [5, 6, 7, 8, 9, 10];
    const received = getPageNumbers({
      currentPage: 8,
      maxPagesShown: 6,
      totalPages: 10,
    });
    expect(received).toEqual(expected);
  });
});
