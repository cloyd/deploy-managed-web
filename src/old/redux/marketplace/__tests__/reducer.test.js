import { mockReduxLogic } from '../../__mocks__';
import marketplace, { initialState } from '../reducer';

const {
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
  updateAttachments,
  updateJob,
  updateJobSuccess,
  updateQuote,
  updateQuoteSuccess,
} = marketplace.actions;

describe('marketplace/reducer', () => {
  const isLoadingState = {
    ...initialState,
    isLoading: true,
    job: { data: {}, result: null, results: [] },
    meta: { tags: [] },
    quote: { data: {}, result: null, results: [] },
  };

  describe('actions', () => {
    const initialDataState = {
      ...initialState,
      isLoading: false,
      job: { data: {}, result: 777, results: [] },
      meta: { tags: [] },
      quote: { data: {}, result: 777, results: [] },
    };
    let store;

    beforeEach(() => {
      store = mockReduxLogic({
        initialState: initialDataState,
        logic: [],
        reducer: marketplace.reducer,
      });
    });

    [
      createJob,
      createQuote,
      fetchJob,
      fetchMeta,
      fetchQuote,
      recommendTradie,
      updateJob,
      updateQuote,
    ].map((type) => {
      it(`should handle ${type}`, () => {
        store.dispatch(type.call());
        const received = store.getState();
        const expected = isLoadingState;
        expect(received).toEqual(expected);
      });
    });
  });

  describe('success or error actions', () => {
    let store;

    beforeEach(() => {
      store = mockReduxLogic({
        initialState: isLoadingState,
        logic: [],
        reducer: marketplace.reducer,
      });
    });

    describe('error', () => {
      beforeEach(() => {
        store.dispatch(error());
      });

      it('should set isLoading to false', () => {
        const received = store.getState().isLoading;
        const expected = false;
        expect(received).toEqual(expected);
      });
    });

    describe('createJobSuccess', () => {
      const data = { id: 22, value: 'foo' };
      const props = { message: 'job has been created.' };

      beforeEach(() => {
        store.dispatch(createJobSuccess({ data, props }));
      });

      it('should set isLoading to false', () => {
        const received = store.getState().isLoading;
        const expected = false;
        expect(received).toEqual(expected);
      });

      it('should set data', () => {
        const received = store.getState();
        const expected = {
          ...initialState,
          isLoading: false,
          job: { data: { 22: data }, result: 22, results: [] },
        };
        expect(received).toEqual(expected);
      });
    });

    describe('createQuoteSuccess', () => {
      const data = { id: 22, value: 'foo' };
      const props = { message: 'job has been created.' };

      beforeEach(() => {
        store.dispatch(createQuoteSuccess({ data, props }));
      });

      it('should set isLoading to false', () => {
        const received = store.getState().isLoading;
        const expected = false;
        expect(received).toEqual(expected);
      });

      it('should set data', () => {
        const received = store.getState();
        const expected = {
          ...initialState,
          isLoading: false,
          quote: { data: { 22: data }, result: 22, results: [] },
        };
        expect(received).toEqual(expected);
      });
    });

    describe('fetchJobSuccess', () => {
      describe('when single job is returned1', () => {
        const data = { id: 22, value: 'foo' };

        beforeEach(() => {
          store.dispatch(fetchJobSuccess({ data }));
        });

        it('should set isLoading to false', () => {
          const received = store.getState().isLoading;
          const expected = false;
          expect(received).toEqual(expected);
        });

        it('should set data', () => {
          const received = store.getState();
          const expected = {
            ...isLoadingState,
            isLoading: false,
            job: {
              data: { 22: { id: 22, value: 'foo' } },
              result: null,
              results: [],
            },
          };
          expect(received).toEqual(expected);
        });
      });

      describe('when array of jobs is returned', () => {
        const data = [
          { id: 22, value: 'foo' },
          { id: 33, value: 'bar' },
        ];

        beforeEach(() => {
          store.dispatch(fetchJobSuccess({ data }));
        });

        it('should set isLoading to false', () => {
          const received = store.getState().isLoading;
          const expected = false;
          expect(received).toEqual(expected);
        });

        it('should set data', () => {
          const received = store.getState();
          const expected = {
            ...isLoadingState,
            isLoading: false,
            job: {
              data: {
                22: { id: 22, value: 'foo' },
                33: { id: 33, value: 'bar' },
              },
              result: null,
              results: [22, 33],
            },
          };
          expect(received).toEqual(expected);
        });
      });
    });

    describe('fetchMetaSuccess', () => {
      const data = [
        { id: 22, value: 'foo' },
        { id: 33, value: 'bar' },
      ];
      const props = {
        metaType: 'tags',
      };

      beforeEach(() => {
        store.dispatch(fetchMetaSuccess({ data, props }));
      });

      it('should set isLoading to false', () => {
        const received = store.getState().isLoading;
        const expected = false;
        expect(received).toEqual(expected);
      });

      it('should set data', () => {
        const received = store.getState().meta;
        const expected = { tags: data };
        expect(received).toEqual(expected);
      });
    });

    describe('fetchQuoteSuccess', () => {
      describe('when single quote is returned', () => {
        const data = { id: 22, value: 'foo' };

        beforeEach(() => {
          store.dispatch(fetchQuoteSuccess({ data }));
        });

        it('should set isLoading to false', () => {
          const received = store.getState().isLoading;
          const expected = false;
          expect(received).toEqual(expected);
        });

        it('should set data', () => {
          const received = store.getState();
          const expected = {
            ...isLoadingState,
            isLoading: false,
            quote: {
              data: { 22: { id: 22, value: 'foo' } },
              result: null,
              results: [],
            },
          };
          expect(received).toEqual(expected);
        });
      });

      describe('when array of quotes is returned', () => {
        const data = [
          { id: 22, value: 'foo' },
          { id: 33, value: 'bar' },
        ];

        beforeEach(() => {
          store.dispatch(fetchQuoteSuccess({ data }));
        });

        it('should set isLoading to false', () => {
          const received = store.getState().isLoading;
          const expected = false;
          expect(received).toEqual(expected);
        });

        it('should set data', () => {
          const received = store.getState();
          const expected = {
            ...isLoadingState,
            isLoading: false,
            quote: {
              data: {
                22: { id: 22, value: 'foo' },
                33: { id: 33, value: 'bar' },
              },
              result: null,
              results: [22, 33],
            },
          };
          expect(received).toEqual(expected);
        });
      });
    });
  });

  describe('update success actions', () => {
    const initialDataState = {
      ...initialState,
      isLoading: false,
      job: {
        data: { 11: { id: 11, value: 'timtam', attachments: [8] } },
        result: null,
        results: [],
      },
      meta: { tags: [] },
      quote: {
        data: { 11: { id: 11, value: 'montecarlo', attachments: [8] } },
        result: null,
        results: [],
      },
    };
    let store;

    beforeEach(() => {
      store = mockReduxLogic({
        initialState: initialDataState,
        logic: [],
        reducer: marketplace.reducer,
      });
    });

    describe('updateAttachments', () => {
      it('should update attachments for a job', () => {
        const data = {
          attachableId: 11,
          attachments: [1, 2, 3],
          stateKey: 'job',
        };

        store.dispatch(updateAttachments(data));

        const received = store.getState();
        const expected = {
          ...initialDataState,
          isLoading: false,
          job: {
            data: {
              11: { id: 11, value: 'timtam', attachments: data.attachments },
            },
            result: null,
            results: [],
          },
        };
        expect(received).toEqual(expected);
      });

      it('should update attachments for a quote', () => {
        const data = {
          attachableId: 11,
          attachments: [1, 2, 3],
          stateKey: 'quote',
        };

        store.dispatch(updateAttachments(data));

        const received = store.getState();
        const expected = {
          ...initialDataState,
          isLoading: false,
          quote: {
            data: {
              11: {
                id: 11,
                value: 'montecarlo',
                attachments: data.attachments,
              },
            },
            result: null,
            results: [],
          },
        };
        expect(received).toEqual(expected);
      });
    });

    describe('updateJobSuccess', () => {
      const data = { id: 22, value: 'foo' };
      const props = { message: 'job has been updated.' };

      beforeEach(() => {
        store.dispatch(updateJobSuccess({ data, props }));
      });

      it('should set isLoading to false', () => {
        const received = store.getState().isLoading;
        const expected = false;
        expect(received).toEqual(expected);
      });

      it('should set data', () => {
        const received = store.getState();
        const expected = {
          ...initialDataState,
          isLoading: false,
          job: {
            data: { ...initialDataState.job.data, 22: data },
            result: null,
            results: [],
          },
        };
        expect(received).toEqual(expected);
      });
    });

    describe('updateQuoteSuccess', () => {
      const data = {
        id: 22,
        value: 'foo',
        status: 'accepted',
        tradieJobId: 11,
      };
      const props = { message: 'job has been updated.' };

      beforeEach(() => {
        store.dispatch(updateQuoteSuccess({ data, props }));
      });

      it('should set isLoading to false', () => {
        const received = store.getState().isLoading;
        const expected = false;
        expect(received).toEqual(expected);
      });

      it('should set data', () => {
        const received = store.getState();
        const expected = {
          ...initialDataState,
          isLoading: false,
          job: {
            ...initialDataState.job,
            data: {
              11: { ...initialDataState.job.data[11], acceptedQuoteId: 22 },
            },
          },
          quote: {
            ...initialDataState.quote,
            data: { ...initialDataState.quote.data, 22: data },
          },
        };
        expect(received).toEqual(expected);
      });
    });
  });
});
