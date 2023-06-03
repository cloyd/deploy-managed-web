/* eslint-disable no-undef */
import { HTTP_ERRORS, translate } from '../i18n';

describe('translate', () => {
  it('should return default message when key does not exist in errors list and default message is provided', () => {
    const expected = 'Default message';
    const received = translate(
      HTTP_ERRORS,
      'Non existing key',
      'Default message'
    );

    expect(received).toEqual(expected);
  });

  it('should return key when key does not exist in errors list and no default message is provided', () => {
    const expected = 'Example key';
    const received = translate(HTTP_ERRORS, 'Example key');

    expect(received).toEqual(expected);
  });

  it('should return formatted message when key matches for invalid or expired token', () => {
    const expected =
      "Oops - there's a problem with that. If you're trying to log in, <a href='/'>click here.</a>";
    const received = translate(
      HTTP_ERRORS,
      'password_reset_token_invalid_or_expired'
    );

    expect(received).toEqual(expected);
  });
});
