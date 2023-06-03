import { createSelector } from '@reduxjs/toolkit';

export const getNotifier = (state) => state.notifier;

export const hasError = createSelector(
  getNotifier,
  ({ isAlert, color }) => isAlert && color === 'danger'
);

export const hasWarning = createSelector(
  getNotifier,
  ({ isAlert, color }) => isAlert && color === 'warning'
);

export const selectNotifier = (state) => state.notifier;
