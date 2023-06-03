import flow from 'lodash/fp/flow';
import { createLogic } from 'redux-logic';

import {
  getDataWithProps,
  processDeleteWithProps,
  processError,
  processGetWithProps,
  processPostWithProps,
  processPutWithProps,
  processSuccess,
} from '../helpers/logic';
import { USER_TYPES } from './constants';
import { getEndpointType, getRansackParamsByUserType } from './helpers';
import users from './reducer';

const {
  create,
  createSuccess,
  destroy,
  destroySuccess,
  emailFinancials,
  emailFinancialsSuccess,
  error,
  fetch,
  fetchAll,
  fetchAllSuccess,
  fetchFinancials,
  fetchFinancialsSuccess,
  fetchSuccess,
  sendInvite,
  sendInviteSuccess,
  update,
  updateMarketplaceSetting,
  updateSuccess,
  createVirtualAccount,
  createVirtualAccountSuccess,
} = users.actions;

// Ransack query objects
export const ransackUsers = (props) => {
  const {
    agencyId,
    bpayOutProvider,
    managerId,
    ownerIds,
    search,
    searchData,
    tagId,
    type,
    typeOf,
    ...otherProps
  } = props;

  const initialParams = { ...searchData, ...otherProps };
  const params = getRansackParamsByUserType(type, search, initialParams);

  if (agencyId) {
    params['q[propertiesAgencyIdEq]'] = agencyId;
  }

  if (managerId) {
    params['q[propertiesManagerIdEq]'] = managerId;
  }

  if (bpayOutProvider) {
    params['q[bpayOutProviderEq]'] = bpayOutProvider;
  }

  if (tagId) {
    params['q[tagsIdIn]'] = tagId;
  }

  if (typeOf) {
    params['q[typeOfIn]'] = typeOf;
  }

  if (type === 'owners' && ownerIds) {
    params['q[idIn]'] = ownerIds;
  }

  return params;
};

// Transform action
const transformUser =
  (options = {}) =>
  ({ action }, next, reject) => {
    const { id, role, type, ...params } = action.payload;
    const userType = getEndpointType(type || role);
    const endpoint = id ? `/${userType}/${id}` : `/${userType}`;

    if (userType) {
      next({
        type: action.type,
        payload: {
          endpoint,
          params,
          props: { type: type || role, ...options },
        },
      });
    } else {
      reject(error({ message: 'user type is required' }));
    }
  };

const transformUsers =
  (options = {}) =>
  ({ action }, next, reject) => {
    const { role, type, ...params } = action.payload;
    const userType = getEndpointType(type || role);

    if (type) {
      next({
        type: action.type,
        payload: {
          endpoint: `/${userType}`,
          params: ransackUsers({ type: type || role, ...params }),
          props: { type: type || role, ...options },
        },
      });
    } else {
      reject(error({ message: 'user type is required' }));
    }
  };

//
// Logic actions
export const createUserLogic = createLogic({
  type: create,
  processOptions: {
    successType: createSuccess,
    failType: error,
  },
  transform: transformUser({
    isRedirect: true,
    message: 'User has been created.',
  }),
  process: flow(processPostWithProps, getDataWithProps),
});

export const createVirtualAccountLogic = createLogic({
  type: createVirtualAccount,
  processOptions: {
    successType: createVirtualAccountSuccess,
    failType: error,
  },
  transform: ({ action }, next) => {
    const { tenantId } = action.payload;
    const endpoint = `/tenants/${tenantId}/promisepay_virtual_accounts`;
    next({
      type: action.type,
      payload: {
        endpoint,
        props: { type: USER_TYPES.tenant },
      },
    });
  },
  process: flow(processPostWithProps, getDataWithProps),
});

export const destroyUserLogic = createLogic({
  type: destroy,
  processOptions: {
    successType: destroySuccess,
    failType: error,
  },
  transform: transformUser({
    message: 'User has been deleted.',
  }),
  process: flow(processDeleteWithProps, getDataWithProps),
});

export const emailFinancialsLogic = createLogic({
  type: emailFinancials,
  processOptions: {
    successType: emailFinancialsSuccess,
    failType: error,
  },
  transform: ({ action }, next, reject) => {
    const { endsAt, id, role, type, startsAt } = action.payload;
    const userType = getEndpointType(type || role);

    if (userType && id) {
      next({
        type: action.type,
        payload: {
          endpoint: `/${userType}/${id}/email-financials`,
          params: {
            paidAtGteq: startsAt,
            paidAtLteq: endsAt,
          },
        },
      });
    } else {
      reject(error({ message: 'user type is required' }));
    }
  },
  process: flow(processGetWithProps, getDataWithProps),
});

export const errorMessageLogic = createLogic({
  type: [error],
  process: flow(processError),
});

export const fetchAllLogic = createLogic({
  type: fetchAll,
  debounce: 100,
  processOptions: {
    successType: fetchAllSuccess,
    failType: error,
  },
  transform: transformUsers(),
  process: flow(processGetWithProps, getDataWithProps),
});

export const fetchFinancialsLogic = createLogic({
  type: fetchFinancials,
  processOptions: {
    successType: fetchFinancialsSuccess,
    failType: error,
  },
  transform: ({ action }, next, reject) => {
    const { endsAt, format, id, role, type, startsAt } = action.payload;
    const userType = getEndpointType(type || role);
    const endpoint = format
      ? `/${userType}/${id}/financials.${format}`
      : `/${userType}/${id}/financials`;

    if (userType && id) {
      next({
        type: action.type,
        payload: {
          endpoint,
          params: {
            paidAtGteq: startsAt,
            paidAtLteq: endsAt,
          },
          props: { userId: id },
        },
      });
    } else {
      reject(error({ message: 'user type and id is required' }));
    }
  },
  process: flow(processGetWithProps, getDataWithProps),
});

export const fetchLogic = createLogic({
  type: fetch,
  processOptions: {
    successType: fetchSuccess,
    failType: error,
  },
  transform: transformUser(),
  process: flow(processGetWithProps, getDataWithProps),
});

export const sendInviteLogic = createLogic({
  type: sendInvite,
  processOptions: {
    successType: sendInviteSuccess,
    failType: error,
  },
  transform: ({ action }, next, reject) => {
    const { id, role, type, ...params } = action.payload;
    const userType = getEndpointType(type || role);
    const endpoint = id
      ? `/${userType}/${id}/send-invite`
      : `/${userType}/send-invite`;

    if (userType) {
      const message = params.email
        ? `Invite has been sent to ${params.email}`
        : 'Invite has been sent.';

      next({
        type: action.type,
        payload: {
          endpoint,
          params,
          props: { type: type || role, message },
        },
      });
    } else {
      reject(error({ message: 'user type is required' }));
    }
  },
  process: flow(processPostWithProps, getDataWithProps),
});

export const successMessageLogic = createLogic({
  type: [
    createSuccess,
    fetchSuccess,
    fetchAllSuccess,
    sendInviteSuccess,
    updateSuccess,
  ],
  process: flow(processSuccess),
});

export const updateUserLogic = createLogic({
  type: update,
  processOptions: {
    successType: updateSuccess,
    failType: error,
  },
  transform: transformUser({
    message: 'User has been updated.',
  }),
  process: flow(processPutWithProps, getDataWithProps),
});

export const updateMarketplaceSettingLogic = createLogic({
  type: updateMarketplaceSetting,
  processOptions: {
    successType: updateSuccess,
    failType: error,
  },
  transform: ({ action }, next, reject) => {
    const { id, params } = action.payload;
    const userType = getEndpointType(USER_TYPES.externalCreditor);

    if (id) {
      next({
        type: action.type,
        payload: {
          endpoint: `/${userType}/${id}/marketplace-settings`,
          params,
          props: {
            type: USER_TYPES.externalCreditor,
            message: 'Marketplace settings have been updated.',
          },
        },
      });
    } else {
      reject(error({ message: 'tradie id is required' }));
    }
  },
  process: flow(processPutWithProps, getDataWithProps),
});
