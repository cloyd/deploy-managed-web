import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { PulseLoader } from 'react-spinners';
import { Table } from 'reactstrap';

import { formatDate } from '../../../utils';

export const PropertyTransactionsTable = ({
  transactions,
  isLoading,
  transactionsPropertyExistanceCheck,
  ...props
}) => {
  return (
    <div
      style={{
        height: '40rem',
        position: 'relative',
        overflow: 'auto',
        width: '98%',
        margin: '0 auto',
      }}>
      <Table className="responsive-sm" {...props}>
        <thead>
          <tr>
            <th className="align-top sticky-top bg-white border-top-0">{''}</th>
            <th className="align-top sticky-top bg-white border-top-0">
              Paid By
            </th>
            <th className="align-top sticky-top bg-white border-top-0">
              Paid To
            </th>
            <th className="align-top sticky-top bg-white border-top-0">Type</th>
            <th className="align-top sticky-top bg-white border-top-0">
              Tax Category
            </th>
            <th className="align-top sticky-top bg-white border-top-0">
              Paid At
            </th>
            <th className="align-top sticky-top bg-white border-top-0">
              Payment Method
            </th>
            <th className="align-top sticky-top bg-white border-top-0">
              Status
            </th>
            <th className="align-top sticky-top bg-white border-top-0">
              Amount
            </th>
            <th className="align-top sticky-top bg-white border-top-0">
              Wallet Balance
            </th>
            <th className="align-top sticky-top bg-white border-top-0">{''}</th>
          </tr>
        </thead>
        <tbody>
          {!transactionsPropertyExistanceCheck || isLoading ? (
            <tr>
              <td className="text-center py-3" colSpan={6}>
                <PulseLoader color="#dee2e6" />
              </td>
            </tr>
          ) : transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="border-bottom-0 border-top-0 text-right">
                  {!transaction.amount.includes('-') ? (
                    <FontAwesomeIcon
                      icon={['far', 'arrow-right']}
                      className="ml-2 text-success"
                    />
                  ) : null}
                </td>
                <td className="text-left">{transaction.paidBy}</td>
                <td className="text-left">{transaction.paidTo}</td>
                <td>{transaction.type}</td>
                <td>{transaction?.taxCategory}</td>
                <td className="text-nowrap text-right">
                  {formatDate(transaction.paidAt, 'short')}
                </td>
                <td className="text-right">{transaction.paymentMethod}</td>
                <td className="text-right">{transaction.status}</td>
                <td className="text-right">{transaction.amount}</td>
                <td className="text-right">{transaction.walletBalanceAfter}</td>
                <td className="border-bottom-0 border-top-0 text-left">
                  {transaction.amount.includes('-') ? (
                    <FontAwesomeIcon
                      icon={['far', 'arrow-right']}
                      className="ml-2 text-danger"
                    />
                  ) : null}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center py-3" colSpan={6}>
                No Transactions to show.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

PropertyTransactionsTable.propTypes = {
  transactions: PropTypes.array,
  isLoading: PropTypes.bool,
  transactionsPropertyExistanceCheck: PropTypes.bool,
};

PropertyTransactionsTable.defaultProps = {
  transactions: [],
  isLoading: false,
};
