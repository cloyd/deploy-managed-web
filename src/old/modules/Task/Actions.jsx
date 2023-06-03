import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { useIsOpen } from '@app/hooks';
import {
  ButtonAccept,
  ButtonDecline,
  ButtonDollar,
  ButtonEntryTask,
  ButtonPay,
  ButtonReply,
  ButtonSchedule,
  ButtonTradie,
} from '@app/modules/Button';
import { InspectionReportCreateButton } from '@app/modules/Inspection';
import { Link } from '@app/modules/Link';
import { useJobPermissions } from '@app/modules/Marketplace';
import {
  TaskReferButtonModal,
  TaskScheduleModal,
  useTaskPermissions,
} from '@app/modules/Task';

export const TaskActions = ({
  isDebtor,
  isMarketplaceEnabled,
  lease,
  property,
  task,
  onCreateInspection,
  onReply,
  onSend,
  onUpdateTask,
}) => {
  const jobAction = useJobPermissions({ task });
  const [isOpen, { handleToggle }] = useIsOpen(false);

  const {
    canPay,
    canRequestOwnerReview,
    canSend,
    canSendEditable,
    canSendFormNine,
    canViewInspections,
    ...taskAction
  } = useTaskPermissions(task, { isDebtor, property });

  const taskPath = useMemo(() => {
    return `/property/${task.propertyId}/tasks/${task.id}`;
  }, [task.id, task.propertyId]);

  const isPublished = useMemo(() => {
    return !['draft', 'entered'].includes(task.status);
  }, [task.status]);

  const canBill = useMemo(() => {
    return isPublished && (taskAction.canBill || jobAction.canBillJob);
  }, [isPublished, taskAction.canBill, jobAction.canBillJob]);

  const canCreateReport = useMemo(() => {
    return onCreateInspection && canViewInspections;
  }, [canViewInspections, onCreateInspection]);

  const canRequestQuote = useMemo(() => {
    return !isMarketplaceEnabled && taskAction.canRequestQuote;
  }, [isMarketplaceEnabled, taskAction.canRequestQuote]);

  const canSchedule = useMemo(() => {
    return onSend && canSend;
  }, [onSend, canSend]);

  const canEditSchedule = useMemo(() => {
    return canSchedule && canSendEditable;
  }, [canSchedule, canSendEditable]);

  const canStartJob = useMemo(() => {
    return isPublished && jobAction.canCreateJob;
  }, [isPublished, jobAction.canCreateJob]);

  const canViewJob = useMemo(() => {
    return isPublished && jobAction.canViewJob;
  }, [isPublished, jobAction.canViewJob]);

  const canAcceptOrDecline = useMemo(() => {
    return onUpdateTask && taskAction.canAcceptOrDecline;
  }, [onUpdateTask, taskAction.canAcceptOrDecline]);

  const handleAccepted = useCallback(() => {
    onUpdateTask('accepted');
  }, [onUpdateTask]);

  const handleDeclined = useCallback(() => {
    onUpdateTask('declined');
  }, [onUpdateTask]);

  return (
    <div className="d-flex justify-content-around">
      {!!onReply && <ButtonReply onClick={onReply} />}
      {canCreateReport && (
        <InspectionReportCreateButton
          lease={lease}
          task={task}
          onCreateReport={onCreateInspection}
        />
      )}
      {canAcceptOrDecline && <ButtonDecline onClick={handleDeclined} />}
      {canRequestOwnerReview && <TaskReferButtonModal task={task} />}
      {canAcceptOrDecline && <ButtonAccept onClick={handleAccepted} />}
      {canRequestQuote && (
        <Link to={`${taskPath}/tradie`}>
          <ButtonTradie />
        </Link>
      )}
      {canStartJob && (
        <Link to={`${taskPath}/job/create`}>
          <ButtonTradie>Start Job</ButtonTradie>
        </Link>
      )}
      {canViewJob && (
        <Link to={`${taskPath}/job`}>
          <ButtonTradie>View Job</ButtonTradie>
        </Link>
      )}
      {canBill && (
        <Link to={`${taskPath}/bill#add`}>
          <ButtonDollar size="2x" direction="column">
            <small>Bill</small>
          </ButtonDollar>
        </Link>
      )}
      {canSendFormNine && (
        <Link to={`${taskPath}/form-9`}>
          <ButtonEntryTask />
        </Link>
      )}
      {canPay && (
        <Link
          to={`/payments/${task.invoice.intentionId}?leaseId=${task.leaseId}&propertyId=${task.propertyId}`}>
          <ButtonPay disabled={!task.isIntentionDraft} direction="column" />
        </Link>
      )}
      {canSchedule && (
        <>
          <ButtonSchedule
            disabled={task.isIntentionTriggered}
            onClick={canEditSchedule ? handleToggle : onSend}
          />
          {canEditSchedule && (
            <TaskScheduleModal
              isOpen={isOpen}
              onCancel={handleToggle}
              onSubmit={onSend}
              task={task}
            />
          )}
        </>
      )}
    </div>
  );
};

TaskActions.defaultProps = {
  isDebtor: false,
  isMarketplaceEnabled: false,
};

TaskActions.propTypes = {
  isDebtor: PropTypes.bool,
  isMarketplaceEnabled: PropTypes.bool,
  lease: PropTypes.object,
  onCreateInspection: PropTypes.func,
  property: PropTypes.object,
  task: PropTypes.object,
  onSend: PropTypes.func,
  onReply: PropTypes.func,
  onUpdateTask: PropTypes.func,
};
