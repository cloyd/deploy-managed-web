import { useMemo } from 'react';

import { useRolesContext } from '@app/modules/Profile';
import { INSPECTION_TYPE } from '@app/redux/inspection';
import { INSPECTION_TASK_TYPE } from '@app/redux/task';

/**
 * Hook that returns task related permissions for current logged in user.
 */
export const useTaskPermissions = (task, { isDebtor, property }) => {
  const { isCorporateUser, isManager, isOwner, isPrincipal, isTenant } =
    useRolesContext();

  const canManageCustomTask = useMemo(() => {
    if (isPrincipal || isCorporateUser) {
      return property?.agency?.isCustomTaskModuleEnabled;
    }

    return false;
  }, [isCorporateUser, isPrincipal, property]);

  return useMemo(() => {
    const {
      category,
      followedByOwner,
      invoice,
      isAdvertising,
      isArrear,
      isBillable,
      isImprovement,
      isIntentionComplete,
      isIntentionPending,
      isIntentionTriggered,
      isMaintenance,
      status,
      type,
    } = task || {};

    const isIntentionPayable =
      isIntentionTriggered && !isIntentionComplete && !isIntentionPending;

    const canAcceptOrDecline =
      !isTenant && isMaintenance && status === 'entered';

    const canSend = isBillable && !isIntentionTriggered;

    const canSendEditable =
      canSend &&
      invoice.revenueShare &&
      invoice.creditorType === 'ExternalCreditor' &&
      !invoice.isCreditorBpayOutProvider &&
      !invoice.isToBpayBiller;

    if (isManager) {
      return {
        canAcceptOrDecline,
        canBill:
          (isMaintenance || isImprovement || isAdvertising) && !isBillable,
        canEdit: !isArrear,
        canPay:
          isIntentionPayable &&
          invoice.debtorType &&
          invoice.debtorType !== 'Tenant',
        canRequestOwnerReview: !followedByOwner && status === 'entered',
        canRequestQuote: isMaintenance,
        canSend,
        canSendEditable,
        canSendFormNine:
          property?.address?.state === 'QLD' && !property?.hasNoActiveLease,
        canViewInspections:
          property?.isInspectionModuleEnabled &&
          type === INSPECTION_TASK_TYPE &&
          category &&
          Object.values(INSPECTION_TYPE).includes(category),
        canManageCustomTask,
      };
    } else {
      return {
        canAcceptOrDecline,
        canPay: isDebtor && isIntentionPayable,
        canEdit: isOwner || isTenant,
      };
    }
  }, [
    canManageCustomTask,
    isDebtor,
    isManager,
    isOwner,
    isTenant,
    property,
    task,
  ]);
};
