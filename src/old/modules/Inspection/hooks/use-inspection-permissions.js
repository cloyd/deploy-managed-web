import { useMemo } from 'react';

import {
  INSPECTION_STATUS,
  INSPECTION_TYPE,
  isInspectionReportTenant,
} from '../../../redux/inspection';
import { useRolesContext } from '../../Profile';

// Actions based on role, inspection type and inspection status
export const INSPECTION_ACTIONS_DEFAULT = {
  canAgreeReportItem: false,
  canCheckReportItem: false,
  canCommentOnArea: false,
  canCompleteReport: false, // Subset of canSignReport
  canDeleteReport: false,
  canEditArea: false,
  canEditAreaItem: false,
  canMarkNeedsWork: false,
  canMarkPotentialBondClaim: false,
  canSendToTenant: false,
  canSignReport: false,
  canStartReport: false,
  canUploadPendingTenant: false,
  canUploadReport: false,
  canViewLiveCondition: false,
  canViewReport: false,
  canViewUpdateBlockedAlert: false,
};

export const inspectionActionsManager = (type, status) => {
  const unblockedConditionActions = !status.isBlocked
    ? {
        canCheckReportItem: status.isDraft || status.isPendingAgency,
        canCommentOnArea: type.isLiveCondition || status.isPendingActionByAgent,
        canEditArea: type.isLiveCondition || status.isPendingActionByAgent,
        canEditAreaItem: type.isLiveCondition || status.isPendingActionByAgent,
      }
    : {};

  return {
    ...INSPECTION_ACTIONS_DEFAULT,
    ...unblockedConditionActions,
    canCompleteReport: type.isRoutine && status.isPendingAgency,
    canDeleteReport: true,
    canMarkNeedsWork:
      (type.isRoutine || type.isOutgoing) && status.isPendingActionByAgent,
    canMarkPotentialBondClaim:
      (type.isRoutine || type.isOutgoing) && status.isPendingActionByAgent,
    canSendToTenant:
      (type.isIngoing || type.isOutgoing) && status.isPendingTenant,
    canSignReport: status.isPendingAgency,
    canStartReport: true,
    canUploadPendingTenant: status.isPendingTenant,
    canUploadReport: status.isPendingUpload,
    canViewLiveCondition: true,
    canViewReport:
      !type.isUploadedReport &&
      !status.isPendingUpload &&
      (!status.isBlocked || status.isPendingTenant),
    canViewUpdateBlockedAlert: true,
  };
};

export const inspectionActionsOwner = (type, status) => ({
  ...INSPECTION_ACTIONS_DEFAULT,
  canViewLiveCondition: true,
  canViewReport: !type.isUploadedReport && status.isCompleted,
});

export const inspectionActionsTenant = (type, status) => ({
  ...INSPECTION_ACTIONS_DEFAULT,
  canAgreeReportItem:
    (type.isIngoing || type.isOutgoing) && status.isPendingTenant,
  canCommentOnArea: !type.isRoutine && status.isPendingTenant,
  canCompleteReport:
    (type.isIngoing || type.isOutgoing) && status.isPendingTenant,
  canSignReport: (type.isIngoing || type.isOutgoing) && status.isPendingTenant,
  canViewReport:
    !type.isUploadedReport &&
    !type.isRoutine &&
    (status.isCompleted || status.isPendingTenant),
});

// Type values of a Live Condition or Report
export const inspectionType = (inspection) => {
  const { report, typeOf } = inspection;
  const isIngoing = typeOf === INSPECTION_TYPE.INGOING;
  const isOutgoing = typeOf === INSPECTION_TYPE.OUTGOING;
  const isRoutine = typeOf === INSPECTION_TYPE.ROUTINE;

  return {
    isIngoing,
    isOutgoing,
    isRoutine,
    isLiveCondition: !isIngoing && !isOutgoing && !isRoutine,
    isReport: isIngoing || isOutgoing || isRoutine,
    isUploadedReport: report && !!report.uploadedAt,
  };
};

// Status of a Live Condition or Report
export const inspectionStatus = (inspection) => {
  const { status, updateBlockedByReportId } = inspection;
  const isDraft = status === INSPECTION_STATUS.DRAFT;
  const isPendingAgency = status === INSPECTION_STATUS.PENDING_AGENCY;

  return {
    isDraft,
    isPendingAgency,
    isPendingTenant: status === INSPECTION_STATUS.PENDING_TENANT,
    isPendingUpload: status === INSPECTION_STATUS.PENDING_UPLOAD,
    isCompleted: status === INSPECTION_STATUS.COMPLETED,
    isBlocked: !!updateBlockedByReportId,
    isPendingActionByAgent: isDraft || isPendingAgency,
  };
};

/**
 * Property inspections permissions hook
 *
 * @param {*} inspection either a Live Condition or an Inspection Report
 * @param {*} userId optional - id of the current logged in user
 */
export const useInspectionPermissions = (inspection, userId) => {
  const { isCorporateUser, isManager, isOwner, isTenant } = useRolesContext();

  return useMemo(() => {
    const type = inspectionType(inspection);
    const status = inspectionStatus(inspection);

    const isReportTenant =
      type.isReport &&
      !!userId &&
      isInspectionReportTenant(inspection, userId, isTenant);

    return {
      type,
      status,
      action:
        isCorporateUser || isOwner
          ? inspectionActionsOwner(type, status)
          : isManager && !isCorporateUser
          ? inspectionActionsManager(type, status)
          : isReportTenant
          ? inspectionActionsTenant(type, status)
          : {
              ...INSPECTION_ACTIONS_DEFAULT,
              canViewReport:
                !type.isUploadedReport && !type.isRoutine && status.isCompleted,
            },
    };
  }, [inspection, isCorporateUser, isManager, isOwner, isTenant, userId]);
};
