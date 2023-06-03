import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'reactstrap';

import { ReportTitle, ReportTotalProperties } from '..';
import { centsToDollar, toPercent } from '../../../utils';
import { ButtonPrint } from '../../Button';
import { Link } from '../../Link';

export const ReportRentTable = ({ item, title, ...props }) => {
  const { report, type, properties } = item;

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
            <th className="align-top">Address</th>
            <th className="align-top">Rent Paid</th>
            <th className="align-top">Management Fee</th>
            <th className="align-top">Gross Fee Collected</th>
            <th className="align-top">GST</th>
            <th className="align-top">Transaction Cost</th>
            <th className="align-top">Transaction GST</th>
            <th className="align-top">
              Net Fee Collected
              <br />
              <small>(incl GST)</small>
            </th>
          </tr>
        </thead>
        <tbody>
          {properties.length > 0 ? (
            properties.map((property) => (
              <tr key={property.id}>
                <td>{property.propertyId}</td>
                <td>
                  <Link
                    to={`/property/${property.propertyId}`}
                    className="text-left">
                    {property.propertyFullAddress}
                  </Link>
                </td>
                <td>{centsToDollar(property.tenantAmountCents)}</td>
                <td>{toPercent(property.propertyPercentageManagementFee)}%</td>
                <td>{centsToDollar(property.agencyAmountCents)}</td>
                <td>{centsToDollar(property.agencyAmountGstCents)}</td>
                <td>{centsToDollar(property.agencyFeeCents)}</td>
                <td>{centsToDollar(property.agencyFeeGstCents)}</td>
                <td>{centsToDollar(property.agencyNetAmountCents)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center" colSpan={9}>
                No revenue to show.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};

ReportRentTable.propTypes = {
  item: PropTypes.object,
  title: PropTypes.string,
};

ReportRentTable.defaultProps = {
  item: {},
  title: 'Management fees',
};
