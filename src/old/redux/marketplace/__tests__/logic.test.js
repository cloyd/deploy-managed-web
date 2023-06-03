import reducer, { marketplaceLogic as logic } from '..';
import { mockHttpClient, mockReduxLogic } from '../../__mocks__';
import { JOB_TYPE } from '../constants';
import marketplace, { initialState } from '../reducer';

const {
  cancelJob,
  cancelJobSuccess,
  createJob,
  createJobSuccess,
  createQuote,
  createQuoteSuccess,
  error,
  fetchJob,
  fetchJobSuccess,
  fetchMeta,
  fetchMetaSuccess,
  fetchQuote,
  fetchQuoteSuccess,
  recommendTradie,
  requestReview,
  revertQuote,
  success,
  updateJob,
  updateJobSuccess,
  updateQuote,
  updateQuoteSuccess,
} = marketplace.actions;

describe('marketplace/logic', () => {
  let params;
  let request;
  let response;
  let store;

  const requestError = () =>
    error(new Error('Request failed with status code 500'));

  beforeEach(() => {
    store = mockReduxLogic({ initialState, logic, reducer });
  });

  describe('cancelJob', () => {
    beforeEach(() => {
      params = { jobId: 11 };
      request = mockHttpClient.onDelete('/tradie-jobs/11');
      response = '';
    });

    it('handles success', (done) => {
      store.dispatch(cancelJob(params));
      request.reply(200, response);
      store.whenComplete(() => {
        const received = store.actions;
        const expected = cancelJobSuccess({
          props: {
            isRedirect: true,
            jobId: 11,
            message: 'job is cancelled',
          },
          data: '',
        });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('handles error', (done) => {
      store.dispatch(cancelJob(params));
      request.reply(500, '');
      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('createJob', () => {
    describe('when creating a job quote request', () => {
      beforeEach(() => {
        params = {
          jobType: JOB_TYPE.quote,
          title: 'Clean windows',
          budgetCents: 12300,
          propertyTaskId: 911,
        };
        request = mockHttpClient.onPost('/tradie-jobs');
        response = {
          id: 11,
          title: 'Clean windows',
          budgetCents: 12300,
          propertyTaskId: 911,
        };
      });

      it('should handle success', (done) => {
        store.dispatch(createJob(params));
        request.reply(200, response);
        store.whenComplete(() => {
          const received = store.actions;
          const expected = createJobSuccess({
            data: response,
            props: { message: 'job has been created.' },
          });
          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should handle error', (done) => {
        store.dispatch(createJob(params));
        request.reply(500, {});
        store.whenComplete(() => {
          const received = store.actions;
          const expected = requestError();
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });

    describe('when creating a job work order', () => {
      beforeEach(() => {
        params = {
          jobType: JOB_TYPE.workOrder,
          title: 'Clean windows',
          budgetCents: 12300,
          propertyTaskId: 911,
        };
        request = mockHttpClient.onPost('/tradie-jobs/work-orders');
        response = {
          id: 11,
          title: 'Clean windows',
          budgetCents: 12300,
          propertyTaskId: 911,
        };
      });

      it('should handle success', (done) => {
        store.dispatch(createJob(params));
        request.reply(200, response);
        store.whenComplete(() => {
          const received = store.actions;
          const expected = createJobSuccess({
            data: response,
            props: { message: 'job has been created.' },
          });
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });
  });

  describe('createQuote', () => {
    describe('when creating a quote', () => {
      beforeEach(() => {
        params = {
          bidCents: 12300,
          description: 'Simple quote',
          tradieJobId: 911,
        };
        request = mockHttpClient.onPost('/tradie-quotes');
        response = {
          id: 11,
          bidCents: 12300,
          description: 'Simple quote',
          tradieJobId: 911,
        };
      });

      it('should handle success when no tradieIds passed', (done) => {
        store.dispatch(createQuote(params));
        request.reply(200, response);
        store.whenComplete(() => {
          const received = store.actions;
          const expected = createQuoteSuccess({
            data: response,
            props: { isRedirect: false, message: 'job has been updated.' },
          });
          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should handle success when tradieIds are passed', (done) => {
        store.dispatch(createQuote({ ...params, tradieIds: [1] }));
        request.reply(200, response);
        store.whenComplete(() => {
          const received = store.actions;
          const expected = createQuoteSuccess({
            data: response,
            props: {
              isRedirect: true,
              message: 'tradies have been notified about the job.',
            },
          });
          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should handle error', (done) => {
        store.dispatch(createQuote(params));
        request.reply(500, {});
        store.whenComplete(() => {
          const received = store.actions;
          const expected = requestError();
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });
    describe('when inviting additional tradies to quote', () => {
      beforeEach(() => {
        params = {
          tradieJobId: 911,
          tradieIds: [4, 5],
        };
        request = mockHttpClient.onPost('/tradie-quotes');
        response = [
          {
            id: 11,
            bidCents: null,
            tradieJobId: 911,
            tradie: { id: 4 },
          },
          {
            id: 22,
            bidCents: null,
            tradieJobId: 911,
            tradie: { id: 5 },
          },
        ];
      });

      it('should handle success', (done) => {
        store.dispatch(createQuote(params));
        request.reply(200, response);
        store.whenComplete(() => {
          const received = store.actions;
          const expected = createQuoteSuccess({
            data: response,
            props: {
              isRedirect: true,
              message: 'tradies have been notified about the job.',
            },
          });
          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should handle error', (done) => {
        store.dispatch(createQuote(params));
        request.reply(500, {});
        store.whenComplete(() => {
          const received = store.actions;
          const expected = requestError();
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });
  });

  describe('fetchJob', () => {
    describe('when fetching with id', () => {
      beforeEach(() => {
        params = { jobId: 11 };
        request = mockHttpClient.onGet('/tradie-jobs/11');
        response = { id: 11, title: 'Clean windows' };
      });

      it('should handle success', (done) => {
        store.dispatch(fetchJob(params));
        request.reply(200, response);
        store.whenComplete(() => {
          const received = store.actions;
          const expected = fetchJobSuccess({ data: response });
          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should handle error', (done) => {
        store.dispatch(fetchJob(params));
        request.reply(500, {});
        store.whenComplete(() => {
          const received = store.actions;
          const expected = requestError();
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });

    describe('when fetching without id', () => {
      beforeEach(() => {
        params = {};
        request = mockHttpClient.onGet('/tradie-jobs');
        response = [
          { id: 11, title: 'Clean windows' },
          { id: 22, title: 'Fix door' },
        ];
      });

      it('should handle success', (done) => {
        store.dispatch(fetchJob(params));
        request.reply(200, response);
        store.whenComplete(() => {
          const received = store.actions;
          const expected = fetchJobSuccess({ data: response });
          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should handle error', (done) => {
        store.dispatch(fetchJob(params));
        request.reply(500, {});
        store.whenComplete(() => {
          const received = store.actions;
          const expected = requestError();
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });
  });

  describe('fetchMetaLogic', () => {
    beforeEach(() => {
      request = mockHttpClient.onGet('/tags');
    });

    it('should handle success', (done) => {
      response = [
        { id: 22, value: 'foo' },
        { id: 33, value: 'bar' },
      ];
      store.dispatch(fetchMeta({ metaType: 'tags' }));
      request.reply(200, response);
      store.whenComplete(() => {
        const received = store.actions;
        const expected = fetchMetaSuccess({
          data: response,
          props: { metaType: 'tags' },
        });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(fetchMeta({ metaType: 'tags' }));
      request.reply(500, {});
      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('fetchQuote', () => {
    describe('when fetching with id', () => {
      beforeEach(() => {
        params = { quoteId: 11 };
        request = mockHttpClient.onGet('/tradie-quotes/11');
        response = { id: 11, bidCents: 1234 };
      });

      it('should handle success', (done) => {
        store.dispatch(fetchQuote(params));
        request.reply(200, response);
        store.whenComplete(() => {
          const received = store.actions;
          const expected = fetchQuoteSuccess({ data: response });
          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should handle error', (done) => {
        store.dispatch(fetchQuote(params));
        request.reply(500, {});
        store.whenComplete(() => {
          const received = store.actions;
          const expected = requestError();
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });

    describe('when fetching without id', () => {
      beforeEach(() => {
        params = {};
        request = mockHttpClient.onGet('/tradie-quotes');
        response = [
          { id: 11, bidCents: 1234 },
          { id: 22, bidCents: 4567 },
        ];
      });

      it('should handle success', (done) => {
        store.dispatch(fetchQuote(params));
        request.reply(200, response);
        store.whenComplete(() => {
          const received = store.actions;
          const expected = fetchQuoteSuccess({ data: response });
          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should handle error', (done) => {
        store.dispatch(fetchQuote(params));
        request.reply(500, {});
        store.whenComplete(() => {
          const received = store.actions;
          const expected = requestError();
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });
  });

  describe('requestReview', () => {
    beforeEach(() => {
      params = { jobId: 11 };
      request = mockHttpClient.onPost('/tradie-jobs/11/owner-review-requests');
      response = {};
    });

    it('should handle success', (done) => {
      store.dispatch(requestReview(params));
      request.reply(200, response);
      store.whenComplete(() => {
        const received = store.actions;
        const expected = success({
          data: response,
          props: { message: 'owner has been requested to review this job.' },
        });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(requestReview(params));
      request.reply(500, {});
      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('revertQuote', () => {
    beforeEach(() => {
      params = { quoteId: 11 };
      request = mockHttpClient.onPost('/tradie-quotes/11/reversals');
      response = { id: 11, tradieNote: 'abc', bidCents: 12300 };
    });

    it('should handle success', (done) => {
      store.dispatch(revertQuote(params));
      request.reply(200, response);
      store.whenComplete(() => {
        const received = store.actions;
        const expected = updateQuoteSuccess({
          data: response,
          props: {
            hasReverted: true,
            message: 'acceptance has been reverted.',
          },
        });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(revertQuote(params));
      request.reply(500, {});
      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('updateJob', () => {
    beforeEach(() => {
      params = { jobId: 11, title: 'Clean windows', budgetCents: 12300 };
      request = mockHttpClient.onPut('/tradie-jobs/11');
      response = { id: 11, title: 'Clean windows', budgetCents: 12300 };
    });

    it('should handle success', (done) => {
      store.dispatch(updateJob(params));
      request.reply(200, response);
      store.whenComplete(() => {
        const received = store.actions;
        const expected = updateJobSuccess({
          data: response,
          props: { message: 'job has been updated.' },
        });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(updateJob(params));
      request.reply(500, {});
      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('updateQuote', () => {
    beforeEach(() => {
      params = { quoteId: 11, tradieNote: 'abc', bidCents: 12300 };
      request = mockHttpClient.onPut('/tradie-quotes/11');
      response = { id: 11, tradieNote: 'abc', bidCents: 12300 };
    });

    it('should handle success', (done) => {
      store.dispatch(updateQuote(params));
      request.reply(200, response);
      store.whenComplete(() => {
        const received = store.actions;
        const expected = updateQuoteSuccess({
          data: response,
          props: { message: 'job has been updated.' },
        });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(updateQuote(params));
      request.reply(500, {});
      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('recommendTradie', () => {
    beforeEach(() => {
      params = { quoteId: 1, content: 'foo' };
      request = mockHttpClient.onPost('/tradie-quotes/1/recommends');
      response = {
        id: 1,
        tradie: {
          id: 2,
          recommendation: {
            id: 3,
            content: 'foo',
          },
        },
      };
    });

    it('should handle success', (done) => {
      store.dispatch(recommendTradie(params));
      request.reply(200, response);
      store.whenComplete(() => {
        const received = store.actions;
        const expected = updateQuoteSuccess({ data: response });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(recommendTradie(params));
      request.reply(500, {});
      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });
});
