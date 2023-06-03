import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Table } from 'reactstrap';

import { calculateAami } from '..';
import {
  centsToDollar,
  formatDate,
  percentageOfAmountInCents,
  toDollarFormattedAmount,
  toPercent,
} from '../../../utils';
import { Link } from '../../Link';

export const ReportOverviewLeasesTable = (props) => {
  const { className, leases, multiple } = props;

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
            <th className="align-top">Weekly Rent</th>
            <th className="align-top">Management Fee</th>
            <th className="align-top">Management Fee Amount</th>
            <th className="align-top">AAMI</th>
            <th className="align-top">Estimated Value</th>
            <th className="align-top text-right">Date Added</th>
          </tr>
        </thead>
        <tbody>
          {leases.length > 0 ? (
            leases.map((lease) => (
              <ReportOverviewLeasesRow
                key={lease.id}
                lease={lease}
                multiple={multiple}
              />
            ))
          ) : (
            <tr>
              <td className="text-center" colSpan={11}>
                No leases to show.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

ReportOverviewLeasesTable.propTypes = {
  className: PropTypes.string,
  leases: PropTypes.array,
  multiple: PropTypes.number,
};

ReportOverviewLeasesTable.defaultProps = {
  className: '',
  leases: [],
  multiple: 1,
};

const ReportOverviewLeasesRow = (props) => {
  const { lease, multiple } = props;
  const address = lease.propertyAddress || {};

  const aami = useMemo(
    () =>
      calculateAami(
        lease.averageWeeklyRentCents,
        lease.percentageManagementFee
      ),
    [lease.averageWeeklyRentCents, lease.percentageManagementFee]
  );

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
      <td>{centsToDollar(lease.averageWeeklyRentCents)}</td>
      <td>{toPercent(lease.percentageManagementFee)}%</td>
      <td>
        {centsToDollar(
          percentageOfAmountInCents(
            lease.averageWeeklyRentCents,
            lease.percentageManagementFee
          )
        )}
      </td>
      <td>{centsToDollar(aami)}</td>
      <td>{toDollarFormattedAmount(aami * multiple)}</td>
      <td className="text-nowrap text-right">
        {formatDate(lease.addedDate, 'short')}
      </td>
    </tr>
  );
};

ReportOverviewLeasesRow.propTypes = {
  lease: PropTypes.shape({
    addedDate: PropTypes.string,
    averageWeeklyRentCents: PropTypes.number,
    id: PropTypes.number,
    percentageManagementFee: PropTypes.number,
    propertyId: PropTypes.number,
    propertyAddress: PropTypes.object,
  }),
  multiple: PropTypes.number,
};

ReportOverviewLeasesRow.defaultProps = {
  lease: {},
  multiple: 1,
};
