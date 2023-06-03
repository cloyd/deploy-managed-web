import { reducer } from './reducer';

export default reducer;
export { initialState } from './reducer';
export { logic } from './logic';
export { decorateProperty } from './decorators';

// Actions
export {
  createProperty,
  destroyProperty,
  archiveProperty,
  fetchProperty,
  fetchProperties,
  fetchPropertyFinancials,
  resetPropertyResults,
  updateProperty,
  updatePropertyAttachments,
  resetProperty,
  unarchiveProperty,
  fetchPropertyTransactions,
  fetchPropertyFeeAudits,
} from './actions';

// Constants
export {
  AUSTRALIA_STATES_TERRITORIES,
  FEE_UNITS,
  PROPERTY_ASPECTS,
  PROPERTY_GAIN_REASON,
  PROPERTY_INCLUSIONS,
  PROPERTY_LOST_REASON,
  PROPERTY_SPACES,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  PROPERTY_CATEGORIES,
  COMMERCIAL_PROPERTY_CATEGORIES,
  DURATIONS,
} from './constants';

// Helpers
export {
  isActive,
  isCancelled,
  isDraft,
  isPendingActivate,
  isPendingClearance,
} from './helpers';

// Selectors
export {
  canAccessASingleProperty,
  getLatestProperty,
  getOwnerIds,
  getProperty,
  getProperties,
  getPropertiesFromIds,
  getPropertyFinancials,
  getPropertyInclusions,
  getPropertyList,
  getPropertyLoanParams,
  getPropertyOwnership,
  getPropertyOwnershipsFromId,
  getPropertyOwnershipsFromIds,
  hasPositiveOwnershipSplit,
  getPropertyPrimaryManager,
  getPropertyTransactions,
  getPropertyFeeAudits,
  selectProperties,
  selectIsPropertyLoading,
  selectPropertyData,
} from './selectors';
