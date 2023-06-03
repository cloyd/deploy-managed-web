import { INSPECTION_STATUS } from './constants';
import inspection from './reducer';

// Create actions
export const createArea = ({ name, propertyConditionId, reportId }) =>
  inspection.actions.createArea({
    propertyConditionId,
    params: { name, reportId },
  });

export const createAreaItem = ({ areaId, name, reportId }) =>
  inspection.actions.createAreaItem({ areaId, params: { name, reportId } });

export const createInspectionReport = ({
  inspectionDate,
  isUploadedReport,
  leaseId,
  propertyId,
  propertyTaskId,
  status,
  type,
}) =>
  inspection.actions.createReport({
    inspectionDate,
    isUploadedReport,
    leaseId,
    propertyId,
    propertyTaskId,
    status,
    typeOf: type,
  });

export const createUploadedInspectionReport = (params) =>
  createInspectionReport({
    ...params,
    isUploadedReport: true,
    status: INSPECTION_STATUS.PENDING_UPLOAD,
  });

// Delete actions
export const deleteArea = ({ areaId, propertyConditionId, reportId }) =>
  inspection.actions.deleteArea({
    areaId,
    propertyConditionId,
    params: { reportId },
  });

export const deleteAreaItem = ({ areaItemId, reportId }) =>
  inspection.actions.deleteAreaItem({ areaItemId, params: { reportId } });

export const deleteInspectionReport = ({ propertyId, reportId }) =>
  inspection.actions.deleteReport({ propertyId, reportId });

// Fetch actions
export const fetchInspectionArea = ({ areaId, reportId }) =>
  inspection.actions.fetchArea({ areaId, params: { reportId } });

export const fetchInspectionPropertyCondition = ({ propertyId }) =>
  inspection.actions.fetchCondition({ propertyId });

export const fetchInspectionReport = ({ reportId }) =>
  inspection.actions.fetchReport({ reportId });

export const fetchPropertyInspectionReports = ({ propertyId }) =>
  inspection.actions.fetchReports({ propertyId });

// Update actions
const parseInspectionParams = (params) => {
  const { isAgreed, isChecked, note, role, signature, userId, ...otherParams } =
    params;
  let parsedParams = { ...otherParams };

  if (typeof note !== 'undefined' && userId) {
    // Manager or Tenant updating note
    parsedParams[role] = {
      ...parsedParams[role],
      id: userId,
      note: note || '',
    };
  }

  if (typeof isAgreed !== 'undefined') {
    // Tenant updating isAgreed
    parsedParams[role] = { ...parsedParams[role], isAgreed };
  }

  if (typeof isChecked !== 'undefined') {
    // Manager updating isChecked
    parsedParams[role] = { ...parsedParams[role], isChecked };
  }

  if (typeof signature !== 'undefined') {
    // Manager or Tenant providing signature
    parsedParams[role] = { ...parsedParams[role], signature };
  }

  return parsedParams;
};

export const updateArea = ({ areaId, ...params }) =>
  inspection.actions.updateArea({
    areaId,
    params: parseInspectionParams(params),
  });

export const updateAreaItem = ({ areaItemId, ...params }) =>
  inspection.actions.updateAreaItem({
    areaItemId,
    params: parseInspectionParams(params),
  });

export const updateInspectionAttachments = ({
  attachableId,
  attachments,
  role, // Manager or Tenant attachments
  storeId, // Inspection store data object id
  storeKey, // Inspection store key for attached type
}) =>
  inspection.actions.updateAttachments({
    attachableId,
    attachments,
    role,
    storeId,
    storeKey,
  });

export const updateInspectionReport = ({ reportId, ...params }) =>
  inspection.actions.updateReport({
    reportId,
    params: parseInspectionParams(params),
  });

export const updateUploadedReport = ({ attachments, reportId }) =>
  inspection.actions.updateUploadedReport({ attachments, reportId });

// Other actions
export const resetCreatedReport = () => inspection.actions.resetCreatedReport();

export const sendInspectionReportToTenant = ({ reportId }) =>
  inspection.actions.sendToTenant({ reportId });
