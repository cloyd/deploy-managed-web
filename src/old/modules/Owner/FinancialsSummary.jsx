import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'reactstrap';

import { centsToDollar } from '../../utils';

export const OwnerFinancialsSummary = ({ financials }) => {
  const netTotal = financials.incomeTotalCents - financials.expensesTotalCents;
  const isNegative = netTotal < 0;

  return (
    <>
      <Table responsive>
        <tbody className="bg-white">
          <tr>
            <td style={{ width: '35%' }} className="font-weight-bold">
              Net <span className="font-weight-normal">(Income/Expense)</span>
            </td>
            <td style={{ width: '50%' }} colSpan="3" />
            <td
              style={{ width: '15%' }}
              className={`font-weight-bold text-right ${
                isNegative ? 'text-danger' : 'text-success'
              }`}>
              {isNegative ? '- ' : ' '} {centsToDollar(netTotal, true)}
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

OwnerFinancialsSummary.propTypes = {
  financials: PropTypes.object,
};

OwnerFinancialsSummary.defaultProps = {
  financials: {
    income: [],
    expenses: [],
  },
};
