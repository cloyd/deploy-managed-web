import {
  createAreaItemLogic,
  createAreaLogic,
  createReportLogic,
  createReportSuccessLogic,
  deleteAreaItemLogic,
  deleteAreaLogic,
  deleteReportLogic,
  errorMessageLogic,
  fetchAreaLogic,
  fetchConditionLogic,
  fetchReportLogic,
  fetchReportsLogic,
  sendToTenantLogic,
  successMessageLogic,
  updateAreaItemLogic,
  updateAreaLogic,
  updateReportLogic,
} from './logic';
import inspection from './reducer';

// Logic
export const inspectionLogic = [
  createAreaItemLogic,
  createAreaLogic,
  createReportLogic,
  createReportSuccessLogic,
  deleteAreaLogic,
  deleteAreaItemLogic,
  deleteReportLogic,
  errorMessageLogic,
  fetchAreaLogic,
  fetchConditionLogic,
  fetchReportLogic,
  fetchReportsLogic,
  sendToTenantLogic,
  successMessageLogic,
  updateAreaItemLogic,
  updateAreaLogic,
  updateReportLogic,
];

// Actions
export {
  createArea,
  createAreaItem,
  createInspectionReport,
  createUploadedInspectionReport,
  deleteArea,
  deleteAreaItem,
  deleteInspectionReport,
  fetchInspectionArea,
  fetchInspectionPropertyCondition,
  fetchInspectionReport,
  fetchPropertyInspectionReports,
  resetCreatedReport,
  sendInspectionReportToTenant,
  updateArea,
  updateAreaItem,
  updateInspectionAttachments,
  updateInspectionReport,
  updateUploadedReport,
} from './actions';

// Helpers
export { isInspectionReportTenant } from './helpers';

// Selectors
export {
  getCreatedInspectionReport,
  getInspectionArea,
  getInspectionAreaItems,
  getInspectionAreasById,
  getInspectionCondition,
  getInspectionConditionByProperty,
  getInspectionConditionPrevAndNextArea,
  getInspectionPropertyReports,
  getInspectionReport,
  getInspectionReportPrevAndNextArea,
  getInspectionReportsByLease,
} from './selectors';

// Constants
export {
  INSPECTION_STATUS,
  INSPECTION_STATUS_LABELS,
  INSPECTION_TYPE,
} from './constants';

// Reducer
export default inspection.reducer;
