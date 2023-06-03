import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'reactstrap';

import { ReportTitle, ReportTotalProperties } from '..';
import { centsToDollar, formatDate } from '../../../utils';
import { ButtonPrint } from '../../Button';
import { Link } from '../../Link';

export const ReportTaskTable = ({
  item,
  properties,
  title,
  feeType,
  ...props
}) => {
  const { report, type } = item;
  const isRevenueShare = type && type === 'revenue_share_charge';
  const isExpense = feeType === 'expenses';
  const isPlatformCostOrRevenueShare =
    type === 'platform_costs' || isRevenueShare;

  return (
    <>
      <div className="d-flex justify-content-between w-100">
        <ReportTitle>{title}</ReportTitle>
        <ButtonPrint />
      </div>
      <ReportTotalProperties className="mb-4" report={report} type={type} />
      <Table responsive {...props}>
        <thead>
          <tr>
            <th className="align-top">ID</th>
            {!isPlatformCostOrRevenueShare && (
              <th className="align-top">Address</th>
            )}
            <th className="align-top">Title</th>
            <th className="align-top">Date</th>
            <th className="align-top">
              {isRevenueShare ? 'Agency Share' : 'Total Collected'}
            </th>
            <th className="align-top">GST</th>
            {isExpense && <th>Payment method</th>}
          </tr>
        </thead>
        <tbody>
          {properties.length > 0 ? (
            properties.map(
              ({
                id,
                propertyId,
                propertyFullAddress,
                title,
                paidAt,
                agencyAmountCents,
                agencyAmountGstCents,
                paymentMethod,
                invoiceId,
              }) => (
                <tr key={id}>
                  <td>{propertyId || invoiceId}</td>
                  {!isPlatformCostOrRevenueShare && (
                    <td>
                      <Link
                        to={`/property/${propertyId}`}
                        className="text-left">
                        {propertyFullAddress}
                      </Link>
                    </td>
                  )}
                  <td>
                    {isPlatformCostOrRevenueShare
                      ? isRevenueShare
                        ? 'Monthly Revenue Share Fee'
                        : 'Monthly Platform Charge'
                      : title}
                  </td>
                  <td>{formatDate(paidAt, 'short')}</td>
                  <td>{centsToDollar(agencyAmountCents)}</td>
                  <td>{centsToDollar(agencyAmountGstCents)}</td>
                  {isExpense && (
                    <td className="text-uppercase">{paymentMethod}</td>
                  )}
                </tr>
              )
            )
          ) : (
            <tr>
              <td className="text-center" colSpan={6}>
                No revenue to show.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};

ReportTaskTable.propTypes = {
  item: PropTypes.object,
  properties: PropTypes.array,
  title: PropTypes.string,
  feeType: PropTypes.string,
};

ReportTaskTable.defaultProps = {
  item: {},
  title: 'Other revenue',
  properties: [],
};
