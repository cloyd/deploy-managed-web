import PropTypes from 'prop-types';
import React from 'react';
import { Badge, Table } from 'reactstrap';

import { centsToDollar } from '../../utils';
import { Link } from '../Link';
import { paymentBadgeStyle } from '../Payment/helpers';

export const OwnerIncomeTable = ({ financials }) => (
  <Table responsive>
    <tbody className="bg-white">
      <tr>
        <th style={{ width: '24%' }}>Income</th>
        <th style={{ width: '10%' }}>Category</th>
        <th style={{ width: '25%' }}>Property</th>
        <th style={{ width: '10%' }}>Ownership</th>
        <th style={{ width: '10%' }} colSpan="2">
          Date paid
        </th>
        <th style={{ width: '11%' }}>Status</th>
        <th style={{ width: '10%' }} className="text-right">
          Total
        </th>
      </tr>
      {financials?.income?.map((item) => (
        <tr key={`${item.id}-${item.category}`}>
          <td>
            {item.taskId ? (
              <Link
                to={`/property/${item.propertyId}/tasks/${item.taskId}`}
                className="text-left">
                {item.title}
              </Link>
            ) : (
              item.title
            )}
          </td>
          <td>{item.category}</td>
          <td>{item.propertyAddress}</td>
          <td>{item.ownerCompany}</td>
          <td colSpan="2">{item.paidAt}</td>
          <td>
            <Badge
              color={paymentBadgeStyle(item.status).color}
              className="p-1 normal-line-wrap">
              {paymentBadgeStyle(item.status).text}
            </Badge>
          </td>
          <td
            className={`text-right ${
              item.status === 'refunded' ? 'text-linethrough' : ''
            }`}>
            {centsToDollar(item.total, true)}
          </td>
        </tr>
      ))}
      <tr className="alert alert-success border-0">
        <th>Total</th>
        <th />
        <th colSpan="5" />
        <th className="font-weight-bold text-right">
          {centsToDollar(financials.incomeTotalCents, true)}
        </th>
      </tr>
    </tbody>
  </Table>
);

OwnerIncomeTable.propTypes = {
  financials: PropTypes.object,
  ownerId: PropTypes.number,
};

OwnerIncomeTable.defaultProps = {
  financials: {
    income: [],
  },
};
