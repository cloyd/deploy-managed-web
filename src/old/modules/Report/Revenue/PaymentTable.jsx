import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Table } from 'reactstrap';

import { ReportPaymentItem, ReportTotal } from '..';

export const ReportPaymentTable = ({ report, feeType, ...props }) => {
  const isRevenue = feeType === 'revenue';

  const rentAndTask = useMemo(
    () =>
      [
        ...(isRevenue ? [report.rent] : []),
        Object.values(report.tasks).map((value) => value),
      ].flat(),
    [isRevenue, report.rent, report.tasks]
  );

  const aggregateAndTransaction = useMemo(
    () => [report.aggregate, report.transaction].flat(),
    [report.aggregate, report.transaction]
  );
  return (
    <Table responsive {...props}>
      <thead>
        <tr>
          <th style={{ width: '45%' }}>Tax Category</th>
          <th className="text-right">GST</th>
          <th className="text-right">
            {`Total ${isRevenue ? 'Income' : 'Expenses'} `}
            <small>(incl. GST)</small>
          </th>
          <th className="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rentAndTask.map((task) => (
          <ReportPaymentItem
            key={`task-${task.label}`}
            label={task.label}
            type={task.type}
            report={task.report}
            feeType={feeType}
          />
        ))}
        <tr className="separator" colSpan="4" />
        {aggregateAndTransaction.map((task) => (
          <ReportPaymentItem
            key={`task-${task.label}`}
            label={task.label}
            type={task.type}
            report={task.report}
          />
        ))}
        {isRevenue && <ReportTotal className="mb-4" report={report.net} />}
      </tbody>
    </Table>
  );
};

ReportPaymentTable.propTypes = {
  report: PropTypes.object,
  location: PropTypes.object,
  feeType: PropTypes.string,
};

ReportPaymentTable.defaultProps = {
  report: {},
};
