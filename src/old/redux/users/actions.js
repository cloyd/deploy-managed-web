import { EXTERNAL_CREDITOR_CLASSIFICATIONS, USER_TYPES } from './constants';
import users from './reducer';

export const destroyUser = users.actions.destroy;

/**
 * Create user actions
 */
export const createUser = users.actions.create;

export const createCreditor = (params) =>
  createUser({ ...params, type: USER_TYPES.externalCreditor });

export const createServiceProvider = (params) =>
  createUser({
    ...params,
    type: USER_TYPES.externalCreditor,
    classification: EXTERNAL_CREDITOR_CLASSIFICATIONS.serviceProvider,
  });

export const createVirtualAccount = users.actions.createVirtualAccount;

/**
 * Update user actions
 */
export const updateUser = users.actions.update;

export const updateCreditor = (params) =>
  updateUser({ ...params, type: USER_TYPES.externalCreditor });

/**
 * Fetch user actions
 */
export const fetchUser = users.actions.fetch;

export const fetchUsers = users.actions.fetchAll;

export const fetchBpayBiller = ({ id, ...params }) =>
  fetchUser({ ...params, id, type: USER_TYPES.bpayBiller });

export const fetchBpayOutProviders = (params) =>
  fetchUsers({
    ...params,
    bpayOutProvider: true,
    type: USER_TYPES.externalCreditor,
  });

export const fetchExternalCreditor = ({ id, ...params }) =>
  fetchUser({ ...params, id, type: USER_TYPES.externalCreditor });

export const fetchExternalCreditors = (params) =>
  fetchUsers({ ...params, type: USER_TYPES.externalCreditor });

export const fetchManager = ({ id, ...params }) =>
  fetchUser({ ...params, id, type: USER_TYPES.manager });

export const fetchManagers = (params) =>
  fetchUsers({ ...params, type: USER_TYPES.manager });

export const fetchOwner = ({ ownerId, ...params }) =>
  fetchUser({ ...params, id: ownerId, type: USER_TYPES.owner });

export const fetchOwners = (params) =>
  fetchUsers({ ...params, type: USER_TYPES.owner });

export const fetchServiceProvider = (params) =>
  fetchUser({
    ...params,
    type: USER_TYPES.externalCreditor,
    classification: EXTERNAL_CREDITOR_CLASSIFICATIONS.serviceProvider,
  });

export const fetchServiceProviders = (params) =>
  fetchUsers({
    ...params,
    type: USER_TYPES.externalCreditor,
    classification: EXTERNAL_CREDITOR_CLASSIFICATIONS.serviceProvider,
  });

export const fetchTenant = ({ tenantId, ...params }) =>
  fetchUser({ ...params, id: tenantId, type: USER_TYPES.tenant });

export const fetchTradies = (params) =>
  fetchUsers({
    ...params,
    type: USER_TYPES.externalCreditor,
    classification: EXTERNAL_CREDITOR_CLASSIFICATIONS.tradie,
  });

/**
 * Fetch financials actions
 */
const fetchFinancials = users.actions.fetchFinancials;

export const fetchExternalCreditorFinancials = (params) =>
  fetchFinancials({ ...params, type: USER_TYPES.externalCreditor });

export const fetchOwnerFinancials = ({ ownerId, ...params }) =>
  fetchFinancials({ ...params, id: ownerId, type: USER_TYPES.owner });

/**
 * Email financials actions
 */
const emailFinancials = users.actions.emailFinancials;

export const emailOwnerFinancials = ({ ownerId, ...params }) =>
  emailFinancials({ ...params, id: ownerId, type: USER_TYPES.owner });

/**
 * Send invite actions
 */
export const sendInvite = ({ role, user }) =>
  users.actions.sendInvite({ id: user.id, role });

/**
 * Update marketplace setting actions
 */
export const updateMarketplaceSetting = (id, params) =>
  users.actions.updateMarketplaceSetting({ id, params });
