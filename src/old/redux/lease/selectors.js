import { createSelector } from 'reselect';

import { daysBetween } from '../../utils';

const isActive = ({ isActive }) => isActive;
const isExpired = ({ isExpired }) => isExpired;
const isPending = ({ isPending }) => isPending;
const isDraft = ({ isDraft }) => isDraft;
const isActivating = ({ isActivating }) => isActivating;

export const getLeases = (state) =>
  Object.keys(state.leases).map((key) => state.leases[key]);

export const getLeasesByProperty = (
  state,
  propertyId,
  orderDescending = false
) => {
  const leases = getLeases(state).filter(
    (lease) => lease.propertyId === propertyId
  );

  return orderDescending ? leases.sort((a, b) => b.id - a.id) : leases;
};

const getLeasesByPropertyWithFallback = (state, propertyId) =>
  propertyId ? getLeasesByProperty(state, propertyId) : getLeases(state);

export const getLease = (state, id) => {
  return state.leases[id] || {};
};

export const getLeaseActive = (state, propertyId) => {
  const leases = getLeasesByPropertyWithFallback(state, propertyId);
  return leases.find(isActive) || leases.find(isActivating) || {};
};

export const getLeaseUpcoming = (state, propertyId) => {
  const leases = getLeasesByPropertyWithFallback(state, propertyId);
  return leases.find(isPending) || leases.find(isDraft) || {};
};

export const getLeaseActiveOrUpcoming = (state, propertyId) => {
  const leases = getLeasesByPropertyWithFallback(state, propertyId);

  return (
    leases.find(isActive) ||
    leases.find(isPending) ||
    leases.find(isDraft) ||
    {}
  );
};

export const getLeasesExpired = (state, propertyId) =>
  getLeasesByProperty(state, propertyId).filter(isExpired);

export const getLeasesExpiredByDaysAgo = (state, propertyId, daysAgo = 0) => {
  const leases = getLeasesExpired(state, propertyId);

  return leases.filter(
    (lease) => -daysAgo <= daysBetween(new Date(lease.terminationDate))
  );
};

export const getLeaseModifications = (state, leaseId) =>
  state.modifications[leaseId] || [];

export const getLeaseActivationTasks = (state, leaseId) =>
  state.leaseItems[leaseId] || [];

const getLeaseState = (state) => state.lease;

export const selectIsLeaseLoading = createSelector(
  getLeaseState,
  (lease) => lease.isLoading
);

export const selectLeaseLog = createSelector(
  getLeaseState,
  (lease) => lease.logs
);

export const selectLeases = createSelector(
  getLeaseState,
  ({ leases, results }) =>
    Object.keys(leases)
      .map((key) => leases[key])
      .filter(({ id }) => results.includes(id))
);
