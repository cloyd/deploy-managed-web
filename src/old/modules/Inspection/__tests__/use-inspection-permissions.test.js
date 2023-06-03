/* eslint-disable no-undef */
import {
  INSPECTION_ACTIONS_DEFAULT,
  inspectionActionsManager,
  inspectionActionsOwner,
  inspectionActionsTenant,
  inspectionStatus,
  inspectionType,
} from '../hooks/use-inspection-permissions';

describe('useInspectionPermissions', () => {
  const defaultStatuses = {
    isBlocked: false,
    isCompleted: false,
    isDraft: false,
    isPendingAgency: false,
    isPendingTenant: false,
    isPendingUpload: false,
    isPendingActionByAgent: false,
  };

  const defaultTypes = {
    isIngoing: false,
    isOutgoing: false,
    isRoutine: false,
    isLiveCondition: false,
    isReport: false,
  };

  const testLiveCondition = {
    id: 111,
  };

  const testReport = {
    id: 222,
    status: 'pending_agency',
    typeOf: 'outgoing',
  };

  describe('inspectionActionsManager', () => {
    it('should return action permissions for status isPendingActionByAgent', () => {
      const type = { ...defaultTypes };
      const status = { ...defaultStatuses, isPendingActionByAgent: true };

      const expected = {
        ...INSPECTION_ACTIONS_DEFAULT,
        canEditArea: true,
        canEditAreaItem: true,
        canCommentOnArea: true,
        canDeleteReport: true,
        canViewReport: true,
        canStartReport: true,
        canViewLiveCondition: true,
        canViewUpdateBlockedAlert: true,
      };
      const received = inspectionActionsManager(type, status);
      expect(received).toEqual(expected);
    });

    it('should return action permissions when status isPendingAgency and type is routine', () => {
      const type = { ...defaultTypes, isRoutine: true };
      const status = {
        ...defaultStatuses,
        isPendingAgency: true,
        isPendingActionByAgent: true,
      };

      const expected = {
        ...INSPECTION_ACTIONS_DEFAULT,
        canEditArea: true,
        canEditAreaItem: true,
        canCheckReportItem: true,
        canCommentOnArea: true,
        canCompleteReport: true,
        canDeleteReport: true,
        canMarkPotentialBondClaim: true,
        canMarkNeedsWork: true,
        canSignReport: true,
        canViewReport: true,
        canStartReport: true,
        canViewLiveCondition: true,
        canViewUpdateBlockedAlert: true,
      };
      const received = inspectionActionsManager(type, status);
      expect(received).toEqual(expected);
    });

    it('should return action permissions when status isPendingTenant and type is outgoing', () => {
      const type = { ...defaultTypes, isOutgoing: true };
      const status = {
        ...defaultStatuses,
        isPendingTenant: true,
        isPendingActionByAgent: true,
      };

      const expected = {
        ...INSPECTION_ACTIONS_DEFAULT,
        canEditArea: true,
        canEditAreaItem: true,
        canCommentOnArea: true,
        canDeleteReport: true,
        canMarkNeedsWork: true,
        canMarkPotentialBondClaim: true,
        canSendToTenant: true,
        canUploadPendingTenant: true,
        canViewReport: true,
        canStartReport: true,
        canViewLiveCondition: true,
        canViewUpdateBlockedAlert: true,
      };
      const received = inspectionActionsManager(type, status);
      expect(received).toEqual(expected);
    });
  });

  describe('inspectionActionsOwner', () => {
    it('should return action permissions for status isCompleted', () => {
      const type = { ...defaultTypes, isOutgoing: true };
      const status = { ...defaultStatuses, isCompleted: true };

      const expected = {
        ...INSPECTION_ACTIONS_DEFAULT,
        canViewLiveCondition: true,
        canViewReport: true,
      };
      const received = inspectionActionsOwner(type, status);
      expect(received).toEqual(expected);
    });

    it('should return action permissions for status isPendingTenant', () => {
      const type = { ...defaultTypes, isOutgoing: true };
      const status = { ...defaultStatuses, isPendingTenant: true };

      const expected = {
        ...INSPECTION_ACTIONS_DEFAULT,
        canViewLiveCondition: true,
      };
      const received = inspectionActionsOwner(type, status);
      expect(received).toEqual(expected);
    });
  });

  describe('inspectionActionsTenant', () => {
    it('should return action permissions for status isPendingTenant and type isRoutine', () => {
      const type = { ...defaultTypes, isRoutine: true };
      const status = { ...defaultStatuses, isPendingTenant: true };

      const expected = { ...INSPECTION_ACTIONS_DEFAULT };
      const received = inspectionActionsTenant(type, status);
      expect(received).toEqual(expected);
    });

    it('should return action permissions for status isPendingTenant when type isIngoing', () => {
      const type = { ...defaultTypes, isIngoing: true };
      const status = { ...defaultStatuses, isPendingTenant: true };

      const expected = {
        ...INSPECTION_ACTIONS_DEFAULT,
        canAgreeReportItem: true,
        canCommentOnArea: true,
        canCompleteReport: true,
        canSignReport: true,
        canViewReport: true,
      };
      const received = inspectionActionsTenant(type, status);
      expect(received).toEqual(expected);
    });
  });

  describe('inspectionType', () => {
    it('should return defaults', () => {
      const expected = { ...defaultStatuses };
      const received = inspectionStatus({});
      expect(received).toEqual(expected);
    });

    it('should return types for a live condition', () => {
      const expected = { ...defaultStatuses };
      const received = inspectionStatus(testLiveCondition);
      expect(received).toEqual(expected);
    });

    it('should return types for a report', () => {
      const expected = {
        ...defaultStatuses,
        isPendingAgency: true,
        isPendingActionByAgent: true,
      };
      const received = inspectionStatus(testReport);
      expect(received).toEqual(expected);
    });
  });

  describe('inspectionStatus', () => {
    it('should return statuses for a live condition', () => {
      const expected = {
        ...defaultTypes,
        isLiveCondition: true,
      };
      const received = inspectionType(testLiveCondition);
      expect(received).toEqual(expected);
    });

    it('should return statuses for a report', () => {
      const expected = {
        ...defaultTypes,
        isLiveCondition: false,
        isOutgoing: true,
        isReport: true,
      };
      const received = inspectionType(testReport);
      expect(received).toEqual(expected);
    });
  });
});
