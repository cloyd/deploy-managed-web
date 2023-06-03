import PropTypes from 'prop-types';
import React from 'react';

import { centsToDollar } from '../../../utils';

export const ReportTotal = ({ report, ...props }) => {
  return (
    <tr className="h5-font-size">
      <td className="pt-4">Final amount paid to bank account</td>
      <td className="pt-4 text-right" colSpan="2">
        {centsToDollar(report.total, true)}
      </td>
      <td />
    </tr>
  );
};

ReportTotal.propTypes = {
  report: PropTypes.object,
};
