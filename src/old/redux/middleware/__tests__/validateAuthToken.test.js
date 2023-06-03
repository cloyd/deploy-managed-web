/* eslint-disable no-undef */
import localStorage from 'store';

import { validateAuthToken } from '../';

describe('middleware/validateAuthToken', () => {
  let store;
  let next;
  const authToken = 'test-token';

  beforeEach(() => {
    store = {
      getState: () => ({ profile: { authToken } }),
    };
    next = jest.fn();
    localStorage.get = jest.fn().mockReturnValue(authToken);
    window.location.replace = jest.fn();
  });

  describe('when store actions do not require validation', () => {
    [
      'notifier/showAlert',
      '@@app/user/LOGIN',
      '@@app/task/FETCH_ALL_SUCCESS',
      '@@app/pagination/SET',
    ].map((type) => {
      it(`should call next() when action type is ${type}`, () => {
        const action = { type };

        validateAuthToken(store)(next)(action);
        expect(next).toHaveBeenCalledWith(action);
      });
    });
  });

  describe('when store actions require validation', () => {
    it('should not call window.location.replace if localStorage authToken matches store authToken', () => {
      const action = { type: '@@app/task/FETCH_ALL' };

      validateAuthToken(store)(next)(action);
      expect(window.location.replace).not.toHaveBeenCalled();
    });

    it('should call window.location.replace if localStorage authToken does not match store authToken', () => {
      const action = { type: '@@app/task/FETCH_ALL' };
      const invalidTokenStore = {
        getState: () => ({ profile: { authToken: 'invalid-token' } }),
      };

      validateAuthToken(invalidTokenStore)(next)(action);
      expect(window.location.replace).toHaveBeenCalledWith('/');
    });
  });
});
