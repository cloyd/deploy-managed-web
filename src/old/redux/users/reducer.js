import { createSlice } from '@reduxjs/toolkit';
import camelCase from 'lodash/fp/camelCase';
import keyBy from 'lodash/fp/keyBy';
import merge from 'lodash/fp/merge';
import { singular } from 'pluralize';

import { isLoading } from '../helpers/reducer';

export const initialState = {
  bpayBiller: { data: {}, results: [] },
  corporateUser: { data: {}, results: [] },
  externalCreditor: { data: {}, results: [] },
  financials: {},
  isLoading: false,
  manager: { data: {}, results: [] },
  owner: { data: {}, results: [] },
  result: null,
  tenant: { data: {}, results: [] },
};

const createSuccess = (state, action) => {
  const { data, props } = action.payload || {};
  const type = camelCase(props.type);
  const userData = data[singular(type)] || {};

  return merge(state, {
    isLoading: false,
    result: userData.id,
    [type]: { data: keyBy('id', [userData]), results: [userData.id] },
  });
};

const destroySuccess = (state, action) => {
  const { props } = action.payload || {};
  const { id, type } = props;
  const { data, results } = state[type];
  const { [id]: deleted, ...newData } = data;

  return {
    ...state,
    isLoading: false,
    result: null,
    [type]: {
      ...state[type],
      data: newData,
      results: (results || []).filter((resultId) => resultId !== id),
    },
  };
};

const emailFinancialsSuccess = (state, action) => {
  return merge(state, {
    isLoading: false,
    result: null,
    financials: {
      reportMailerTriggered: action.payload,
    },
  });
};

const fetchAllSuccess = (state, action) => {
  const { data, props } = action.payload || {};
  const type = camelCase(singular(props.type));
  const userData = keyBy('id', data);
  const mergedData = merge({ ...state[type].data }, userData);
  const distinctResults = new Set((data || []).map((user) => user.id));

  return {
    ...state,
    isLoading: false,
    result: null,
    [type]: {
      data: mergedData,
      results: [...distinctResults],
    },
  };
};

const fetchFinancialsSuccess = (state, action) => {
  const { payload } = action || {};
  const { data, props } = payload;

  return {
    ...state,
    isLoading: false,
    financials: { ...state.financials, [props.userId]: data },
    result: null,
  };
};

const fetchSuccess = (state, action) => {
  const { data, props } = action.payload || {};
  const type = camelCase(singular(props.type));
  const userData = data[type] || data || {};

  return merge(state, {
    isLoading: false,
    result: null,
    [type]: { data: keyBy('id', [userData]) },
  });
};

const sendInviteSuccess = (state, action) => {
  const { data, props } = action.payload || {};
  const type = camelCase(props.type);
  const userData = data[singular(type)];
  let updatedData = {};

  if (userData) {
    updatedData = {
      result: userData.id,
      [type]: { data: keyBy('id', [userData]) },
    };
  }

  return merge(state, {
    ...updatedData,
    isLoading: false,
  });
};

const updateSuccess = (state, action) => {
  const { data, props } = action.payload || {};
  const type = camelCase(singular(props.type));
  const userData = data[type] || data || {};

  return merge(state, {
    isLoading: false,
    result: null,
    [type]: {
      data: { [userData.id]: userData },
    },
  });
};

const createVirtualAccountSuccess = (state, action) => {
  // This is similar to updateSuccess but the only difference is we wont show the message "User has been updated".So keeping this separate.
  const { data, props } = action.payload || {};
  const type = camelCase(singular(props.type));
  const userData = data[type] || data || {};

  return merge(state, {
    isLoading: false,
    result: null,
    [type]: {
      data: { [userData.id]: userData },
    },
  });
};

export default createSlice({
  name: 'users',
  initialState,
  reducers: {
    create: isLoading(true),
    createSuccess,
    destroy: isLoading(true),
    destroySuccess,
    emailFinancials: isLoading(true),
    emailFinancialsSuccess,
    error: isLoading(false),
    fetch: isLoading(true),
    fetchAll: isLoading(true),
    fetchAllSuccess,
    fetchFinancials: isLoading(true),
    fetchFinancialsSuccess,
    fetchSuccess,
    sendInvite: isLoading(true),
    sendInviteSuccess,
    update: isLoading(true),
    updateMarketplaceSetting: isLoading(true),
    updateSuccess,
    createVirtualAccount: isLoading(true),
    createVirtualAccountSuccess,
  },
});
