import { createSelector } from '@reduxjs/toolkit';

import { USER_TYPES } from '../users/constants';

export const getMessage = (state) => state.message;

export const getProfile = (state) => state.data || {};

export const getRole = (state) => getProfile(state).role;

export const getRoles = (state) => getProfile(state).roles || [];

// Set path to accept-invite if a user hasn't setup a payment method
export const getRouteParams = (state) => ({
  role: getRole(state),
  roles: getRoles(state),
  pathname: isAuthorized(state)
    ? isOnboarded(state)
      ? undefined
      : '/accept-invite'
    : '/',
});

export const getTransactionViewRole = (state) => {
  const role = getRole(state);

  switch (role) {
    case USER_TYPES.tenant:
    case USER_TYPES.externalCreditor:
      return role;

    default:
      return USER_TYPES.owner;
  }
};

export const getUserFingerprint = (state) => {
  const { id, role } = getProfile(state);
  return `${role}:${id}`;
};

export const hasPaymentMethod = (state) =>
  getProfile(state).hasPaymentMethod || false;

export const isAuthorized = (state) => !!getProfile(state).id;

export const isDebtor = (state, task = {}) => {
  const { id, role } = getProfile(state);
  const { invoice } = task;

  return !!(
    invoice &&
    id === invoice.debtorId &&
    role === invoice.debtorType.toLowerCase()
  );
};

export const isOnboarded = (state) => getProfile(state).isOnboarded;

const isRoleSelector = (value) =>
  createSelector(getRoles, (roles) => roles.indexOf(value) > -1);

export const isPrincipal = isRoleSelector(USER_TYPES.principal);
export const isManager = isRoleSelector(USER_TYPES.manager);
export const isCorporateUser = isRoleSelector(USER_TYPES.corporateUser);
export const isOwner = isRoleSelector(USER_TYPES.owner);
export const isTenant = isRoleSelector(USER_TYPES.tenant);

const getPermissions = (state) => {
  return {
    canApplyCredit: isManager(state) || isPrincipal(state),
    canCreateLease: isManager(state),
    canCreateOwner: isManager(state),
    canCreatePayment: isPrincipal(state) || isTenant(state) || isOwner(state),
    canCreateProperty: isManager(state),
    canCreateTenant: isManager(state),
    canDisbursePayment: isPrincipal(state) || isOwner(state),
    canUseBpay: false, // isTenant(state)
    canViewTenantContactDetails: !isOwner(state),
  };
};

const hasPermissionSelector = (value) =>
  createSelector(getPermissions, (permissions) => permissions[value]);

export const canApplyCredit = hasPermissionSelector('canApplyCredit');
export const canCreateLease = hasPermissionSelector('canCreateLease');
export const canCreateOwner = hasPermissionSelector('canCreateOwner');
export const canCreatePayment = hasPermissionSelector('canCreatePayment');
export const canCreateProperty = hasPermissionSelector('canCreateProperty');
export const canCreateTenant = hasPermissionSelector('canCreateTenant');
export const canDisbursePayment = hasPermissionSelector('canDisbursePayment');
export const canUseBpay = hasPermissionSelector('canUseBpay');
export const canViewTenantContactDetails = hasPermissionSelector(
  'canViewTenantContactDetails'
);

// This requires state from profile & users
export const canManagePlans = createSelector(
  (state = {}) => {
    return [state.profile, state.users];
  },
  ([profile, users]) => {
    if (isCorporateUser(profile)) {
      return true;
    }

    if (isPrincipal(profile)) {
      const { allowedAgencies } = users.manager?.data[profile.data.id] || {};
      return allowedAgencies?.length === 0;
    }

    return false;
  }
);

// selectors

const selectProfile = (state) => state.profile;

export const selectIsProfileLoading = createSelector(
  selectProfile,
  (profile) => profile.isLoading
);

export const selectProfileData = createSelector(
  selectProfile,
  (profile) => profile.data
);

export const selectUserFingerprint = createSelector(selectProfile, (profile) =>
  getUserFingerprint(profile)
);

export const selectProfileRole = createSelector(
  selectProfileData,
  (profile) => profile.role
);

export const selectProfilePhoneNumber = createSelector(
  selectProfileData,
  (profile) => profile.phoneNumber
);

export const selectProfileEmail = createSelector(
  selectProfileData,
  (profile) => profile.email
);

export const selectIsInvalidPhoneNumber = createSelector(
  selectIsProfileLoading,
  selectProfilePhoneNumber,
  (isLoading, profilePhoneNumber) =>
    !isLoading && (!profilePhoneNumber || profilePhoneNumber === '0')
);
