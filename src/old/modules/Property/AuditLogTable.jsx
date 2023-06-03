import PropTypes from 'prop-types';
import React from 'react';
import { Table, UncontrolledTooltip } from 'reactstrap';

import { centsToDollar, formatDate, toPercent } from '../../utils';

export const PropertyAuditLogTable = ({ audits }) => {
  const getSlicedText = (note) => {
    if (!note) return 'NULL';
    else if (note.length > 43) return note.slice(0, 40) + '...';
    else return note;
  };

  const getChangedValue = (metric, unit) => {
    if (!unit) return 'NULL';
    else return `${toPercent(metric)}${unit}`;
  };

  const getActionText = (auditedChanges) => {
    let actionText = '';
    if ('percentageManagementFee' in auditedChanges) {
      actionText += `Management Fee: From ${toPercent(
        auditedChanges.percentageManagementFee[0]
      )}% to ${toPercent(auditedChanges.percentageManagementFee[1])}% \n`;
    }
    if (
      'lettingFeeMetric' in auditedChanges &&
      'lettingFeeUnit' in auditedChanges
    ) {
      actionText += `LettingFee: From ${getChangedValue(
        auditedChanges.lettingFeeMetric[0],
        auditedChanges.lettingFeeUnit[0]
      )} to ${getChangedValue(
        auditedChanges.lettingFeeMetric[1],
        auditedChanges.lettingFeeUnit[1]
      )} \n`;
    }
    if (
      'leaseRenewalMetric' in auditedChanges &&
      'leaseRenewalUnit' in auditedChanges
    ) {
      actionText += `Lease Renewal: From ${getChangedValue(
        auditedChanges.leaseRenewalMetric[0],
        auditedChanges.leaseRenewalUnit[0]
      )} to ${getChangedValue(
        auditedChanges.leaseRenewalMetric[1],
        auditedChanges.leaseRenewalUnit[1]
      )} \n`;
    }
    if ('adminFeeCents' in auditedChanges) {
      actionText += `Admin Fee: From ${centsToDollar(
        auditedChanges.adminFeeCents[0]
      )} to ${centsToDollar(auditedChanges.adminFeeCents[1])} \n`;
    }
    if ('advertisingFeeCents' in auditedChanges) {
      actionText += `Advertising Fee: From ${centsToDollar(
        auditedChanges.advertisingFeeCents[0]
      )} to ${centsToDollar(auditedChanges.advertisingFeeCents[1])} \n`;
    }
    if ('workOrderLimitCents' in auditedChanges) {
      actionText += `Approved Maintenance Spend Without Authorisation: From ${centsToDollar(
        auditedChanges.workOrderLimitCents[0]
      )} to ${centsToDollar(auditedChanges.workOrderLimitCents[1])} \n`;
    }
    if ('specialAuthorities' in auditedChanges) {
      actionText += `Special Authorities: From ${getSlicedText(
        auditedChanges.specialAuthorities[0]
      )} to ${getSlicedText(auditedChanges.specialAuthorities[1])} \n`;
    }
    if ('internalNotes' in auditedChanges) {
      actionText += `Internal Notes: From ${getSlicedText(
        auditedChanges.internalNotes[0]
      )} to ${getSlicedText(auditedChanges.internalNotes[1])} \n`;
    }
    return actionText;
  };

  return (
    <Table responsive>
      <tbody className="bg-white">
        <tr>
          <th className="text-primary" style={{ width: '15%' }}>
            Date
          </th>
          <th className="text-primary" style={{ width: '35%' }}>
            User
          </th>
          <th className="text-primary" style={{ width: '50%' }}>
            Action
          </th>
        </tr>
        {audits.map((item) => (
          <tr key={item.id}>
            <td>{formatDate(item.createdAt, 'short')}</td>
            <td>
              <div>{item.user}</div>
              <div id={'tooltipAuditLogEmail-' + item.id}>
                {item.email.length > 45
                  ? item.email.slice(0, 43) + '...'
                  : item.email}
              </div>
            </td>
            {item.email.length > 45 ? (
              <UncontrolledTooltip
                target={'tooltipAuditLogEmail-' + item.id}
                placement="top">
                {item.email}
              </UncontrolledTooltip>
            ) : null}
            <td style={{ whiteSpace: 'pre' }}>
              {Object.keys(item.auditedChanges).length > 0
                ? getActionText(item.auditedChanges)
                : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

PropertyAuditLogTable.propTypes = {
  audits: PropTypes.array,
};
