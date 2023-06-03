import { createSelector } from '@reduxjs/toolkit';

export const getReport = (state) => state.report;

export const getReportIsLoading = createSelector(
  getReport,
  (report) => report.isLoading
);
