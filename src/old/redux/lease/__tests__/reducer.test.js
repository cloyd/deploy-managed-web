/* eslint-disable no-undef */
import reducer, { initialState } from '..';
import {
  ACTIVATE,
  ADD_TENANT,
  DISBURSE,
  ERROR,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  FETCH_MODIFICATIONS,
  MODIFY_RENT,
  SUCCESS,
  UPDATE,
} from '../constants';

describe('lease/reducer', () => {
  describe('initialState', () => {
    it('should define the initialState', () => {
      const received = initialState;
      const expected = {
        isLoading: false,
        result: null,
        results: [],
        expired: {},
        leases: {},
        modifications: {},
        leaseItems: [],
        logs: [],
      };

      expect(received).toEqual(expected);
    });
  });

  [
    ACTIVATE,
    ADD_TENANT,
    DISBURSE,
    FETCH,
    FETCH_ALL,
    FETCH_MODIFICATIONS,
    MODIFY_RENT,
    UPDATE,
  ].map((type) => {
    describe(`${type}`, () => {
      it('should define isLoading as true', () => {
        const received = reducer(initialState, { type });
        const expected = { ...initialState, isLoading: true };
        expect(received).toEqual(expected);
      });
    });
  });

  describe('FETCH_ALL_SUCCESS', () => {
    it('should merge leases using id as the key', () => {
      const payload = {
        results: [2, 3],
        data: {
          2: { id: 2, title: 'Title 2' },
          3: { id: 3, title: 'Title 3' },
        },
      };

      const state = {
        ...initialState,
        isLoading: true,
        results: [1],
        leases: { 1: { id: 1, title: 'Title 1' } },
      };

      const received = reducer(state, { type: FETCH_ALL_SUCCESS, payload });
      const expected = {
        ...state,
        isLoading: false,
        results: [2, 3],
        leases: {
          1: { id: 1, title: 'Title 1' },
          2: { id: 2, title: 'Title 2' },
          3: { id: 3, title: 'Title 3' },
        },
      };

      expect(received).toEqual(expected);
    });
  });

  describe('SUCCESS', () => {
    it('should merge leases using id as the key', () => {
      const payload = { result: 2, data: { 2: { id: 2, title: 'Title 2' } } };
      const state = {
        ...initialState,
        isLoading: true,
        result: 1,
        leases: { 1: { id: 1, title: 'Title 1' } },
      };

      const received = reducer(state, { type: SUCCESS, payload });
      const expected = {
        ...state,
        isLoading: false,
        result: 2,
        leases: {
          1: { id: 1, title: 'Title 1' },
          2: { id: 2, title: 'Title 2' },
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
