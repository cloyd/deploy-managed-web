/* eslint-disable no-undef */
import {
  isActive,
  isCancelled,
  isDraft,
  isPendingActivate,
  isPendingClearance,
} from '../helpers';

describe('property/helpers', () => {
  describe('isActive', () => {
    it('should return true when active', () => {
      const received = isActive({ status: 'active' });
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should return false when not active', () => {
      const received = isActive({ status: 'fail' });
      const expected = false;
      expect(received).toEqual(expected);
    });
  });

  describe('isCancelled', () => {
    it('should return true when cancelled', () => {
      const received = isCancelled({ status: 'cancelled' });
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should return false when not cancelled', () => {
      const received = isCancelled({ status: 'fail' });
      const expected = false;
      expect(received).toEqual(expected);
    });
  });

  describe('isDraft', () => {
    it('should return true when draft', () => {
      const received = isDraft({ status: 'draft' });
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should return false when not draft', () => {
      const received = isDraft({ status: 'fail' });
      const expected = false;
      expect(received).toEqual(expected);
    });
  });

  describe('isPendingActivate', () => {
    it('should return true when pending_activate', () => {
      const received = isPendingActivate({ status: 'pending_activate' });
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should return false when not pending_activate', () => {
      const received = isPendingActivate({ status: 'fail' });
      const expected = false;
      expect(received).toEqual(expected);
    });
  });

  describe('isPendingClearance', () => {
    it('should return true when pending_clearance', () => {
      const received = isPendingClearance({ status: 'pending_clearance' });
      const expected = true;
      expect(received).toEqual(expected);
    });

    it('should return false when not pending_clearance', () => {
      const received = isPendingClearance({ status: 'fail' });
      const expected = false;
      expect(received).toEqual(expected);
    });
  });
});
