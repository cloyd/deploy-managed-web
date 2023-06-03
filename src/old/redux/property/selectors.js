import { createSelector } from 'reselect';

import { propertyAddressString } from './helpers';

export const canAccessASingleProperty = (state) =>
  !!(state.data && Object.keys(state.data).length === 1);

export const getProperty = (state, id) => {
  return state.data[id] || {};
};

export const getProperties = (state) => {
  try {
    return state.results.map((id) => getProperty(state, id));
  } catch (e) {
    return [];
  }
};

export const hasPositiveOwnershipSplit = (state, { ownerId, propertyIds }) => {
  if (!ownerId || !propertyIds || propertyIds.length === 0) {
    return false;
  }

  const ownerships = getPropertyOwnershipsFromIds(state, propertyIds);

  return Object.values(ownerships).some(
    (ownership) => ownership[ownerId]?.percentageSplit > 0
  );
};

export const getPropertyLoanParams = (state, id, provider = 'possibl') => {
  const property = getProperty(state, id);
  if (!property.id) return {};

  const manager = getPropertyPrimaryManager(state, id);

  return {
    managedCustomerId: property.id,
    email: property.primaryOwner.email,
    firstName: property.primaryOwner.firstName,
    lastName: property.primaryOwner.lastName,
    propertyAddressLine1: property.address.street,
    city: property.address.city,
    state: property.address.state,
    postCode: property.address.postcode,
    propertyManagerFirstName: manager?.firstName,
    propertyManagerLastName: manager?.lastName,
    propertyManagerEmail: manager?.email,
  };
};

export const getPropertyOwnership = (state, { propertyId, ownerId }) => {
  const property = getProperty(state, propertyId);
  const { primaryOwner, secondaryOwners } = property;

  const owner =
    primaryOwner &&
    secondaryOwners &&
    [primaryOwner, ...secondaryOwners].find((owner) => owner.id === ownerId);

  return owner ? owner.ownership : {};
};

export const getPropertyPrimaryManager = (state, id) => {
  const property = getProperty(state, id);
  return property.managers?.find(({ id }) => property.managerId === id) || {};
};

export const getPropertyTransactions = (state, id) =>
  (state.transactions && state.transactions[id]) || [];

export const getPropertyFeeAudits = (state, id) => {
  return (state.audits && state.audits[id] && state.audits[id]['audits']) || [];
};

export const getOwnerIds = (state, propertyIds = []) =>
  propertyIds.reduce((memo, propertyId) => {
    const property = getProperty(state, propertyId);
    const { primaryOwner, secondaryOwners } = property;
    const ids = [...memo];

    if (primaryOwner) {
      ids.push(primaryOwner.id);
    }

    if (secondaryOwners) {
      secondaryOwners.forEach((owner) => ids.push(owner.id));
    }

    return [...new Set(ids)];
  }, []);

export const getPropertyOwnershipsFromId = (state, propertyId) => {
  const property = getProperty(state, propertyId);
  const { primaryOwner, secondaryOwners } = property;

  let result = {};

  if (primaryOwner) {
    result[primaryOwner.id] = primaryOwner.ownership;
  }

  if (secondaryOwners && secondaryOwners.length > 0) {
    secondaryOwners.forEach((owner) => (result[owner.id] = owner.ownership));
  }

  return result;
};

export const getPropertyOwnershipsFromIds = (state, propertyIds) => {
  let ownerships = {};

  (propertyIds || []).forEach((id) => {
    if (id) {
      ownerships[id] = getPropertyOwnershipsFromId(state, id);
    }
  });

  return ownerships;
};

export const getPropertiesFromIds = (state, propertyIds) => {
  let properties = {};

  (propertyIds || []).forEach((id) => {
    if (id) {
      properties[id] = getProperty(state, id);
    }
  });

  return properties;
};

export const getPropertyFinancials = (state, id) => {
  return state.financials && state.financials[id];
};

export const getLatestProperty = (state) => {
  return getProperties(state).shift();
};

export const getPropertyList = (state) => {
  return getProperties(state).map((property) => ({
    label: propertyAddressString(property.address),
    value: property.id,
  }));
};

export const getPropertyInclusions = (state, id) => {
  const { inclusions } = getProperty(state, id);
  const hasInclusion = (inclusion) => inclusion.value === true;
  return inclusions ? inclusions.filter(hasInclusion) : [];
};

export const getPropertiesRansackParams = () => {
  return {
    manager_id: 'eq',
    agency_id: 'cont',
    address_street: 'matches',
    sorts: '',
  };
};

// selectors

const selectProperty = (state) => state.property;
export const selectPropertyResults = createSelector(
  [selectProperty],
  (property) => property.results
);
export const selectPropertyData = createSelector(
  selectProperty,
  (property) => property.data
);
export const selectProperties = createSelector(
  [selectPropertyResults, selectPropertyData],
  (results, data) => results.map((id) => data[id] || {})
);

export const selectIsPropertyLoading = createSelector(
  selectProperty,
  (property) => property.isLoading
);
