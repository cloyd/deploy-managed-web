import { mockReduxLogic } from '../../__mocks__';
import { USER_TYPES } from '../constants';
import users, { initialState } from '../reducer';

const {
  createSuccess,
  destroySuccess,
  error,
  fetchAllSuccess,
  fetchFinancialsSuccess,
  fetchSuccess,
  sendInviteSuccess,
  updateSuccess,
} = users.actions;

describe('users/reducer', () => {
  const isLoadingState = {
    ...initialState,
    isLoading: true,
    result: 777,
    tenant: {
      data: {
        33: {
          id: 33,
          firstName: 'Ted',
          lastName: 'Smith',
        },
        44: {
          id: 44,
          firstName: 'Kim',
          lastName: 'Lee',
        },
      },
      results: [33, 44],
    },
  };
  let store;

  beforeEach(() => {
    store = mockReduxLogic({
      initialState: isLoadingState,
      logic: [],
      reducer: users.reducer,
    });
  });

  it('should define the initialState', () => {
    const received = store.getState();
    const expected = isLoadingState;
    expect(received).toEqual(expected);
  });

  [error].map((type) => {
    it(`should handle ${type.name}`, () => {
      store.dispatch(type.call());
      const received = store.getState().isLoading;
      const expected = false;
      expect(received).toEqual(expected);
    });
  });

  describe('createSuccess', () => {
    const data = {
      owner: {
        id: 123,
        firstName: 'Jane',
        lastName: 'Smith',
      },
    };

    const props = {
      type: USER_TYPES.owner,
    };

    beforeEach(() => {
      store.dispatch(createSuccess({ data, props }));
    });

    it('should set isLoading to false', () => {
      const received = store.getState().isLoading;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should set result to id', () => {
      const received = store.getState().result;
      const expected = 123;
      expect(received).toEqual(expected);
    });

    it('should set data by role and not replace type', () => {
      const received = store.getState()[USER_TYPES.owner];
      const expected = {
        data: { 123: data.owner },
        results: [123],
      };
      expect(received).toEqual(expected);
    });
  });

  describe('destroySuccess', () => {
    const props = {
      id: 33,
      type: USER_TYPES.tenant,
    };

    beforeEach(() => {
      store.dispatch(destroySuccess({ props }));
    });

    it('should set isLoading to false', () => {
      const received = store.getState().isLoading;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should reset result', () => {
      const received = store.getState().result;
      const expected = null;
      expect(received).toEqual(expected);
    });

    it('should set data by role', () => {
      const received = store.getState()[USER_TYPES.tenant];
      const expected = {
        data: { 44: isLoadingState.tenant.data[44] },
        results: [44],
      };
      expect(received).toEqual(expected);
    });
  });

  describe('fetchAllSuccess', () => {
    const data = [
      {
        id: 11,
        firstName: 'Jane',
        lastName: 'Smith',
      },
      {
        id: 22,
        firstName: 'Bob',
        lastName: 'Yang',
      },
    ];

    const props = {
      type: USER_TYPES.tenant,
    };

    beforeEach(() => {
      store.dispatch(fetchAllSuccess({ data, props }));
    });

    it('should set isLoading to false', () => {
      const received = store.getState().isLoading;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should reset result', () => {
      const received = store.getState().result;
      const expected = null;
      expect(received).toEqual(expected);
    });

    it('should set data by role and replace results', () => {
      const received = store.getState()[USER_TYPES.tenant];
      const expected = {
        data: {
          11: data[0],
          22: data[1],
          33: isLoadingState.tenant.data[33],
          44: isLoadingState.tenant.data[44],
        },
        results: [11, 22],
      };
      expect(received).toEqual(expected);
    });
  });

  describe('fetchFinancialsSuccess', () => {
    const data = {
      id: 11,
      landlordName: 'Jane Smith',
      income: ['foo'],
    };

    const props = {
      userId: 22,
    };

    beforeEach(() => {
      store.dispatch(fetchFinancialsSuccess({ data, props }));
    });

    it('should set isLoading to false', () => {
      const received = store.getState().isLoading;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should reset result', () => {
      const received = store.getState().result;
      const expected = null;
      expect(received).toEqual(expected);
    });

    it('should set data', () => {
      const received = store.getState().financials;
      const expected = { 22: data };
      expect(received).toEqual(expected);
    });
  });

  describe('fetchSuccess', () => {
    const data = {
      owner: {
        id: 123,
        firstName: 'Jane',
        lastName: 'Smith',
      },
    };

    const props = {
      type: USER_TYPES.owner,
    };

    beforeEach(() => {
      store.dispatch(fetchSuccess({ data, props }));
    });

    it('should set isLoading to false', () => {
      const received = store.getState().isLoading;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should reset result', () => {
      const received = store.getState().result;
      const expected = null;
      expect(received).toEqual(expected);
    });

    it('should set data by role and not replace type', () => {
      const received = store.getState()[USER_TYPES.owner];
      const expected = {
        data: { 123: data.owner },
        results: [],
      };
      expect(received).toEqual(expected);
    });
  });

  describe('sendInviteSuccess', () => {
    const data = {
      owner: {
        id: 123,
        firstName: 'Jane',
        lastName: 'Smith',
      },
    };

    const props = {
      type: USER_TYPES.owner,
    };

    beforeEach(() => {
      store.dispatch(sendInviteSuccess({ data, props }));
    });

    it('should set isLoading to false', () => {
      const received = store.getState().isLoading;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should set result to id if data is returned', () => {
      const received = store.getState().result;
      const expected = 123;
      expect(received).toEqual(expected);
    });

    it('should set data by role and not replace type', () => {
      const received = store.getState()[USER_TYPES.owner];
      const expected = {
        data: { 123: data.owner },
        results: [],
      };
      expect(received).toEqual(expected);
    });
  });

  describe('updateSuccess', () => {
    const data = {
      tenant: {
        id: 33,
        firstName: 'Jane',
        lastName: 'Smith',
        foo: 'bar',
      },
    };

    const props = {
      type: USER_TYPES.tenant,
    };

    beforeEach(() => {
      store.dispatch(updateSuccess({ data, props }));
    });

    it('should set isLoading to false', () => {
      const received = store.getState().isLoading;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should reset result', () => {
      const received = store.getState().result;
      const expected = null;
      expect(received).toEqual(expected);
    });

    it('should replace with new user data', () => {
      const received = store.getState()[USER_TYPES.tenant];
      const expected = {
        data: { ...isLoadingState.tenant.data, 33: data.tenant },
        results: isLoadingState.tenant.results,
      };
      expect(received).toEqual(expected);
    });
  });
});
