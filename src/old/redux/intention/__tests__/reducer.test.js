/* eslint-disable no-undef */
import reducer, { initialState } from '..';
import {
  ADJUST_INTENTION,
  ERROR,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  FETCH_SUCCESS,
  PAY_INTENTION,
} from '../constants';

describe('intention/reducer', () => {
  describe('initialState', () => {
    it('should define the initialState', () => {
      const received = initialState;
      const expected = {
        isLoading: false,
        completedLoading: false,
        data: {},
        intentionToDelete: 0,
        completed: {},
        payable: {},
        payableLoading: false,
        results: [],
      };

      expect(received).toEqual(expected);
    });
  });

  [ADJUST_INTENTION, FETCH, FETCH_ALL, PAY_INTENTION].map((type) => {
    describe(`${type}`, () => {
      it('should define isLoading as true', () => {
        const received = reducer(initialState, { type });
        const expected = { ...initialState, isLoading: true };
        expect(received).toEqual(expected);
      });
    });
  });

  [FETCH, FETCH_ALL].map((type) => {
    describe(`${type}`, () => {
      it('should define isLoading as true', () => {
        const received = reducer(initialState, { type });
        const expected = { ...initialState, isLoading: true };
        expect(received).toEqual(expected);
      });
    });
  });

  describe('FETCH_ALL_SUCCESS', () => {
    it('should merge intention data and set type', () => {
      const payload = {
        type: 'payable',
        data: { 5: 'intention5', 6: 'intention6' },
        results: { 2: [5, 6] },
      };

      const state = {
        ...initialState,
        isLoading: true,
        completed: {},
        data: {
          3: 'intention1',
          4: 'intention3',
        },
        payable: {
          1: [3, 4],
        },
      };

      const received = reducer(state, {
        type: FETCH_ALL_SUCCESS,
        payload,
      });

      const expected = {
        ...state,
        isLoading: false,
        isDeleting: false,
        completed: {},
        data: {
          3: 'intention1',
          4: 'intention3',
          5: 'intention5',
          6: 'intention6',
        },
        payable: {
          2: [5, 6],
        },
      };

      expect(received).toEqual(expected);
    });
  });

  describe('FETCH_SUCCESS', () => {
    it('should merge intention data', () => {
      const payload = {
        data: { 2: 'intention3' },
      };

      const state = {
        ...initialState,
        isLoading: true,
        data: {
          1: 'intention1',
          2: 'intention2',
        },
        payable: {
          1: [1, 2],
        },
      };

      const received = reducer(state, {
        type: FETCH_SUCCESS,
        payload,
      });

      const expected = {
        ...state,
        isLoading: false,
        data: {
          1: 'intention1',
          2: 'intention3',
        },
        payable: {
          1: [1, 2],
        },
      };

      expect(received).toEqual(expected);
    });
  });

  describe('ERROR', () => {
    it('should define isLoading as false', () => {
      const received = reducer(
        { ...initialState, isLoading: true },
        { type: ERROR }
      );
      const expected = { ...initialState, isLoading: false };
      expect(received).toEqual(expected);
    });
  });
});
