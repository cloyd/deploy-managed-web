import { createSelector } from '@reduxjs/toolkit';
import camelCase from 'lodash/fp/camelCase';
import pick from 'lodash/fp/pick';
import sortBy from 'lodash/fp/sortBy';

import { fullName } from '../../utils';
import { selectProfileData } from '../profile/selectors';
import { USER_TYPES } from './constants';

export const getUser = (state, profile) => {
  const { id, role } = profile || {};
  return getUserByType(state, id, role);
};

export const getUserByType = (state, id, type) => {
  const typeKey = type ? camelCase(type) : null;
  const usersByType = state[typeKey] || {};
  return usersByType.data && usersByType.data[id] ? usersByType.data[id] : {};
};

export const getUsers = (state, type) => {
  const typeKey = type ? camelCase(type) : null;
  return state[typeKey] && state[typeKey].results
    ? state[typeKey].results.map((id) => state[typeKey].data[id])
    : [];
};

//
// Get users by type
export const getBpayBiller = (state, id) =>
  getUserByType(state, id, USER_TYPES.bpayBiller);

export const getBpayBillers = (state) => getUsers(state, USER_TYPES.bpayBiller);

const getCorporateUser = (state, id) =>
  getUserByType(state, id, USER_TYPES.corporateUser);

export const getExternalCreditor = (state, id) =>
  getUserByType(state, id, USER_TYPES.externalCreditor);

export const getExternalCreditors = (state) =>
  getUsers(state, USER_TYPES.externalCreditor);

export const getManager = (state, id) =>
  getUserByType(state, id, USER_TYPES.manager);

export const getManagers = (state) => getUsers(state, USER_TYPES.manager);

export const getOwner = (state, id) =>
  getUserByType(state, id, USER_TYPES.owner);

export const getOwners = (state) => getUsers(state, USER_TYPES.owner);

export const getOwnersFromIds = (state, ownerIds) =>
  ownerIds && ownerIds.length > 0
    ? pick(ownerIds, state[USER_TYPES.owner].data)
    : {};

export const getTenant = (state, id) =>
  getUserByType(state, id, USER_TYPES.tenant);

export const getBpayOutProviders = createSelector(
  getExternalCreditors,
  (creditors) =>
    creditors
      .filter((creditor) => creditor.bpayOutProvider)
      // Decorate with type for task form keys
      .map((creditor) => ({ ...creditor, type: 'ExternalCreditor' }))
);

export const getManagerPrimaryAgency = createSelector(
  getManager,
  (manager) => manager.agency
);

export const getUsersExcludingBpayOutProvider = createSelector(
  [getUsers],
  (users) => users.filter((user) => !user.bpayOutProvider)
);

//
// Is primary/secondary user selectors
export const isPrimaryOwner = createSelector(
  getOwner,
  (user) => !!user.id && user.isPrimaryOwner === true
);

export const isPrimaryTenant = createSelector(
  getTenant,
  (user) => !!user.id && user.isPrimaryTenant === true
);

export const isSecondaryOwner = createSelector(
  getOwner,
  (user) => !!user.id && user.isPrimaryOwner === false
);

export const isSecondaryTenant = createSelector(
  getTenant,
  (user) => !!user.id && user.isPrimaryTenant === false
);

//
// Financials selectors
export const getExternalCreditorFinancials = (state, id) => {
  const result = state.financials && state.financials[id];

  if (!result) return;

  // Sorting the completed intentions by paymentFlaggedAt
  // And pushing items with no paymentFlaggedAt at bottom
  const withPaidAtSortedIntentions = sortBy(
    'paymentFlaggedAt',
    result.taskIntentions.filter((intention) => intention.paymentFlaggedAt)
  ).reverse();

  const withoutPaidAtIntentions = result.taskIntentions.filter(
    (intention) => !intention.paymentFlaggedAt
  );

  return {
    ...result,
    taskIntentions: [...withPaidAtSortedIntentions, ...withoutPaidAtIntentions],
  };
};

export const getOwnerFinancials = (state, id) =>
  (state.financials && state.financials[id]) || {};

// Selectors that format to filters
export const getManagersAsFilters = createSelector(getManagers, (managers) =>
  managers
    .filter((manager) => manager.active)
    .map((user) => ({
      value: user.id,
      label: fullName(user),
    }))
);

export const getUserAgenciesAsFilters = (state, id) => {
  const managerAgencies =
    getCorporateUser(state, id).managerAgencies ||
    getManager(state, id).managerAgencies;

  return managerAgencies
    ? managerAgencies.map((agency) => ({
        label: agency.tradingName,
        value: agency.agencyId || agency.id,
      }))
    : [];
};

// Get property account ids
//
// params (state, userTypeId, userType)
// returns
// {
//   [propertyId]: {
//     disbursementAccountId: 1,
//     paymentBankAccountId: 2,
//     paymentCardAccountId: 3
//   }
// }
export const getUserPropertyAccountIds = createSelector(getUserByType, (user) =>
  user.properties
    ? user.properties.reduce((propertyAccountIds, accounts) => {
        const {
          id,
          disbursementAccountId,
          paymentBankAccountId,
          paymentCardAccountId,
          disbursementAccounts,
        } = accounts;

        return {
          ...propertyAccountIds,
          [id]: {
            disbursementAccountId,
            paymentBankAccountId,
            paymentCardAccountId,
            disbursementAccounts,
          },
        };
      }, {})
    : null
);

export const getUserPropertyIds = createSelector(getUserByType, (user) =>
  user.properties ? user.properties.map((p) => p.id) : []
);

const selectProfileId = createSelector(
  (state) => state.profile,
  (profile) => profile?.data?.id
);

const selectUsers = (state) => state.users;

export const selectIsUsersLoading = createSelector(
  selectUsers,
  (users) => users.isLoading
);

const selectManager = createSelector(
  selectUsers,
  (users) => users.manager.data
);

export const selectManagersAgencies = createSelector(
  [selectManager, selectProfileId],
  (manager, profileId) => {
    if (manager && profileId && manager[profileId]) {
      return manager[profileId]?.managerAgencies.map(
        (agency) => agency.agencyId
      );
    }

    return [];
  }
);

export const selectUser = createSelector(
  [selectUsers, selectProfileData],
  (user, profile) => getUser(user, profile)
);

export const selectIsSecondaryTenant = createSelector(
  [selectUsers, selectProfileData],
  (user, profile) => isSecondaryTenant(user, profile.id)
);
