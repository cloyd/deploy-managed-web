/* eslint-disable no-undef */
import {
  adjustIntention,
  fetchIntention,
  fetchIntentions,
  fetchIntentionsCompleted,
  fetchIntentionsPayable,
  payIntention,
} from '../actions';
import {
  ADJUST_INTENTION,
  FETCH,
  FETCH_ALL,
  PAYMENT_COMPLETE_STATUSES,
  PAY_INTENTION,
} from '../constants';

const property = {
  id: 1,
};

describe('intention/actions', () => {
  it('should return action for adjustIntention', () => {
    const received = adjustIntention({
      intentionId: 1,
      a: 'a',
      b: 'b',
    });

    const expected = {
      type: ADJUST_INTENTION,
      payload: { intentionId: 1, params: { a: 'a', b: 'b' } },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchIntention', () => {
    const received = fetchIntention({ ...property, intentionId: 2 });
    const expected = {
      type: FETCH,
      payload: { intentionId: 2 },
    };

    expect(received).toEqual(expected);
  });

  it('should return action with ransack params for fetchIntentions', () => {
    const received = fetchIntentions({
      page: 10,
      perPage: 25,
      agencyId: 1,
      leaseId: 2,
      managerId: 3,
      propertyId: 4,
      type: null,
    });
    const expected = {
      type: FETCH_ALL,
      payload: {
        params: {
          page: 10,
          perPage: 25,
          'q[leaseLedgerItemsLeaseIdEq]': 2,
          'q[leaseLedgerItemsLeasePropertyAgencyIdEq]': 1,
          'q[leaseLedgerItemsLeasePropertyManagerIdEq]': 3,
          'q[leaseLedgerItemsLeasePropertyIdEq]': 4,
        },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchIntentionsCompleted', () => {
    const received = fetchIntentionsCompleted({ propertyId: 2 });
    const expected = {
      type: FETCH_ALL,
      payload: {
        fetchType: 'completed',
        params: {
          'q[leaseLedgerItemsLeasePropertyIdEq]': 2,
          'q[statusIn]': PAYMENT_COMPLETE_STATUSES,
        },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchIntentionsPayable', () => {
    const received = fetchIntentionsPayable({ propertyId: 2 });
    const expected = {
      type: FETCH_ALL,
      payload: {
        fetchType: 'payable',
        isFullDetail: true,
        params: {
          'q[leaseLedgerItemsLeasePropertyIdEq]': 2,
          'q[statusNotIn]': PAYMENT_COMPLETE_STATUSES,
        },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for payIntention', () => {
    const received = payIntention({
      intentionId: 1,
      payingWalletId: 2,
      a: 'b',
    });

    const expected = {
      type: PAY_INTENTION,
      payload: {
        intentionId: 1,
        payingWalletId: 2,
      },
    };

    expect(received).toEqual(expected);
  });
});
