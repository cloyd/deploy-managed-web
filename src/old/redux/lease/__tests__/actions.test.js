/* eslint-disable no-undef */
import { formatDate } from '../../../utils';
import {
  activateLease,
  addTenant,
  cancelLease,
  disburseBond,
  fetchLease,
  fetchLeases,
  fetchModifications,
  modifyRent,
  updateLease,
} from '../actions';
import {
  ACTIVATE,
  ADD_TENANT,
  CANCEL,
  DISBURSE,
  FETCH,
  FETCH_ALL,
  FETCH_MODIFICATIONS,
  MODIFY_RENT,
  UPDATE,
} from '../constants';

describe('lease/actions', () => {
  it('should return action for activateLease', () => {
    const payload = { leaseId: 1, a: 'a', b: 'b' };
    const received = activateLease(payload);
    const expected = {
      type: ACTIVATE,
      payload: { leaseId: 1, params: { a: 'a', b: 'b' } },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for addTenant', () => {
    const received = addTenant({ leaseId: 1, a: 'a', b: 'b' });
    const expected = {
      type: ADD_TENANT,
      payload: { leaseId: 1, params: { a: 'a', b: 'b' } },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for cancelLease', () => {
    const received = cancelLease({ id: 1 });
    const expected = { type: CANCEL, payload: { leaseId: 1 } };
    expect(received).toEqual(expected);
  });

  it('should return action for disburseBond', () => {
    const received = disburseBond({
      a: 'a',
      b: 'b',
      id: 1,
      bondNumber: 2,
      bondReturnedCents: 100,
    });

    const expected = {
      type: DISBURSE,
      payload: {
        id: 1,
        params: {
          bondNumber: 2,
          bondReturnedCents: 100,
        },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchLease', () => {
    const received = fetchLease({ leaseId: 1 });
    const expected = {
      type: FETCH,
      payload: { leaseId: 1 },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchLeases,', () => {
    const received = fetchLeases({ propertyId: 1, a: 'a', b: 'b' });
    const expected = {
      type: FETCH_ALL,
      payload: { propertyId: 1, params: { a: 'a', b: 'b' } },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchModifications', () => {
    const received = fetchModifications({
      leaseId: 1,
    });

    const expected = {
      type: FETCH_MODIFICATIONS,
      payload: {
        leaseId: 1,
        params: {
          'q[effectiveDateGteq]': formatDate(new Date(), 'dateLocal'),
        },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for modifyRent', () => {
    const received = modifyRent({
      id: 1,
      a: 'a',
    });

    const expected = {
      type: MODIFY_RENT,
      payload: {
        leaseId: 1,
        params: { a: 'a' },
      },
    };

    expect(received).toEqual(expected);
  });

  describe('for updateLease', () => {
    it('should return action for updateLease', () => {
      const received = updateLease({ id: 123, a: 'a' });
      const expected = {
        type: UPDATE,
        payload: { leaseId: 123, params: { a: 'a' } },
      };

      expect(received).toEqual(expected);
    });

    it('should return params in correct format', () => {
      const received = updateLease({
        id: 123,
        inspectionDate: 'abc',
        inspectionDateFrequency: 12,
        reviewDate: 'xyz',
        reviewDateFrequency: 5,
      });

      const expected = {
        type: UPDATE,
        payload: {
          leaseId: 123,
          params: {
            inspectionDate: 'abc',
            reviewDate: 'xyz',
            inspectionDateFrequencyInMonths: 12,
            reviewDateFrequencyInMonths: 5,
          },
        },
      };

      expect(received).toEqual(expected);
    });

    it('should set default FrequencyInMonths if Frequency not set', () => {
      const received = updateLease({
        id: 123,
        inspectionDate: 'abc',
        reviewDate: 'xyz',
      });

      const expected = {
        type: UPDATE,
        payload: {
          leaseId: 123,
          params: {
            inspectionDate: 'abc',
            reviewDate: 'xyz',
            inspectionDateFrequencyInMonths: '3',
            reviewDateFrequencyInMonths: '3',
          },
        },
      };

      expect(received).toEqual(expected);
    });
  });
});
