import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'reactstrap';

import { centsToDollar } from '../../../utils';

export const ReportTotalProperties = ({ report, type, ...props }) => {
  const revenueShareTypeCheck = type && type === 'revenue_share_charge';
  return (
    <Table responsive {...props}>
      <thead>
        <tr>
          <th>GST collected</th>
          <th>
            {revenueShareTypeCheck
              ? 'Total Revenue Share Fees'
              : 'Total management fees'}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{centsToDollar(report.totalGst)}</td>
          <td>{centsToDollar(report.total)}</td>
        </tr>
      </tbody>
    </Table>
  );
};

ReportTotalProperties.propTypes = {
  report: PropTypes.object,
  type: PropTypes.string,
};

ReportTotalProperties.defaultProps = {
  report: {
    total: 0,
    totalGst: 0,
  },
};
