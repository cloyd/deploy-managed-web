/* eslint-disable no-undef */
import { decorateLease, decorateModification } from '../decorators';

describe('lease/decorators', () => {
  let lease;

  describe('decorateLease', () => {
    describe('amountCents', () => {
      it('should be defined', () => {
        const received = decorateLease({ annualRentCents: 365 }).amountCents;
        const expected = {
          annually: expect.any(Number),
          weekly: expect.any(Number),
          fortnightly: expect.any(Number),
          monthly: expect.any(Number),
        };

        expect(received).toEqual(expected);
      });
    });

    describe('amountDollars', () => {
      it('should be defined', () => {
        const received = decorateLease({ annualRentCents: 365 }).amountDollars;
        const expected = {
          annually: expect.stringContaining('$'),
          weekly: expect.stringContaining('$'),
          fortnightly: expect.stringContaining('$'),
          monthly: expect.stringContaining('$'),
        };

        expect(received).toEqual(expected);
      });
    });

    describe('hasDeposit', () => {
      it('should return true when depositCents > 0', () => {
        const received = decorateLease({ depositCents: 1 }).hasDeposit;
        const expected = true;
        expect(received).toEqual(expected);
      });

      it('should return false when depositCents === 0', () => {
        const received = decorateLease({ depositCents: 0 }).hasDeposit;
        const expected = false;
        expect(received).toEqual(expected);
      });

      it('should return false when depositCents is null', () => {
        const received = decorateLease({ depositCents: null }).hasDeposit;
        const expected = false;
        expect(received).toEqual(expected);
      });
    });

    describe('hasTenant', () => {
      it('should return true when tenant is not null', () => {
        const received = decorateLease({ tenant: { id: 1 } }).hasTenant;
        const expected = true;
        expect(received).toEqual(expected);
      });

      it('should return true when tenant is null', () => {
        const received = decorateLease({ tenant: null }).hasTenant;
        const expected = false;
        expect(received).toEqual(expected);
      });
    });

    describe('isActive', () => {
      it('should return true when status is active', () => {
        const received = decorateLease({ status: 'active' }).isActive;
        const expected = true;
        expect(received).toEqual(expected);
      });

      it('should return false when status is not active', () => {
        const received = decorateLease({ status: null }).isActive;
        const expected = false;
        expect(received).toEqual(expected);
      });
    });

    describe('isCancelled', () => {
      it('should return true when status is cancelled', () => {
        const received = decorateLease({ status: 'cancelled' }).isCancelled;
        const expected = true;
        expect(received).toEqual(expected);
      });

      it('should return false when status is not cancelled', () => {
        const received = decorateLease({ status: null }).isCancelled;
        const expected = false;
        expect(received).toEqual(expected);
      });
    });

    describe('isDraft', () => {
      it('should return true when status is draft', () => {
        const received = decorateLease({ status: 'draft' }).isDraft;
        const expected = true;
        expect(received).toEqual(expected);
      });

      it('should return false when status is not draft', () => {
        const received = decorateLease({ status: null }).isDraft;
        const expected = false;
        expect(received).toEqual(expected);
      });
    });

    describe('isExpired', () => {
      it('should return true when status is expired', () => {
        const received = decorateLease({ status: 'expired' }).isExpired;
        const expected = true;
        expect(received).toEqual(expected);
      });

      it('should return false when status is not expired', () => {
        const received = decorateLease({ status: null }).isExpired;
        const expected = false;
        expect(received).toEqual(expected);
      });
    });

    describe('isPendingActivate', () => {
      it('should return true when status is pending_activate', () => {
        const received = decorateLease({
          status: 'pending_activate',
        }).isPendingActivate;
        const expected = true;
        expect(received).toEqual(expected);
      });

      it('should return false when status is not pending_activate', () => {
        const received = decorateLease({ status: null }).isPendingActivate;
        const expected = false;
        expect(received).toEqual(expected);
      });
    });

    describe('isTerminated', () => {
      it('should return true when terminationDate is not null', () => {
        const received = decorateLease({
          terminationDate: '2018-01-01',
        }).isTerminated;
        const expected = true;
        expect(received).toEqual(expected);
      });

      it('should return false when terminationDate is null', () => {
        const received = decorateLease({ terminationDate: null }).isTerminated;
        const expected = false;
        expect(received).toEqual(expected);
      });
    });

    describe('canRefund', () => {
      beforeEach(() => {
        lease = {
          depositCents: 1000,
          status: 'pending_activate',
        };
      });

      it('should return true when isPendingActivate & hasDeposit', () => {
        const received = decorateLease(lease).canRefund;
        const expected = true;
        expect(received).toEqual(expected);
      });

      it('should return false when !isPendingActivate', () => {
        const received = decorateLease({ ...lease, status: null }).canRefund;
        const expected = false;
        expect(received).toEqual(expected);
      });

      it('should return false when !hasDeposit', () => {
        const received = decorateLease({ ...lease, depositCents: 0 }).canRefund;
        const expected = false;
        expect(received).toEqual(expected);
      });
    });

    describe('canActivate', () => {
      beforeEach(() => {
        lease = {
          tenant: { id: 1 },
          status: 'pending_activate',
        };
      });

      it('should return true when tenant exists and is pending_activate', () => {
        const received = decorateLease(lease).canActivate;
        const expected = true;
        expect(received).toEqual(expected);
      });

      it('should return false when tenant is null', () => {
        const received = decorateLease({ ...lease, tenant: null }).canActivate;
        const expected = false;
        expect(received).toEqual(expected);
      });

      it('should return false when status is not pending_activate', () => {
        const received = decorateLease({ ...lease, status: '' }).canActivate;
        const expected = false;
        expect(received).toEqual(expected);
      });
    });

    describe('canCancel', () => {
      beforeEach(() => {
        lease = {
          tenant: { id: 1 },
          status: 'pending_activate',
        };
      });

      it('should return true when tenant exists', () => {
        const received = decorateLease(lease).canCancel;
        const expected = true;
        expect(received).toEqual(expected);
      });

      it('should return false when tenant is null', () => {
        const received = decorateLease({ ...lease, tenant: null }).canCancel;
        const expected = false;
        expect(received).toEqual(expected);
      });

      it('should return false when status is active', () => {
        const received = decorateLease({
          ...lease,
          status: 'active',
        }).canCancel;
        const expected = false;
        expect(received).toEqual(expected);
      });

      it('should return false when status is expired', () => {
        const received = decorateLease({
          ...lease,
          status: 'expired',
        }).canCancel;
        const expected = false;
        expect(received).toEqual(expected);
      });
    });

    describe('isTerminating', () => {
      beforeEach(() => {
        lease = {
          terminationDate: null,
        };
      });

      it('should return false when active and terminationDate is null', () => {
        const received = decorateLease(lease).isTerminating;
        const expected = false;
        expect(received).toEqual(expected);
      });

      it('should return true when active and terminationDate is defined', () => {
        const received = decorateLease({
          terminationDate: '2018-11-12',
        }).isTerminating;
        const expected = true;
        expect(received).toEqual(expected);
      });
    });

    describe('canAdjustRent', () => {
      beforeEach(() => {
        lease = {
          status: 'active',
          terminationDate: null,
        };
      });

      it('should return true when active and terminationDate is null', () => {
        const received = decorateLease(lease).canAdjustRent;
        const expected = true;
        expect(received).toEqual(expected);
      });

      it('should return false when terminationDate is defined', () => {
        const received = decorateLease({
          ...lease,
          terminationDate: 'terminationDate',
        }).canAdjustRent;
        const expected = false;
        expect(received).toEqual(expected);
      });

      it('should return false when status is not active', () => {
        const received = decorateLease({
          ...lease,
          status: null,
        }).canAdjustRent;
        const expected = false;
        expect(received).toEqual(expected);
      });
    });
  });

  describe('decorateModification', () => {
    describe('amountCents', () => {
      it('should be defined', () => {
        const received = decorateModification({
          annualRentCents: 365,
        }).amountCents;
        const expected = {
          annually: expect.any(Number),
          weekly: expect.any(Number),
          fortnightly: expect.any(Number),
          monthly: expect.any(Number),
        };

        expect(received).toEqual(expected);
      });
    });

    describe('amountDollars', () => {
      it('should be defined', () => {
        const received = decorateModification({
          annualRentCents: 365,
        }).amountDollars;
        const expected = {
          annually: expect.stringContaining('$'),
          weekly: expect.stringContaining('$'),
          fortnightly: expect.stringContaining('$'),
          monthly: expect.stringContaining('$'),
        };

        expect(received).toEqual(expected);
      });
    });

    describe('effectiveDateFormatted', () => {
      it('should be formatted', () => {
        const received = decorateModification({
          effectiveDate: '2018-11-12',
        }).effectiveDateFormatted;
        const expected = '12 Nov 2018';

        expect(received).toEqual(expected);
      });
    });
  });
});
