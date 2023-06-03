/* eslint-disable no-undef */
import reducer, { initialState } from '..';
import {
  ARCHIVE,
  ARCHIVE_SUCCESS,
  CREATE,
  DESTROY,
  DESTROY_SUCCESS,
  ERROR,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  FETCH_FEE_AUDITS,
  RESET_PROPERTY,
  RESET_RESULTS,
  SUCCESS,
  UPDATE,
  UPDATE_ATTACHMENTS,
} from '../constants';

describe('property/reducer', () => {
  it('should define the initialState', () => {
    const received = initialState;
    const expected = {
      data: {},
      financials: {},
      isLoading: false,
      result: null,
      results: [],
    };

    expect(received).toEqual(expected);
  });

  [CREATE, DESTROY, ARCHIVE, FETCH, UPDATE].map((type) => {
    it(`should handle ${type}`, () => {
      const state = {
        ...initialState,
        isLoading: false,
      };

      const received = reducer(state, { type });
      const expected = { ...state, isLoading: true };

      expect(received).toEqual(expected);
    });
  });

  it('should handle DESTROY_SUCCESS', () => {
    const state = {
      ...initialState,
      isLoading: true,
      data: { 1: 'a', 2: 'a' },
    };

    const received = reducer(state, {
      type: DESTROY_SUCCESS,
      payload: { id: 2 },
    });

    const expected = {
      ...state,
      isLoading: false,
      data: { 1: 'a' },
    };

    expect(received).toEqual(expected);
  });

  it('should handle ARCHIVE_SUCCESS', () => {
    const state = {
      ...initialState,
      isLoading: true,
      data: { 1: 'a', 2: 'b' },
    };

    const received = reducer(state, {
      type: ARCHIVE_SUCCESS,
      payload: { id: 2, isArchived: true },
    });

    const expected = {
      ...state,
      isLoading: false,
      data: {
        1: 'a',
        2: { 0: 'b', isArchived: true },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should handle ERROR', () => {
    const state = { ...initialState, isLoading: true, result: 1, results: [1] };
    const received = reducer(state, { type: ERROR });
    const expected = { ...state, isLoading: false, result: null, results: [] };

    expect(received).toEqual(expected);
  });

  it(`should handle FETCH_ALL`, () => {
    const state = {
      ...initialState,
      isLoading: false,
    };

    const received = reducer(state, { type: FETCH_ALL });
    const expected = { ...state, isLoading: true };

    expect(received).toEqual(expected);
  });

  it(`should handle FETCH_FEE_AUDITS`, () => {
    const state = {
      ...initialState,
      isLoading: false,
    };

    const received = reducer(state, { type: FETCH_FEE_AUDITS });
    const expected = { ...state, isLoading: true };

    expect(received).toEqual(expected);
  });

  it('should handle FETCH_ALL_SUCCESS', () => {
    const state = {
      ...initialState,
      isLoading: true,
      results: [1],
      data: { 1: { name: 'this should not be removed' } },
    };

    const payload = {
      result: [2, 3],
      data: { 2: { hello: 'world' }, 3: { foo: 'bar' } },
    };

    const received = reducer(state, {
      type: FETCH_ALL_SUCCESS,
      payload,
    });

    const expected = {
      ...state,
      isLoading: false,
      results: [2, 3],
      data: {
        1: { name: 'this should not be removed' },
        2: { hello: 'world' },
        3: { foo: 'bar' },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should handle RESET_RESULTS', () => {
    const state = {
      ...initialState,
      isLoading: true,
      result: 2,
      data: { 1: 'a', 2: 'b' },
    };

    const received = reducer(state, { type: RESET_RESULTS });

    const expected = {
      ...state,
      isLoading: false,
      result: null,
      data: { 1: 'a', 2: 'b' },
    };

    expect(received).toEqual(expected);
  });

  it('should handle SUCCESS', () => {
    const state = {
      ...initialState,
      isLoading: true,
      result: null,
      data: { 1: { name: 'this should not be removed' } },
    };

    const payload = {
      result: 2,
      data: { 2: { hello: 'world' } },
    };

    const received = reducer(state, {
      type: SUCCESS,
      payload,
    });

    const expected = {
      ...state,
      isLoading: false,
      result: 2,
      data: {
        1: { name: 'this should not be removed' },
        2: { hello: 'world' },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should handle UPDATE_ATTACHMENTS', () => {
    const property1 = { id: 1, title: 'title-1' };

    const state = {
      ...initialState,
      data: {
        1: {
          ...property1,
          attachments: [1, 2],
        },
      },
    };

    const received = reducer(state, {
      type: UPDATE_ATTACHMENTS,
      payload: {
        attachableId: 1,
        attachments: [1, 2, 3],
      },
    });

    const expected = {
      ...state,
      data: {
        ...state.data,
        1: {
          ...state.data[property1.id],
          attachments: [1, 2, 3],
        },
      },
    };

    expect(received).toEqual(expected);
  });
});

it('should handle RESET_PROPERTY', () => {
  const state = {
    ...initialState,
    isLoading: true,
    result: 2,
    data: { 1: 'a', 2: 'b' },
  };

  const received = reducer(state, { type: RESET_PROPERTY });

  const expected = {
    ...state,
    isLoading: false,
    result: null,
    data: { 1: 'a', 2: 'b' },
  };

  expect(received).toEqual(expected);
});
