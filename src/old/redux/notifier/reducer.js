import { createSlice } from '@reduxjs/toolkit';
import pick from 'lodash/fp/pick';

import { isLoading, reset } from '../helpers/reducer';

export const initialState = {
  isAlert: false,
  isLoading: false,
  isRedirect: false,
  isScroll: true,
  id: null,
  message: null,
  color: 'success',
};

const formatAlertPayload = (payload) => {
  return typeof payload === 'string' ? { message: payload } : payload;
};

const showAlert = (state, action) => {
  const params = pick(
    ['isRedirect', 'isScroll', 'message', 'color'],
    formatAlertPayload(action.payload)
  );

  return {
    ...state,
    ...params,
    isAlert: true,
    id: new Date().valueOf(),
  };
};

const showAlertWithColor = (color) => (state, action) => {
  const payload = {
    ...formatAlertPayload(action.payload),
    color,
  };

  return showAlert(state, { ...action, payload });
};

const showError = showAlertWithColor('danger');
const showSuccess = showAlertWithColor('success');
const showWarning = showAlertWithColor('warning');

const hideAlert = (state) => {
  return {
    ...initialState,
    isLoading: state.isLoading,
  };
};

const hideLoading = (state) => {
  state.isLoading = false;
};

const resetIsRedirect = (state) => {
  state.isRedirect = false;
};

export default createSlice({
  name: 'notifier',
  initialState,
  reducers: {
    hideAlert,
    hideLoading,
    resetIsRedirect,
    showAlert,
    showError,
    showSuccess,
    showWarning,
    showLoading: isLoading(true),
    reset: reset(initialState),
  },
});
