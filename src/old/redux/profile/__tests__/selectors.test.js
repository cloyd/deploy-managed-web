/* eslint-disable no-undef */
import {
  canCreateLease,
  canCreateOwner,
  canCreatePayment,
  canCreateProperty,
  canCreateTenant,
  canUseBpay,
  canViewTenantContactDetails,
  getMessage,
  getProfile,
  getRole,
  getRoles,
  getRouteParams,
  getTransactionViewRole,
  isAuthorized,
  isOnboarded,
} from '..';
import { USER_TYPES } from '../../users/constants';

describe('profile/selectors', () => {
  describe('getMessage', () => {
    it('should return the message', () => {
      const received = getMessage({ message: 'message' });
      const expected = 'message';
      expect(received).toBe(expected);
    });
  });

  describe('getProfile', () => {
    it('should return the profile', () => {
      const received = getProfile({ data: 'profile' });
      const expected = 'profile';
      expect(received).toBe(expected);
    });

    it('should return an empty object when undefined', () => {
      const received = getProfile({ data: undefined });
      const expected = {};
      expect(received).toEqual(expected);
    });
  });

  describe('getRole', () => {
    it('should return the role', () => {
      const received = getRole({ data: { role: USER_TYPES.manager } });
      const expected = USER_TYPES.manager;
      expect(received).toBe(expected);
    });
  });

  describe('getRoles', () => {
    it('should return the roles', () => {
      const received = getRoles({ data: { roles: [USER_TYPES.manager] } });
      const expected = [USER_TYPES.manager];
      expect(received).toEqual(expected);
    });
  });

  describe('getRouteParams', () => {
    it('should return role', () => {
      const received = getRouteParams({
        data: { role: USER_TYPES.manager },
      }).role;
      const expected = USER_TYPES.manager;
      expect(received).toBe(expected);
    });

    it(`should return the pathname as '/' for unuathorized user`, () => {
      const received = getRouteParams({}).pathname;
      const expected = '/';
      expect(received).toBe(expected);
    });

    it(`should return the pathname as '/accept-invite' for authorized manager that hasn't onboarded`, () => {
      const received = getRouteParams({
        data: { id: 1, role: USER_TYPES.manager, isOnboarded: false },
        managers: { 1: { id: 1 } },
      }).pathname;
      const expected = '/accept-invite';
      expect(received).toBe(expected);
    });

    it(`should return the pathname as undefined for authorized manager with a payment method`, () => {
      const received = getRouteParams({
        data: {
          id: 1,
          role: USER_TYPES.manager,
          hasPaymentMethod: true,
          isOnboarded: true,
        },
      }).pathname;
      const expected = undefined;
      expect(received).toBe(expected);
    });

    it(`should return the pathname as undefined for authorized secondaryOwner without a payment method`, () => {
      const state = {
        data: {
          id: 1,
          role: USER_TYPES.owner,
          roles: [USER_TYPES.owner],
          hasPaymentMethod: false,
          isOnboarded: true,
        },
        owners: { 1: { id: 1, isPrimaryOwner: false } },
      };
      const received = getRouteParams(state).pathname;
      const expected = undefined;
      expect(received).toBe(expected);
    });
  });

  describe('getTransactionViewRole', () => {
    it('should return the owner role', () => {
      const received = getTransactionViewRole({
        data: { role: USER_TYPES.manager },
      });
      const expected = USER_TYPES.owner;
      expect(received).toBe(expected);
    });

    it('should return the tenant role', () => {
      const received = getTransactionViewRole({
        data: { role: USER_TYPES.tenant },
      });
      const expected = USER_TYPES.tenant;
      expect(received).toBe(expected);
    });

    it('should return the external creditor role', () => {
      const received = getTransactionViewRole({
        data: { role: USER_TYPES.externalCreditor },
      });
      const expected = USER_TYPES.externalCreditor;
      expect(received).toBe(expected);
    });
  });

  describe('isOnboarded', () => {
    it('should return the tenant', () => {
      const received = isOnboarded({ data: { isOnboarded: true } }, 1);
      const expected = true;
      expect(received).toBe(expected);
    });
  });

  describe('isAuthorized', () => {
    it('should return true when profile.id is defined', () => {
      const received = isAuthorized({ data: { id: 1 } });
      const expected = true;
      expect(received).toBe(expected);
    });

    it('should return false when role is empty', () => {
      const received = isAuthorized({ data: {} });
      const expected = false;
      expect(received).toBe(expected);
    });
  });

  describe('Permissions', () => {
    describe('canCreateLease', () => {
      it('should return true when role is manager', () => {
        const received = canCreateLease({
          data: { roles: [USER_TYPES.manager] },
        });
        const expected = true;
        expect(received).toBe(expected);
      });

      it('should return false for owner', () => {
        const received = canCreateLease({
          data: { roles: [USER_TYPES.owner] },
        });
        const expected = false;
        expect(received).toBe(expected);
      });

      it('should return false for tenant', () => {
        const received = canCreateLease({
          data: { roles: [USER_TYPES.tenant] },
        });
        const expected = false;
        expect(received).toBe(expected);
      });
    });

    describe('canCreateOwner', () => {
      it('should return true when role is manager', () => {
        const received = canCreateOwner({
          data: { roles: [USER_TYPES.manager] },
        });
        const expected = true;
        expect(received).toBe(expected);
      });

      it('should return false for owner', () => {
        const received = canCreateOwner({
          data: { roles: [USER_TYPES.owner] },
        });
        const expected = false;
        expect(received).toBe(expected);
      });

      it('should return false for tenant', () => {
        const received = canCreateOwner({
          data: { roles: [USER_TYPES.tenant] },
        });
        const expected = false;
        expect(received).toBe(expected);
      });
    });

    describe('canCreatePayment', () => {
      it('should return true when role is an admin_manager', () => {
        const received = canCreatePayment({
          data: { roles: [USER_TYPES.principal] },
        });
        const expected = true;
        expect(received).toBe(expected);
      });

      it('should return true for owner', () => {
        const received = canCreatePayment({
          data: { roles: [USER_TYPES.owner] },
        });
        const expected = true;
        expect(received).toBe(expected);
      });

      it('should return true for tenant', () => {
        const received = canCreatePayment({
          data: { roles: [USER_TYPES.tenant] },
        });
        const expected = true;
        expect(received).toBe(expected);
      });

      it('should return false when role is manager', () => {
        const received = canCreatePayment({
          data: { roles: [USER_TYPES.manager] },
        });
        const expected = false;
        expect(received).toBe(expected);
      });
    });

    describe('canCreateProperty', () => {
      it('should return true when role is manager', () => {
        const received = canCreateProperty({
          data: { roles: [USER_TYPES.manager] },
        });
        const expected = true;
        expect(received).toBe(expected);
      });

      it('should return false for owner', () => {
        const received = canCreateProperty({
          data: { roles: [USER_TYPES.owner] },
        });
        const expected = false;
        expect(received).toBe(expected);
      });

      it('should return false for tenant', () => {
        const received = canCreateProperty({
          data: { roles: [USER_TYPES.tenant] },
        });
        const expected = false;
        expect(received).toBe(expected);
      });
    });

    describe('canCreateTenant', () => {
      it('should return true when role is manager', () => {
        const received = canCreateTenant({
          data: { roles: [USER_TYPES.manager] },
        });
        const expected = true;
        expect(received).toBe(expected);
      });

      it('should return false for owner', () => {
        const received = canCreateTenant({
          data: { roles: [USER_TYPES.owner] },
        });
        const expected = false;
        expect(received).toBe(expected);
      });

      it('should return false for tenant', () => {
        const received = canCreateTenant({
          data: { roles: [USER_TYPES.tenant] },
        });
        const expected = false;
        expect(received).toBe(expected);
      });
    });

    describe('canUseBpay', () => {
      it('should return false for owner', () => {
        const received = canUseBpay({ data: { roles: [USER_TYPES.owner] } });
        const expected = false;
        expect(received).toBe(expected);
      });

      it('should return false for manager', () => {
        const received = canUseBpay({ data: { roles: [USER_TYPES.manager] } });
        const expected = false;
        expect(received).toBe(expected);
      });
    });

    describe('canViewTenantContactDetails', () => {
      const subject = (role) =>
        canViewTenantContactDetails({
          data: { roles: [role] },
        });

      it('should return false for owner', () => {
        const received = subject(USER_TYPES.owner);
        const expected = false;
        expect(received).toBe(expected);
      });

      it('should return true for manager', () => {
        const received = subject(USER_TYPES.manager);
        const expected = true;
        expect(received).toBe(expected);
      });

      it('should return true for tenant', () => {
        const received = subject(USER_TYPES.tenant);
        const expected = true;
        expect(received).toBe(expected);
      });
    });
  });
});
