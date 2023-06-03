import {
  createUserLogic,
  createVirtualAccountLogic,
  destroyUserLogic,
  emailFinancialsLogic,
  errorMessageLogic,
  fetchAllLogic,
  fetchFinancialsLogic,
  fetchLogic,
  sendInviteLogic,
  successMessageLogic,
  updateMarketplaceSettingLogic,
  updateUserLogic,
} from './logic';
import users from './reducer';

// Logic
export const usersLogic = [
  createUserLogic,
  destroyUserLogic,
  emailFinancialsLogic,
  errorMessageLogic,
  fetchAllLogic,
  fetchFinancialsLogic,
  fetchLogic,
  sendInviteLogic,
  successMessageLogic,
  updateMarketplaceSettingLogic,
  updateUserLogic,
  createVirtualAccountLogic,
];

// Actions
export {
  createCreditor,
  createServiceProvider,
  createUser,
  createVirtualAccount,
  destroyUser,
  emailOwnerFinancials,
  fetchBpayBiller,
  fetchBpayOutProviders,
  fetchExternalCreditor,
  fetchExternalCreditorFinancials,
  fetchExternalCreditors,
  fetchManager,
  fetchManagers,
  fetchOwner,
  fetchOwnerFinancials,
  fetchOwners,
  fetchServiceProvider,
  fetchServiceProviders,
  fetchTenant,
  fetchTradies,
  fetchUser,
  fetchUsers,
  sendInvite,
  updateCreditor,
  updateMarketplaceSetting,
  updateUser,
} from './actions';

// Selectors
export {
  getBpayBiller,
  getBpayBillers,
  getBpayOutProviders,
  getExternalCreditor,
  getExternalCreditorFinancials,
  getExternalCreditors,
  getManager,
  getManagerPrimaryAgency,
  getManagers,
  getManagersAsFilters,
  getOwner,
  getOwnerFinancials,
  getOwners,
  getOwnersFromIds,
  getUser,
  getTenant,
  getUserAgenciesAsFilters,
  getUserByType,
  getUserPropertyAccountIds,
  getUserPropertyIds,
  getUsers,
  getUsersExcludingBpayOutProvider,
  isPrimaryOwner,
  isPrimaryTenant,
  isSecondaryOwner,
  isSecondaryTenant,
  selectIsUsersLoading,
  selectManagersAgencies,
  selectUser,
  selectIsSecondaryTenant,
} from './selectors';

// Constants
export {
  EXTERNAL_CREDITOR_CLASSIFICATIONS,
  EXTERNAL_CREDITOR_TYPES,
  MARKETPLACE_FEE_OPTIONS,
  USER_TYPES,
  VISIBILITY_TYPES,
} from './constants';

// Helpers
export { getEndpointType, getRansackParamsByUserType } from './helpers';

// Reducer
export default users.reducer;
