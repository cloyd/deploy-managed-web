/* eslint-disable no-undef */
import { PAYMENT_COMPLETE_STATUSES } from '../constants';
import { intentionStatusRansackParam } from '../helpers';

describe('intention/actions', () => {
  describe('intentionStatusRansackParam', () => {
    it('should return empty object when isComplete is undefined', () => {
      const received = intentionStatusRansackParam();
      const expected = {};
      expect(received).toEqual(expected);
    });

    it('should return q[statusIn] when true is passed as bool', () => {
      const received = intentionStatusRansackParam(true);
      const expected = { 'q[statusIn]': PAYMENT_COMPLETE_STATUSES };
      expect(received).toEqual(expected);
    });

    it('should return q[statusIn] when true is passed as string', () => {
      const received = intentionStatusRansackParam('true');
      const expected = { 'q[statusIn]': PAYMENT_COMPLETE_STATUSES };
      expect(received).toEqual(expected);
    });

    it('should return q[statusNotIn] when false is passed as bool', () => {
      const received = intentionStatusRansackParam(false);
      const expected = { 'q[statusNotIn]': PAYMENT_COMPLETE_STATUSES };
      expect(received).toEqual(expected);
    });

    it('should return q[statusNotIn] when false is passed as string', () => {
      const received = intentionStatusRansackParam('false');
      const expected = { 'q[statusNotIn]': PAYMENT_COMPLETE_STATUSES };
      expect(received).toEqual(expected);
    });
  });
});
