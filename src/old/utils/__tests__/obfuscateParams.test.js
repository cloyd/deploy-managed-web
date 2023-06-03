/* eslint-disable no-undef */
import { obfuscateParams } from '../obfuscateParams';

describe('obfuscateParams', () => {
  it('should return empty object', () => {
    const received = obfuscateParams();
    const expected = {};
    expect(received).toEqual(expected);
  });

  it('should filter out cvv', () => {
    const received = obfuscateParams({
      hello: 1,
      cvv: 'FOO BAR',
      world: 2,
      foo: 3,
    });
    const expected = { hello: 1, world: 2, foo: 3 };
    expect(received).toEqual(expected);
  });

  describe('obfuscate account numbers', () => {
    it('should leave number unchanged', () => {
      const received = obfuscateParams({ accountNumber: 'XXXX678' });
      const expected = { accountNumber: 'XXXX678' };
      expect(received).toEqual(expected);
    });

    it('should format number', () => {
      const received = obfuscateParams({ accountNumber: '1234 5678' });
      const expected = { accountNumber: 'XXXXX678' };
      expect(received).toEqual(expected);
    });
  });

  describe('obfuscate routing numbers', () => {
    it('should leave number unchanged', () => {
      const received = obfuscateParams({ routingNumber: 'XXXXXX1' });
      const expected = { routingNumber: 'XXXXXX1' };
      expect(received).toEqual(expected);
    });

    it('should format number', () => {
      const received = obfuscateParams({ routingNumber: '1234 5678' });
      const expected = { routingNumber: 'XXXXXXX8' };
      expect(received).toEqual(expected);
    });
  });

  describe('obfuscate card numbers', () => {
    it('should leave number unchanged', () => {
      const received = obfuscateParams({ number: '4111-XXXX-XXXX-1111' });
      const expected = { number: '4111-XXXX-XXXX-1111' };
      expect(received).toEqual(expected);
    });

    it('should format visa number', () => {
      const received = obfuscateParams({ number: '4111 1111 1111 1111' });
      const expected = { number: '4111-XXXX-XXXX-1111' };
      expect(received).toEqual(expected);
    });

    it('should format mastercard number', () => {
      const received = obfuscateParams({ number: '5105105105105100' });
      const expected = { number: '5105XXXXXXXX5100' };
      expect(received).toEqual(expected);
    });
  });
});
