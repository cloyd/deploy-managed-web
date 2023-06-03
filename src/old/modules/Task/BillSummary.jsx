import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Badge } from 'reactstrap';

import { TaskBillRow, useTaskIsState } from '@app/modules/Task';
import { centsToDollar, formatDate } from '@app/utils';

export const TaskBillSummary = ({ task, hasAlerts, ...props }) => {
  const { invoice, creatorName } = task;

  const { isInvoiced, paymentStatus } = useTaskIsState({
    frontendStatus: invoice?.frontendStatus,
    status: task?.status,
  });

  const scheduledAt = useMemo(() => {
    let text = 'Scheduled at: ';

    if (invoice.intentionCreatedAt) {
      text += formatDate(invoice.intentionCreatedAt, 'shortWithTime');
    } else {
      text += '-';
    }

    return text;
  }, [invoice]);

  return (
    <div {...props}>
      <TaskBillRow
        avatarUrl={task.invoice.debtorAvatarUrl}
        className="mb-2"
        role={task.invoice.debtorType}
        name={task.invoice.debtorCompanyName || task.invoice.debtorName}>
        is paying
      </TaskBillRow>
      <TaskBillRow
        avatarUrl={invoice.creditorAvatarUrl}
        className="mb-3"
        role={invoice.creditorType}
        name={invoice.creditorCompanyName || invoice.creditorName}
        id={invoice.creditorId}>
        {centsToDollar(invoice.amountCents)}
        {(invoice.isCreditorBpayOutProvider || invoice.isToBpayBiller) && (
          <>
            <span className="d-block">
              BPay biller code: {invoice.bpayBillerCode}
            </span>
            <span className="d-block">
              BPay reference: {invoice.bpayReference}
            </span>
          </>
        )}
        {invoice.referenceNumber && !invoice.isCreditorBpayOutProvider && (
          <span className="d-block">
            Payment Reference: {invoice.referenceNumber}
          </span>
        )}
      </TaskBillRow>
      {hasAlerts && (
        <Badge
          color={paymentStatus?.color}
          className={`p-1 normal-line-wrap ${paymentStatus?.style || ''}`}>
          {paymentStatus?.text}
        </Badge>
      )}
      {isInvoiced && (
        <div className="ml-1 mt-3">
          <p className="small mb-0">{scheduledAt}</p>
          <p className="small mb-0 text-capitalize">
            User: {invoice?.createdBy || creatorName}
          </p>
        </div>
      )}
    </div>
  );
};

TaskBillSummary.defaultProps = {
  task: {},
  hasAlerts: true,
};

TaskBillSummary.propTypes = {
  task: PropTypes.object,
  hasAlerts: PropTypes.bool,
};
