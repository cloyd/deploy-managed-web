/* eslint-disable no-undef */
import { USER_TYPES } from '../../users/constants';
import {
  getTask,
  getTasks,
  isSearchableCreditor,
  parseCreditorType,
} from '../selectors';

describe('task/selectors', () => {
  let state;

  beforeEach(() => {
    state = {
      result: null,
      results: [],
      data: {
        1: { id: 1, title: 'task-1' },
        2: { id: 2, title: 'task-2' },
      },
    };
  });

  describe('getTask', () => {
    it('should return an empty object by default', () => {
      const received = getTask(state, undefined);
      const expected = {};
      expect(received).toEqual(expected);
    });

    it('should return task by id', () => {
      const received = getTask(state, 2);
      const expected = state.data[2];
      expect(received).toEqual(expected);
    });
  });

  describe('getTasks', () => {
    it('should return an empty array by default', () => {
      const received = getTasks(state);
      const expected = [];
      expect(received).toEqual(expected);
    });

    it('should return tasks based on result', () => {
      const received = getTasks({ ...state, results: [2, 1] });
      const expected = [state.data[2], state.data[1]];
      expect(received).toEqual(expected);
    });

    it('should return tasks sorted by rentOverdueDays if type is arrears', () => {
      const received = getTasks({ ...state, results: [1, 2] }, 'arrears');
      const expected = [state.data[1], state.data[2]];
      expect(received).toEqual(expected);
    });
  });

  describe('isSearchableCreditor', () => {
    it('should return false by default', () => {
      const received = isSearchableCreditor();
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should return true if ExternalCreditor', () => {
      const received = isSearchableCreditor('ExternalCreditor');
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should return true if BpayBiller and BpayBiller as Creditor is allowed', () => {
      const received = isSearchableCreditor('BpayBiller', true);
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should return false if BpayBiller and BpayBiller as Creditor is not allowed', () => {
      const received = isSearchableCreditor('BpayBiller');
      const expected = false;
      expect(received).toEqual(expected);
    });
  });

  describe('parseCreditorType', () => {
    it('should return input by default', () => {
      const received = parseCreditorType('hello');
      const expected = 'hello';
      expect(received).toEqual(expected);
    });

    it('should return creditor if ExternalCreditor', () => {
      const received = parseCreditorType('ExternalCreditor');
      const expected = USER_TYPES.externalCreditor;
      expect(received).toEqual(expected);
    });
  });
});
