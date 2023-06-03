/* eslint-disable no-undef */
import reducer, { initialState } from '..';
import {
  ARCHIVE,
  ARCHIVE_SUCCESS,
  CREATE,
  CREATE_MESSAGE,
  CREATE_QUOTE,
  DESTROY,
  DESTROY_SUCCESS,
  ERROR,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_PROPERTY,
  FETCH_ALL_SUCCESS,
  FETCH_MESSAGES,
  FETCH_MESSAGES_SUCCESS,
  FETCH_META,
  FETCH_META_SUCCESS,
  FETCH_SIMILAR_SUCCESS,
  FETCH_TASK_ACTIVITIES,
  SUCCESS,
  UPDATE,
  UPDATE_ATTACHMENTS,
} from '../constants';

describe('task/reducer', () => {
  const task1 = { id: 1, title: 'title-1' };
  const task2 = { id: 2, title: 'title-2' };
  const task3 = { id: 3, title: 'title-3' };

  it('should define the initialState', () => {
    const received = initialState;
    const expected = {
      activities: {},
      isLoading: false,
      isLoadingIndex: false,
      isLoadingActivities: false,
      result: null,
      results: [],
      data: {},
      messages: {},
      meta: {},
      categories: [],
      similar: {},
      statuses: [],
      types: [],
    };

    expect(received).toEqual(expected);
  });

  [
    CREATE,
    CREATE_QUOTE,
    DESTROY,
    ARCHIVE,
    FETCH,
    FETCH_MESSAGES,
    FETCH_META,
    UPDATE,
  ].map((type) => {
    it(`should handle ${type}`, () => {
      const state = {
        ...initialState,
        isLoading: false,
      };

      const received = reducer(state, { type });
      const expected = { ...state, isLoading: true };

      expect(received).toEqual(expected);
    });
  });

  [CREATE_MESSAGE, FETCH_TASK_ACTIVITIES].map((type) => {
    it(`should handle ${type}`, () => {
      const state = {
        ...initialState,
        isLoading: false,
        isLoadingActivities: false,
      };

      const received = reducer(state, { type });
      const expected = { ...state, isLoadingActivities: true };

      expect(received).toEqual(expected);
    });
  });

  [FETCH_ALL, FETCH_ALL_PROPERTY].map((type) => {
    it(`should handle ${type}`, () => {
      const state = {
        ...initialState,
        isLoadingIndex: false,
      };

      const received = reducer(state, { type });
      const expected = { ...state, isLoadingIndex: true };

      expect(received).toEqual(expected);
    });
  });

  [DESTROY_SUCCESS, ARCHIVE_SUCCESS].map((type) => {
    it(`should handle ${type}`, () => {
      const state = {
        ...initialState,
        isLoading: true,
        data: { 1: task1, 2: task2 },
      };

      const received = reducer(state, {
        type: `${type}`,
        payload: { taskId: 1 },
      });

      const expected = {
        ...state,
        isLoading: false,
        data: { 2: task2 },
      };

      expect(received).toEqual(expected);
    });
  });

  it('should handle SUCCESS', () => {
    const state = {
      ...initialState,
      isLoading: true,
      result: 1,
      data: { 1: task1 },
    };

    const received = reducer(state, {
      type: SUCCESS,
      payload: { data: { 2: task2 }, result: 2 },
    });

    const expected = {
      ...state,
      isLoading: false,
      data: { 1: task1, 2: task2 },
    };

    expect(received).toEqual(expected);
  });

  it('should handle FETCH_ALL_SUCCESS', () => {
    const state = {
      ...initialState,
      isLoadingIndex: true,
      results: [1],
      data: { 1: task1 },
    };

    const received = reducer(state, {
      type: FETCH_ALL_SUCCESS,
      payload: {
        data: { 2: task2, 3: task3 },
        result: [2, 3],
      },
    });

    const expected = {
      ...state,
      isLoadingIndex: false,
      results: [2, 3],
      data: { 1: task1, 2: task2, 3: task3 },
    };

    expect(received).toEqual(expected);
  });

  it('should handle FETCH_MESSAGES_SUCCESS', () => {
    const state = {
      ...initialState,
      isLoading: true,
      messages: { 1: 'foo' },
    };

    const received = reducer(state, {
      type: FETCH_MESSAGES_SUCCESS,
      payload: { 2: 'bar' },
    });

    const expected = {
      ...state,
      isLoading: false,
      messages: { 1: 'foo', 2: 'bar' },
    };

    expect(received).toEqual(expected);
  });

  it('should handle FETCH_META_SUCCESS', () => {
    const state = {
      ...initialState,
      isLoading: true,
    };

    const received = reducer(state, {
      type: FETCH_META_SUCCESS,
      payload: {
        Hello: {
          categories: ['cat1', 'cat2', 'cat3'],
          statuses: ['stat1', 'stat2', 'stat3'],
        },
        World: {
          categories: ['cat3', 'cat4'],
          statuses: ['stat3', 'stat4'],
        },
      },
    });

    const expected = {
      ...state,
      isLoading: false,
      categories: ['cat1', 'cat2', 'cat3', 'cat4'],
      statuses: ['stat1', 'stat2', 'stat3', 'stat4'],
      meta: {
        Hello: {
          categories: ['cat1', 'cat2', 'cat3'],
          statuses: ['stat1', 'stat2', 'stat3'],
        },
        World: {
          categories: ['cat3', 'cat4'],
          statuses: ['stat3', 'stat4'],
        },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should handle FETCH_SIMILAR_SUCCESS', () => {
    const propertyId = 123;
    const state = {
      ...initialState,
      isLoading: true,
      similar: {
        1: { foo: 'bar' },
        [propertyId]: {
          hello: {
            completed: ['cat1', 'cat2', 'cat3'],
            draft: ['stat1', 'stat2', 'stat3'],
          },
        },
      },
    };
    const data = {
      world: {
        completed: ['cat3', 'cat4'],
        draft: ['stat3', 'stat4'],
      },
    };

    const received = reducer(state, {
      type: FETCH_SIMILAR_SUCCESS,
      payload: {
        propertyId,
        data,
      },
    });

    const expected = {
      ...state,
      isLoading: false,
      similar: {
        1: { foo: 'bar' },
        [propertyId]: {
          hello: {
            completed: ['cat1', 'cat2', 'cat3'],
            draft: ['stat1', 'stat2', 'stat3'],
          },
          world: {
            completed: ['cat3', 'cat4'],
            draft: ['stat3', 'stat4'],
          },
        },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should handle ERROR', () => {
    const state = { ...initialState, isLoading: true };
    const received = reducer(state, { type: ERROR });
    const expected = { ...state, isLoading: false };

    expect(received).toEqual(expected);
  });

  it('should handle UPDATE_ATTACHMENTS', () => {
    const state = {
      ...initialState,
      data: {
        1: {
          ...task1,
          attachments: [1, 2],
        },
      },
    };

    const received = reducer(state, {
      type: UPDATE_ATTACHMENTS,
      payload: {
        attachableId: 1,
        attachments: [1, 2, 3],
      },
    });

    const expected = {
      ...state,
      data: {
        1: {
          ...task1,
          attachments: [1, 2, 3],
        },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should return state by default', () => {
    const state = { ...initialState };
    const received = reducer(state, {});
    const expected = state;

    expect(received).toEqual(expected);
  });
});
