import { initialState } from '../reducer';
import {
  getJob,
  getJobs,
  getMarketplaceTags,
  getQuote,
  getQuotes,
  getQuotesByJobId,
  selectJob,
  selectMessagesForQuote,
  selectQuote,
  selectQuotesForJob,
} from '../selectors';

describe('marketplace/selectors', () => {
  const marketplace = {
    job: {
      data: {
        1: { id: 1, title: 'Job #1', tradieQuoteIds: [22] },
        2: { id: 2, title: 'Job #2', tradieQuoteIds: [11, 33] },
        3: { id: 3, title: 'Job #3' },
      },
      result: null,
      results: [2, 3],
    },
    meta: { tags: ['hello', 'world'] },
    quote: {
      data: {
        11: { id: 11, tradieJobId: 2, bidCents: 1111 },
        22: { id: 22, tradieJobId: 1, bidCents: 2222 },
        33: { id: 33, tradieJobId: 2, bidCents: 3333 },
      },
      result: null,
      results: [22, 33],
    },
    message: {
      data: {
        11: [
          { id: 1, action: 'bid' },
          { id: 2, action: 'send_message' },
        ],
      },
    },
  };

  let state;

  beforeEach(() => {
    state = { ...initialState, ...marketplace };
  });

  describe('getJob', () => {
    it('should return correct job', () => {
      const jobId = 2;
      const received = getJob(state, jobId);
      const expected = state.job.data[jobId];
      expect(received).toEqual(expected);
    });

    it('should return empty object if missing id', () => {
      const received = getJob(state);
      const expected = {};
      expect(received).toEqual(expected);
    });
  });

  describe('getJobs', () => {
    it('should return list of jobs', () => {
      const received = getJobs(state);
      const expected = [state.job.data[2], state.job.data[3]];
      expect(received).toEqual(expected);
    });

    it('should return empty array if job.results empty', () => {
      const received = getJobs({
        ...state,
        job: { ...state.job, results: [] },
      });
      const expected = [];
      expect(received).toEqual(expected);
    });
  });

  describe('getMarketplaceTags', () => {
    it('should return list of tags', () => {
      const received = getMarketplaceTags(state);
      const expected = ['hello', 'world'];
      expect(received).toEqual(expected);
    });
  });

  describe('getQuote', () => {
    it('should return correct quote', () => {
      const quoteId = 11;
      const received = getQuote(state, quoteId);
      const expected = state.quote.data[quoteId];
      expect(received).toEqual(expected);
    });

    it('should return empty object if missing id', () => {
      const received = getQuote(state);
      const expected = {};
      expect(received).toEqual(expected);
    });
  });

  describe('getQuotes', () => {
    it('should return list of quotes', () => {
      const received = getQuotes(state);
      const expected = [state.quote.data[22], state.quote.data[33]];
      expect(received).toEqual(expected);
    });

    it('should return empty array if quote.results empty', () => {
      const received = getQuotes({
        ...state,
        quote: { ...state.quote, results: [] },
      });
      const expected = [];
      expect(received).toEqual(expected);
    });
  });

  describe('getQuotesByJobId', () => {
    it('should return list of quotes', () => {
      const received = getQuotesByJobId(state, 2);
      const expected = [state.quote.data[11], state.quote.data[33]];
      expect(received).toEqual(expected);
    });

    it('should return empty array if job does not have tradieQuoteIds', () => {
      const received = getQuotesByJobId(state, 3);
      const expected = [];
      expect(received).toEqual(expected);
    });
  });

  describe('selectJob', () => {
    beforeEach(() => {
      state = { ...initialState, marketplace };
    });

    it('should return the job', () => {
      const received = selectJob(state, 1);
      const expected = marketplace.job.data[1];
      expect(received).toEqual(expected);
    });

    it('should return the job id is string', () => {
      const received = selectJob(state, '2');
      const expected = marketplace.job.data[2];
      expect(received).toEqual(expected);
    });

    it('should return undefined if job not found', () => {
      const received = selectJob(state, 4);
      expect(received).toBeUndefined();
    });
  });

  describe('selectQuote', () => {
    beforeEach(() => {
      state = { ...initialState, marketplace };
    });

    it('should return the quote', () => {
      const received = selectQuote(state, 11);
      const expected = marketplace.quote.data[11];
      expect(received).toEqual(expected);
    });

    it('should return the quote id is string', () => {
      const received = selectQuote(state, '22');
      const expected = marketplace.quote.data[22];
      expect(received).toEqual(expected);
    });

    it('should return undefined if quote not found', () => {
      const received = selectQuote(state, 44);
      expect(received).toBeUndefined();
    });
  });

  describe('selectQuotesForJob', () => {
    beforeEach(() => {
      state = { ...initialState, marketplace };
    });

    it('should return list of quotes', () => {
      const received = selectQuotesForJob(state, 1);
      const expected = [marketplace.quote.data[22]];
      expect(received).toEqual(expected);
    });

    it('should return list of quotes when key is string', () => {
      const received = selectQuotesForJob(state, '2');
      const expected = [marketplace.quote.data[11], marketplace.quote.data[33]];
      expect(received).toEqual(expected);
    });

    it('should return empty array if job does not have tradieQuoteIds', () => {
      const received = selectQuotesForJob(state, 3);
      const expected = [];
      expect(received).toEqual(expected);
    });
  });

  describe('selectMessagesForQuote', () => {
    beforeEach(() => {
      state = { ...initialState, marketplace };
    });

    it('should return list of messages', () => {
      const received = selectMessagesForQuote(state, 11);
      const expected = marketplace.message.data[11];
      expect(received).toEqual(expected);
    });

    it('should return list of message when key is string', () => {
      const received = selectMessagesForQuote(state, '11');
      const expected = marketplace.message.data[11];
      expect(received).toEqual(expected);
    });

    it('should return empty array when no messages', () => {
      const received = selectMessagesForQuote(state, 22);
      const expected = [];
      expect(received).toEqual(expected);
    });
  });
});
