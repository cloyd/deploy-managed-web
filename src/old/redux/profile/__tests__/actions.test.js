/* eslint-disable no-undef */
import {
  confirmPassword,
  disableAuthy,
  fetchProfile,
  loginUser,
  logoutUser,
  markOnboarded,
  resetPassword,
} from '..';
import {
  CONFIRM,
  DISABLE_AUTHY,
  FETCH,
  LOGIN,
  LOGOUT,
  ONBOARDED,
  RESET,
} from '../constants';

describe('profile/actions', () => {
  it('should return action for confirmPassword', () => {
    const payload = {
      password: 'passwordpassword',
      passwordConfirmation: 'passwordConfirmation',
      resetPasswordToken: 'resetPasswordToken',
    };

    const received = confirmPassword({ ...payload, a: 'b' });
    const expected = { type: CONFIRM, payload };

    expect(received).toEqual(expected);
  });

  it('should return action for markOnboarded', () => {
    const received = markOnboarded();
    const expected = { type: ONBOARDED };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchProfile', () => {
    const received = fetchProfile();
    const expected = { type: FETCH };

    expect(received).toEqual(expected);
  });

  it('should return action for loginUser', () => {
    const payload = { email: 'email', password: 'passwordpassword' };
    const received = loginUser({ ...payload, a: 'b' });
    const expected = { type: LOGIN, payload };

    expect(received).toEqual(expected);
  });

  it('should return action for logoutUser', () => {
    const payload = { isIdleTimeout: false, message: '', isForced: false };
    const received = logoutUser();
    const expected = { type: LOGOUT, payload };

    expect(received).toEqual(expected);
  });

  it('should return action for resetPassword', () => {
    const payload = { email: 'email' };
    const received = resetPassword({ ...payload, a: 'b' });
    const expected = { type: RESET, payload };

    expect(received).toEqual(expected);
  });

  it('should return action for disableAuthy', () => {
    const received = disableAuthy({ authyToken: 'token' });
    const expected = {
      type: DISABLE_AUTHY,
      payload: { authyToken: 'token' },
    };

    expect(received).toEqual(expected);
  });
});
