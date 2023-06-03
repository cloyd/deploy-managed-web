/* eslint-disable no-undef */
import { decoratePropertyKey } from '../decorators';

describe('property/decorators', () => {
  describe('decoratePropertyKey', () => {
    let key = { holder: 'tradie' };

    describe('valid holder', () => {
      it('should define a holder label', () => {
        const received = decoratePropertyKey(key);
        const expected = 'Tradie';

        expect(received.holderLabel).toEqual(expected);
      });
    });

    describe('invalid holder', () => {
      it('should be undefined', () => {
        const received = decoratePropertyKey({ holder: 'imInvalid' });
        expect(received.holderLabel).toBeUndefined();
      });
    });
  });
});
