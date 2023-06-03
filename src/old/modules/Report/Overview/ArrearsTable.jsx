import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'reactstrap';

import { centsToDollar, formatDate } from '../../../utils';
import { Link } from '../../Link';

export const ReportOverviewArrearsTable = (props) => {
  const { className, leases } = props;
  return (
    <div className={className}>
      <Table responsive>
        <thead>
          <tr>
            <th className="align-top">Lease ID</th>
            <th className="align-top">Street Address</th>
            <th className="align-top">Suburb</th>
            <th className="align-top">State</th>
            <th className="align-top">Postcode</th>
            <th className="align-top">Primary Tenant</th>
            <th className="align-top">Current Paid To Date</th>
            <th className="align-top">Days in Arrears</th>
            <th className="align-top">Rental Amount</th>
          </tr>
        </thead>
        <tbody>
          {leases && leases.length > 0 ? (
            leases.map((lease) => (
              <ReportOverviewArrearsRow key={lease.id} lease={lease} />
            ))
          ) : (
            <tr>
              <td className="text-center" colSpan={10}>
                No leases to show.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

ReportOverviewArrearsTable.propTypes = {
  className: PropTypes.string,
  leases: PropTypes.array,
};

ReportOverviewArrearsTable.defaultProps = {
  className: '',
  leases: [],
};

const ReportOverviewArrearsRow = (props) => {
  const { lease } = props;
  const { primaryTenantId } = lease;
  const address = lease.propertyAddress || {};
  const arrears = lease.arrears || {};

  return (
    <tr>
      <td>{lease.id}</td>
      <td>
        <Link to={`/property/${lease.propertyId}`} className="text-left">
          {address.street}
        </Link>
      </td>
      <td>{address.suburb}</td>
      <td>{address.state}</td>
      <td>{address.postcode}</td>
      <td>
        {primaryTenantId && (
          <Link
            href={`/contacts/tenants/${primaryTenantId}`}
            className="text-left">
            {lease.primaryTenantName}
          </Link>
        )}
      </td>
      <td>{formatDate(arrears.rentPaidUpUntil, 'short')}</td>
      <td>{arrears.rentOverdueDays}</td>
      <td>{centsToDollar(arrears.amount)}</td>
    </tr>
  );
};

ReportOverviewArrearsRow.propTypes = {
  lease: PropTypes.object,
};

ReportOverviewArrearsRow.defaultProps = {
  lease: {},
};
