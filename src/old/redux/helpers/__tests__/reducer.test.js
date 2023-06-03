import { destroy, isLoading, reset, success } from '../reducer';

describe('redux/helpers/reducer', () => {
  let action;
  let state;

  describe('destroy', () => {
    beforeEach(() => {
      action = {
        payload: {
          id: 1,
        },
      };

      state = {
        isLoading: true,
        result: 1,
        data: {
          1: 'one',
          2: 'two',
        },
      };
    });

    it('should remove item keyed by id from data', () => {
      action = {
        payload: {
          foo: 1,
        },
      };

      destroy('foo')(state, action);

      const received = state.data;
      const expected = { 2: 'two' };

      expect(received).toEqual(expected);
    });

    it('should remove item keyed by value from data', () => {
      destroy()(state, action);

      const received = state.data;
      const expected = { 2: 'two' };

      expect(received).toEqual(expected);
    });

    it('should update state.isLoading to false', () => {
      destroy()(state, action);

      const received = state.isLoading;
      const expected = false;

      expect(received).toBe(expected);
    });

    it('should update state.result to null', () => {
      destroy()(state, action);

      const received = state.result;
      const expected = null;

      expect(received).toBe(expected);
    });

    it('should update state.result to null when existing result is null', () => {
      state = {
        isLoading: true,
        result: null,
        data: {
          1: 'one',
          2: 'two',
        },
      };

      destroy()(state, action);

      const received = state.result;
      const expected = null;

      expect(received).toBe(expected);
    });

    it('should not update state.result if result key is not present', () => {
      state = {
        isLoading: true,
        data: {
          1: 'one',
          2: 'two',
        },
      };

      destroy()(state, action);

      const received = state.result;
      const expected = undefined;

      expect(received).toBe(expected);
    });
  });

  describe('isLoading', () => {
    it('should update state.isLoading to true', () => {
      state = { isLoading: false };
      isLoading(true)(state);

      const received = state.isLoading;
      const expected = true;

      expect(received).toBe(expected);
    });

    it('should update state.isLoading to false', () => {
      state = { isLoading: true };
      isLoading(false)(state);

      const received = state.isLoading;
      const expected = false;

      expect(received).toBe(expected);
    });

    it('should update state.result to null', () => {
      state = { result: 1 };
      isLoading(true)(state);

      const received = state.result;
      const expected = null;

      expect(received).toBe(expected);
    });

    it('should not update state.result when result is not present', () => {
      state = { isLoading: false };
      isLoading(true)(state);

      const received = state.result;
      const expected = undefined;

      expect(received).toBe(expected);
    });
  });

  describe('reset', () => {
    it('should set state to the passed value', () => {
      state = { isLoading: true, data: { foo: 'bar' } };
      const initialState = { isLoading: true, data: {} };

      const received = reset(initialState)(state);
      const expected = initialState;

      expect(received).toBe(expected);
    });
  });

  describe('success', () => {
    const payload = {
      data: {
        2: 'two',
      },
    };

    beforeEach(() => {
      state = {
        isLoading: true,
        data: {
          1: 'one',
        },
      };
    });

    it('should update state.isLoading to false', () => {
      success()(state, { payload });

      const received = state.isLoading;
      const expected = false;

      expect(received).toBe(expected);
    });

    it('should update state.data', () => {
      success()(state, { payload });

      const received = state.data;
      const expected = { 1: 'one', 2: 'two' };

      expect(received).toEqual(expected);
    });
  });
});
