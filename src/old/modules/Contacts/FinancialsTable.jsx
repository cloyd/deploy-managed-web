import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'reactstrap';

import { Link } from '../../modules/Link';
import { centsToDollar } from '../../utils';

export const FinancialsTable = ({ financials }) => {
  return (
    <Table responsive>
      <tbody className="bg-white">
        <tr>
          <th style={{ width: '35%' }}>Task</th>
          <th style={{ width: '15%' }}>Property Address</th>
          <th style={{ width: '10%' }}>Date paid</th>
          <th style={{ width: '10%' }} className="text-right">
            Gross
          </th>
          <th style={{ width: '10%' }} className="text-right">
            Fee
          </th>
          <th style={{ width: '10%' }} className="text-right">
            GST
          </th>
          <th style={{ width: '10%' }} className="text-right">
            Net
          </th>
        </tr>
        {financials.map((item) => (
          <tr key={item.id}>
            <td>
              {item.taskId ? (
                <Link to={`/property/${item.propertyId}/tasks/${item.taskId}`}>
                  {item.title}
                </Link>
              ) : (
                item.title
              )}
            </td>
            <td>{item.propertyFullAddress}</td>
            <td>{item.paidAt}</td>
            <td className="text-right">{centsToDollar(item.total, true)}</td>
            <td className="text-right">
              -{centsToDollar(item.marketplaceFees, true)}
            </td>
            <td className="text-right">{centsToDollar(item.gst, true)}</td>
            <td className="text-right">{centsToDollar(item.net, true)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

FinancialsTable.propTypes = {
  financials: PropTypes.array,
};

FinancialsTable.defaultProps = {
  financials: [],
};
