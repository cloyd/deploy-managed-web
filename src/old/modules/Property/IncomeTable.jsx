import PropTypes from 'prop-types';
import React from 'react';
import { Badge, Table } from 'reactstrap';

import { centsToDollar } from '../../utils';
import { Link } from '../Link';
import { paymentBadgeStyle } from '../Payment/helpers';

export const PropertyIncomeTable = ({ financials, propertyId }) => (
  <Table responsive data-testid="property-income-table">
    <tbody className="bg-white">
      <tr>
        <th style={{ width: '25%' }}>Income</th>
        <th style={{ width: '30%' }}>Category</th>
        <th style={{ width: '15%' }} colSpan="2">
          Date paid
        </th>
        <th style={{ width: '15%' }}>Status</th>
        <th style={{ width: '5%' }}>GST</th>
        <th style={{ width: '10%' }} className="text-right">
          Total
        </th>
      </tr>
      {financials?.income?.map((item) => (
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
          <td colSpan="2">{item.paidAt}</td>
          <td>
            <Badge
              color={paymentBadgeStyle(item.status).color}
              className="p-1 normal-line-wrap">
              {paymentBadgeStyle(item.status).text}
            </Badge>
          </td>
          <td className={item.status === 'refunded' ? 'text-linethrough' : ''}>
            {centsToDollar(item.gst, true)}
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
        <th colSpan="3" />
        <td className="font-weight-bold">
          {centsToDollar(financials.incomeGstTotalCents, true)}
        </td>
        <th className="font-weight-bold text-right">
          {centsToDollar(financials.incomeTotalCents, true)}
        </th>
      </tr>
    </tbody>
  </Table>
);

PropertyIncomeTable.propTypes = {
  financials: PropTypes.object,
  propertyId: PropTypes.number,
};

PropertyIncomeTable.defaultProps = {
  financials: {
    income: [],
  },
};
