/* eslint-disable no-undef */
import reducer, {
  fetchLeases,
  fetchModifications,
  getLease,
  getLeaseActive,
  getLeaseActiveOrUpcoming,
  getLeaseModifications,
  getLeaseUpcoming,
  getLeases,
  getLeasesByProperty,
  getLeasesExpired,
  getLeasesExpiredByDaysAgo,
  initialState,
  logic,
} from '..';
import { mockHttpClient, mockReduxLogic } from '../../__mocks__';

const lease = {
  id: 1,
  title: 'Title',
  canActivate: false,
  canAdjustFrequency: true,
  canAdjustRent: false,
  canCancel: true,
  canEdit: false,
  canRefund: false,
  hasBond: false,
  hasDeposit: false,
  hasTenant: true,
  isActivating: false,
  isActive: false,
  isCancelled: false,
  isDraft: false,
  isExpired: false,
  isPending: false,
  isPendingActivate: false,
  isPendingClearance: false,
  isTerminated: false,
  isTerminating: true,
  amountCents: {
    annually: 0,
    fortnightly: 0,
    monthly: 0,
    weekly: 0,
  },
  amountDollars: {
    annually: '$0',
    fortnightly: '$0',
    monthly: '$0',
    weekly: '$0',
  },
};

describe('lease/selectors', () => {
  let store;
  let request;

  beforeEach(() => {
    store = mockReduxLogic({
      initialState,
      logic,
      reducer,
    });
  });

  afterEach(() => {
    store = undefined;
  });

  describe('getLease', () => {
    beforeEach(() => {
      mockHttpClient.onGet(`/leases`).reply(200, { leases: [lease] });
      store.dispatch(fetchLeases());
    });

    it('should return the lease', (done) => {
      store.whenComplete(() => {
        const received = getLease(store.getState(), lease.id).id;
        const expected = lease.id;

        expect(received).toEqual(expected);
        done();
      });
    });
  });

  describe('getLeaseActive', () => {
    const activeLease = { ...lease, id: 1, propertyId: 1, status: 'active' };
    const draftLease = { ...lease, id: 2, propertyId: 1, status: 'draft' };
    const otherLease = { ...lease, id: 3, propertyId: 2, status: 'active' };

    beforeEach(() => {
      request = mockHttpClient.onGet(`/leases`);
    });

    it('should return empty object when no active is found', (done) => {
      request.reply(200, { leases: [draftLease, otherLease] });
      store.dispatch(fetchLeases());

      store.whenComplete(() => {
        const received = getLeaseActive(store.getState(), 1);
        const expected = {};

        expect(received).toEqual(expected);
        done();
      });
    });

    it('should return the active lease', (done) => {
      request.reply(200, { leases: [activeLease, draftLease, otherLease] });
      store.dispatch(fetchLeases());

      store.whenComplete(() => {
        const received = getLeaseActive(store.getState(), 1).status;
        const expected = 'active';

        expect(received).toEqual(expected);
        done();
      });
    });
  });

  describe('getLeaseUpcoming', () => {
    const activeLease = { ...lease, id: 1, propertyId: 1, status: 'active' };
    const pendingLease = {
      ...lease,
      id: 2,
      propertyId: 1,
      status: 'pending_activate',
    };
    const draftLease = { ...lease, id: 3, propertyId: 1, status: 'draft' };
    const otherLease = { ...lease, id: 4, propertyId: 2, status: 'draft' };

    beforeEach(() => {
      request = mockHttpClient.onGet(`/leases`);
    });

    it('should return empty object when no upcoming lease', (done) => {
      request.reply(200, { leases: [activeLease, otherLease] });
      store.dispatch(fetchLeases());

      store.whenComplete(() => {
        const received = getLeaseUpcoming(store.getState(), 1);
        const expected = {};

        expect(received).toEqual(expected);
        done();
      });
    });

    it('should return the pending lease before the draft', (done) => {
      request.reply(200, {
        leases: [activeLease, pendingLease, draftLease, otherLease],
      });
      store.dispatch(fetchLeases());

      store.whenComplete(() => {
        const received = getLeaseUpcoming(store.getState(), 1).status;
        const expected = 'pending_activate';

        expect(received).toEqual(expected);
        done();
      });
    });

    it('should return the draft lease when no pending', (done) => {
      request.reply(200, { leases: [activeLease, draftLease, otherLease] });
      store.dispatch(fetchLeases());

      store.whenComplete(() => {
        const received = getLeaseUpcoming(store.getState(), 1).status;
        const expected = 'draft';

        expect(received).toEqual(expected);
        done();
      });
    });
  });

  describe('getLeaseActiveOrUpcoming', () => {
    const activeLease = { ...lease, id: 1, propertyId: 1, status: 'active' };
    const pendingLease = {
      ...lease,
      id: 2,
      propertyId: 1,
      status: 'pending_activate',
    };
    const draftLease = { ...lease, id: 3, propertyId: 1, status: 'draft' };
    const otherLease = { ...lease, id: 4, propertyId: 2, status: 'draft' };

    beforeEach(() => {
      request = mockHttpClient.onGet(`/leases`);
    });

    it('should return the active lease before pending', (done) => {
      request.reply(200, {
        leases: [pendingLease, draftLease, otherLease, activeLease],
      });
      store.dispatch(fetchLeases());

      store.whenComplete(() => {
        const received = getLeaseActiveOrUpcoming(store.getState(), 1).status;
        const expected = 'active';

        expect(received).toEqual(expected);
        done();
      });
    });

    it('should return the draft lease when no active or upcoming', (done) => {
      request.reply(200, { leases: [draftLease, otherLease] });
      store.dispatch(fetchLeases());

      store.whenComplete(() => {
        const received = getLeaseActiveOrUpcoming(store.getState(), 1).status;
        const expected = 'draft';

        expect(received).toEqual(expected);
        done();
      });
    });
  });

  describe('getLeases', () => {
    const leases = [
      { ...lease, id: 1 },
      { ...lease, id: 2 },
    ];

    beforeEach(() => {
      mockHttpClient.onGet(`/leases`).reply(200, { leases });
      store.dispatch(fetchLeases());
    });

    it('should return the leases', (done) => {
      store.whenComplete(() => {
        const received = getLeases(store.getState());
        const expected = leases;

        expect(received).toEqual(expected);
        done();
      });
    });
  });

  describe('getLeasesByProperty', () => {
    const lease1 = { ...lease, id: 1, propertyId: 1 };
    const lease2 = { ...lease, id: 2, propertyId: 1 };
    const lease3 = { ...lease, id: 3, propertyId: 2 };

    beforeEach(() => {
      mockHttpClient
        .onGet(`/leases`)
        .reply(200, { leases: [lease1, lease2, lease3] });
      store.dispatch(fetchLeases());
    });

    it('should return the leases for the property', (done) => {
      store.whenComplete(() => {
        const received = getLeasesByProperty(store.getState(), 1).length;
        const expected = 2;

        expect(received).toEqual(expected);
        done();
      });
    });
  });

  describe('getLeaseModifications', () => {
    const leaseId = 1;
    const modifications = [
      {
        id: 1,
        leaseId,
        effectiveDate: '2018-11-05',
        reason: 'review',
        annualRentCents: 2607143,
        annualRentCurrency: 'AUD',
      },
    ];
    const modificationsDecorated = [
      {
        id: 1,
        leaseId: 1,
        effectiveDate: '2018-11-05',
        reason: 'review',
        annualRentCents: 2607143,
        annualRentCurrency: 'AUD',
        amountCents: {
          annually: 2607143,
          weekly: 50000.00273972603,
          fortnightly: 100000.00547945205,
          monthly: 217261.91666666666,
        },
        amountDollars: {
          annually: '$26,071.43',
          weekly: '$500',
          fortnightly: '$1,000',
          monthly: '$2,172.62',
        },
        effectiveDateFormatted: '5 Nov 2018',
      },
    ];

    beforeEach(() => {
      mockHttpClient
        .onGet(`/leases/${leaseId}/rent-modifications`)
        .reply(200, { leaseRents: modifications });
      store.dispatch(fetchModifications({ leaseId }));
    });

    it('should return the modifications', (done) => {
      store.whenComplete(() => {
        const received = getLeaseModifications(store.getState(), leaseId);
        const expected = modificationsDecorated;

        expect(received).toEqual(expected);
        done();
      });
    });
  });

  describe('Expired Leases', () => {
    const today = new Date();
    const propertyId = 22;
    const state = {
      leases: {
        1: {
          id: 1,
          propertyId: 11,
          isExpired: false,
          terminationDate: new Date().setDate(today.getDate() + 15),
        },
        2: {
          id: 2,
          propertyId,
          isExpired: false,
          terminationDate: new Date().setDate(today.getDate() + 10),
        },
        3: {
          id: 3,
          propertyId,
          isExpired: true,
          terminationDate: new Date().setDate(today.getDate() - 5),
        },
        4: {
          id: 4,
          propertyId,
          isExpired: true,
          terminationDate: new Date().setDate(today.getDate() - 10),
        },
        5: {
          id: 5,
          propertyId,
          isExpired: true,
          terminationDate: new Date().setDate(today.getDate() - 99),
        },
      },
    };

    describe('getLeasesExpired', () => {
      it('should return expired lease for given property', () => {
        const received = getLeasesExpired(state, propertyId);
        const expected = [state.leases[3], state.leases[4], state.leases[5]];

        expect(received).toEqual(expected);
      });

      it('should return emptyy arrayy if no expired leases', () => {
        const received = getLeasesExpired(state, 11);
        const expected = [];

        expect(received).toEqual(expected);
      });
    });

    describe('getLeasesExpiredByDaysAgo', () => {
      it('should return leases expired within the past 10 days', () => {
        const received = getLeasesExpiredByDaysAgo(state, propertyId, 10);
        const expected = [state.leases[3], state.leases[4]];

        expect(received).toEqual(expected);
      });

      it('should return leases expired within the past 100 days', () => {
        const received = getLeasesExpiredByDaysAgo(state, propertyId, 100);
        const expected = [state.leases[3], state.leases[4], state.leases[5]];

        expect(received).toEqual(expected);
      });
    });
  });
});
