import {
  exportArrearsCSVLogic,
  exportCSVSuccessLogic,
  exportDataPropertyCSVLogic,
  exportExpensesCSVLogic,
  exportLeaseCSVLogic,
  exportManagementCSVLogic,
  exportManagerCSVLogic,
  exportPropertyCSVLogic,
  exportRentCSVLogic,
  exportRevenueCSVLogic,
  exportTaskCSVLogic,
  fetchAggregateExpensesLogic,
  fetchAggregateLogic,
  fetchDataLogic,
  fetchEfficiencyLogic,
  fetchLeasesDetailLogic,
  fetchManagementLogic,
  fetchManagementsDetailLogic,
  fetchManagersDetailLogic,
  fetchOverviewLogic,
  fetchPropertiesDetailLogic,
  fetchRentLogic,
  fetchTaskLogic,
  fetchTasksDetailLogic,
} from './logic';
import report from './reducer';

// Logic
export const reportLogic = [
  exportArrearsCSVLogic,
  exportLeaseCSVLogic,
  exportManagementCSVLogic,
  exportManagerCSVLogic,
  exportPropertyCSVLogic,
  exportDataPropertyCSVLogic,
  exportRentCSVLogic,
  exportRevenueCSVLogic,
  exportExpensesCSVLogic,
  exportTaskCSVLogic,
  exportCSVSuccessLogic,
  fetchAggregateLogic,
  fetchAggregateExpensesLogic,
  fetchEfficiencyLogic,
  fetchLeasesDetailLogic,
  fetchManagementLogic,
  fetchManagementsDetailLogic,
  fetchManagersDetailLogic,
  fetchOverviewLogic,
  fetchPropertiesDetailLogic,
  fetchRentLogic,
  fetchTaskLogic,
  fetchTasksDetailLogic,
  fetchDataLogic,
];

// Actions
export const fetchReportAggregate = report.actions.fetchAggregate;
export const fetchReportAggregateExpenses =
  report.actions.fetchAggregateExpenses;
export const fetchReportEfficiency = report.actions.fetchEfficiency;
export const fetchReportLeasesDetail = report.actions.fetchLeasesDetail;
export const fetchReportManagement = report.actions.fetchManagement;
export const fetchReportManagementsDetail =
  report.actions.fetchManagementsDetail;
export const fetchReportManagersDetail = report.actions.fetchManagersDetail;
export const fetchReportOverview = report.actions.fetchOverview;
export const fetchReportPropertiesDetail = report.actions.fetchPropertiesDetail;
export const fetchReportRent = report.actions.fetchRent;
export const fetchReportTask = report.actions.fetchTask;
export const fetchReportTasksDetail = report.actions.fetchTasksDetail;
export const resetReport = report.actions.resetReport;
export const fetchData = report.actions.fetchData;

export const exportArrearsReportCSV = report.actions.exportArrearsCSV;
export const exportLeaseReportCSV = report.actions.exportLeaseCSV;
export const exportManagementReportCSV = report.actions.exportManagementCSV;
export const exportManagerReportCSV = report.actions.exportManagerCSV;
export const exportPropertyReportCSV = report.actions.exportPropertyCSV;
export const exportDataPropertyReportCSV = report.actions.exportDataPropertyCSV;
export const exportRentReportCSV = report.actions.exportRentCSV;
export const exportRevenueReportCSV = report.actions.exportRevenueCSV;
export const exportExpensesReportCSV = report.actions.exportExpensesCSV;
export const exportTaskReportCSV = report.actions.exportTaskCSV;

// Selectors
export { getReport, getReportIsLoading } from './selectors';

// Reducer
export default report.reducer;
