import { formatError } from '../formatError';

describe('formatError', () => {
  it('should return empty string when error object is undefined', () => {
    const expected = '';
    const received = formatError();
    expect(received).toBe(expected);
  });

  it('should return formatted error when error object has both correct properties', () => {
    const expected = 'example message. Error(11223)';
    const received = formatError({
      response: { data: { message: 'example message.', code: '11223' } },
    });
    expect(received).toBe(expected);
  });

  it('should return formatted error when error object has only message', () => {
    const expected = 'example message.';
    const received = formatError({
      response: { data: { message: 'example message.' } },
    });
    expect(received).toBe(expected);
  });

  it('should return default message with error code when error object does not have message but has code', () => {
    const expected = 'default error message. Error(1221)';
    const received = formatError(
      { response: { data: { code: '1221' } } },
      'default error message.'
    );
    expect(received).toBe(expected);
  });

  it('should return default message when error object is undefined', () => {
    const expected = 'default error message.';
    const received = formatError(undefined, 'default error message');
    expect(received).toBe(expected);
  });

  it('should return default message when error object is null', () => {
    const expected = 'default error message.';
    const received = formatError(null, 'default error message');
    expect(received).toBe(expected);
  });
});
