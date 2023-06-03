import { acceptQuote, declineQuote, recommendTradie } from '../actions';

describe('marketplace/actions', () => {
  describe('acceptQuote', () => {
    it('should return the action', () => {
      const received = acceptQuote(1);
      const expected = {
        type: 'marketplace/updateQuote',
        payload: {
          quoteId: 1,
          status: 'accepted',
        },
      };

      expect(received).toEqual(expected);
    });
  });

  describe('declineQuote', () => {
    it('should return the action', () => {
      const received = declineQuote(1);
      const expected = {
        type: 'marketplace/updateQuote',
        payload: {
          quoteId: 1,
          status: 'declined',
        },
      };

      expect(received).toEqual(expected);
    });
  });

  describe('recommendTradie', () => {
    it('should return the action', () => {
      const received = recommendTradie({ quoteId: 1, comment: 'foo' });
      const expected = {
        type: 'marketplace/recommendTradie',
        payload: {
          quoteId: 1,
          comment: 'foo',
        },
      };

      expect(received).toEqual(expected);
    });
  });
});
