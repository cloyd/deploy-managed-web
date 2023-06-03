import PropTypes from 'prop-types';
import React from 'react';
import { Badge, Table } from 'reactstrap';

import { centsToDollar } from '../../utils';
import { Link } from '../Link';
import { paymentBadgeStyle } from '../Payment/helpers';

export const PropertyExpensesTable = ({ financials, propertyId }) => (
  <Table responsive data-testid="property-expenses-table">
    <tbody className="bg-white">
      <tr>
        <th style={{ width: '25%' }}>Expense</th>
        <th style={{ width: '30%' }}>Category</th>
        <th style={{ width: '15%' }}>Date paid</th>
        <th style={{ width: '15%' }}>Status</th>
        <th style={{ width: '5%' }}>GST</th>
        <th style={{ width: '10%' }} className="text-right">
          Total
        </th>
      </tr>
      {financials?.expenses?.map((item) => (
        <tr key={`${item.id}-${item.category}`}>
          <td>
            {item.taskId ? (
              <Link
                to={`/property/${propertyId}/tasks/${item.taskId}`}
                className="text-left">
                {item.title}
              </Link>
            ) : (
              item.title
            )}
          </td>
          <td>{item.category}</td>
          <td>{item.paidAt}</td>
          <td>
            <Badge
              color={paymentBadgeStyle(item.status).color}
              className="p-1 normal-line-wrap">
              {paymentBadgeStyle(item.status).text}
            </Badge>
          </td>
          <td
            className={`${
              item.status === 'refunded' ? 'text-linethrough' : ''
            }`}>
            {centsToDollar(item.gst, true)}
          </td>
          <td
            className={`text-right ${
              item.status === 'refunded' ? 'text-linethrough' : ''
            }`}>
            <small className="badge badge-pill badge-light text-muted">
              {item.paymentMethod}
            </small>
            -{centsToDollar(item.total, true)}
          </td>
        </tr>
      ))}
      <tr className="alert alert-danger border-0">
        <th>Total</th>
        <th colSpan="3" />
        <td className="font-weight-bold">
          {centsToDollar(financials.expensesGstTotalCents, true)}
        </td>
        <th className="font-weight-bold text-right">
          -{centsToDollar(financials.expensesTotalCents, true)}
        </th>
      </tr>
    </tbody>
  </Table>
);

PropertyExpensesTable.propTypes = {
  financials: PropTypes.object,
  propertyId: PropTypes.number,
};

PropertyExpensesTable.defaultProps = {
  financials: {
    expenses: [],
  },
};
