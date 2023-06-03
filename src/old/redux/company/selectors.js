import upperFirst from 'lodash/fp/upperFirst';
import { createSelector } from 'reselect';

export const getCompany = (state, type, ownerId) => {
  const ownerType = upperFirst(type);

  return (
    (state[ownerType] && state[ownerType][ownerId]) || { ownerType, ownerId }
  );
};

export const getOwnerCompany = (state, ownerId) => {
  return getCompany(state, 'Owner', ownerId);
};

export const getAgencyCompany = (state, agentId) => {
  return getCompany(state, 'Agency', agentId);
};

const getCompanyState = (state) => state.company;

export const selectCompanyIsLoading = createSelector(
  getCompanyState,
  (agency) => agency.isLoading
);
