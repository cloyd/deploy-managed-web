import reducer, { initialState } from '..';
import {
  ATTACHED,
  ERROR,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  UPDATE_ALL,
  UPDATE_ALL_SUCCESS,
  UPDATE_TASK,
} from '../constants';

describe('attachment/reducer', () => {
  const attachment1 = { id: 1, filename: 'file-1' };
  const attachment2 = { id: 2, filename: 'file-2' };

  it('should define the initialState', () => {
    const received = initialState;
    const expected = {
      data: {},
      isLoading: false,
      result: null,
      results: [],
    };

    expect(received).toEqual(expected);
  });

  [FETCH_ALL_SUCCESS, UPDATE_ALL_SUCCESS].map((type) => {
    it(`should handle ${type}`, () => {
      const state = {
        ...initialState,
        isLoading: true,
      };

      const received = reducer(state, {
        type,
        payload: { data: { 1: attachment1, 2: attachment2 }, result: [1, 2] },
      });
      const expected = {
        ...state,
        isLoading: false,
        results: [1, 2],
        data: { 1: attachment1, 2: attachment2 },
      };

      expect(received).toEqual(expected);
    });
  });

  describe(`should handle FETCH_ALL`, () => {
    const state = {
      ...initialState,
      isLoading: false,
    };

    it(`should set isLoading to true`, () => {
      const received = reducer(state, { type: FETCH_ALL });
      const expected = { ...state, isLoading: true };

      expect(received).toEqual(expected);
    });

    it(`should set isLoading to false`, () => {
      const received = reducer(state, {
        type: FETCH_ALL,
        payload: { params: { isLoading: false } },
      });
      const expected = { ...state, isLoading: false };

      expect(received).toEqual(expected);
    });
  });

  it(`should handle UPDATE_ALL`, () => {
    const state = {
      ...initialState,
      isLoading: false,
    };

    const received = reducer(state, { type: UPDATE_ALL });
    const expected = { ...state, isLoading: true };

    expect(received).toEqual(expected);
  });

  it('should handle ATTACHED', () => {
    const state = {
      ...initialState,
      isLoading: true,
      result: 1,
      data: { 1: attachment1, 2: attachment2 },
    };

    const received = reducer(state, {
      type: ATTACHED,
      payload: { attachmentId: 2 },
    });

    const expected = {
      ...state,
      isLoading: false,
      result: 1,
      data: { 1: attachment1, 2: { ...attachment2, isAttached: true } },
    };

    expect(received).toEqual(expected);
  });

  it('should handle UPDATE_TASK', () => {
    const state = {
      ...initialState,
      isLoading: true,
      result: 1,
      data: { 1: attachment1 },
    };

    const received = reducer(state, {
      type: UPDATE_TASK,
      payload: { attachmentId: 1, propertyId: 23, taskId: 45 },
    });

    const expected = {
      ...state,
      isLoading: false,
      result: 1,
      data: { 1: { ...attachment1, propertyId: 23, taskId: 45 } },
    };

    expect(received).toEqual(expected);
  });

  it('should handle ERROR', () => {
    const state = { ...initialState, isLoading: true };
    const received = reducer(state, { type: ERROR });
    const expected = { ...state, isLoading: false };

    expect(received).toEqual(expected);
  });
});
