import { formatPhoneNumber } from '../phoneNumber';

describe('formatPhoneNumber', () => {
  it('should return the same value if it does not exist', () => {
    expect(formatPhoneNumber(undefined)).toBe(undefined);
  });

  it('should remove any non-digit characters from the string', () => {
    expect(formatPhoneNumber('123-456-7890')).toBe('1234 567 890');
  });

  it('should format an international phone number correctly', () => {
    expect(formatPhoneNumber('+61 1234567')).toBe('+61 1234 567');
    expect(formatPhoneNumber('+61 1234567890')).toBe('+61 1234 567 890');
  });

  it('should format a non-international phone number correctly', () => {
    expect(formatPhoneNumber('1234')).toBe('1234');
    expect(formatPhoneNumber('1234567')).toBe('1234 567');
    expect(formatPhoneNumber('1234567890')).toBe('1234 567 890');
  });
});
