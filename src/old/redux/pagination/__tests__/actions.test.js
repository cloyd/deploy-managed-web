/* eslint-disable no-undef */
import { setPagination } from '../actions';
import { SET } from '../constants';

describe('pagination/actions', () => {
  it('should return action for setPagination', () => {
    const received = setPagination({ key: 'key', page: 1, totalPages: 2 });
    const expected = {
      type: SET,
      payload: { key: 'key', data: { page: 1, totalPages: 2 } },
    };

    expect(received).toEqual(expected);
  });
});
