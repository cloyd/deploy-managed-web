import { getNotifier, hasError, hasWarning } from '..';

describe('notifier/reducer', () => {
  describe('getNotifier', () => {
    it('should return the initialState', () => {
      const state = { notifier: 'notifier' };
      const received = getNotifier(state);
      const expected = 'notifier';
      expect(received).toEqual(expected);
    });
  });

  describe('hasError', () => {
    it('should return false when color is not ', () => {
      const state = { notifier: { isAlert: true, color: 'warning' } };
      const received = hasError(state);
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should return true when color is danger', () => {
      const state = { notifier: { isAlert: true, color: 'danger' } };
      const received = hasError(state);
      const expected = true;
      expect(received).toEqual(expected);
    });
  });

  describe('hasWarning', () => {
    it('should return false when color is not warning', () => {
      const state = { notifier: { isAlert: true, color: 'danger' } };
      const received = hasWarning(state);
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should return true', () => {
      const state = { notifier: { isAlert: true, color: 'warning' } };
      const received = hasWarning(state);
      const expected = true;
      expect(received).toEqual(expected);
    });
  });
});
