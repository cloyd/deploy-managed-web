import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'reactstrap';

import {
  centsToDollar,
  daysBetween,
  formatDate,
  toWeeklyFromYear,
} from '../../../utils';
import { Link } from '../../Link';

export const ReportOverviewPropertiesTable = (props) => {
  const { className, properties, isRentReview, isUpcoming } = props;

  return (
    <div className={className}>
      <Table responsive>
        <thead>
          <tr>
            <th className="align-top">ID</th>
            <th className="align-top">Street Address</th>
            <th className="align-top">Suburb</th>
            <th className="align-top">State</th>
            <th className="align-top">Postcode</th>
            {!isRentReview && <th className="align-top">Primary Owner</th>}
            <th className="align-top">Current Weekly Rent</th>
            <th className="align-top">Lease Start</th>
            <th className="align-top">Lease End</th>
            {isUpcoming && <th className="align-top">Days Till Expiry</th>}
            <th className="align-top">Assigned PM</th>
            {isRentReview && <th className="align-top">Review Date</th>}
          </tr>
        </thead>
        <tbody>
          {properties && properties.length > 0 ? (
            properties.map((property) => (
              <ReportOverviewPropertiesRow
                key={property.id}
                property={property}
                isRentReview={isRentReview}
                isUpcoming={isUpcoming}
              />
            ))
          ) : (
            <tr>
              <td className="text-center" colSpan={11}>
                No properties to show.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

ReportOverviewPropertiesTable.propTypes = {
  className: PropTypes.string,
  properties: PropTypes.array,
  type: PropTypes.string,
  isRentReview: PropTypes.bool,
  isUpcoming: PropTypes.bool,
};

ReportOverviewPropertiesTable.defaultProps = {
  className: '',
  properties: [],
};

const ReportOverviewPropertiesRow = (props) => {
  const { property, isRentReview, isUpcoming } = props;
  const { primaryOwner } = property;
  const address = property.address || {};
  const lease = property.lease || {};
  const daysTillExpiry =
    Math.abs(daysBetween(new Date(lease.endDate), new Date())) || 0;

  return (
    <tr>
      <td>{property.id}</td>
      <td>
        <Link to={`/property/${property.id}`} className="text-left">
          {address.street}
        </Link>
      </td>
      <td>{address.suburb}</td>
      <td>{address.state}</td>
      <td>{address.postcode}</td>
      {!isRentReview && (
        <td>
          {primaryOwner && (
            <Link
              href={`/contacts/owners/${primaryOwner.id}`}
              className="text-left">
              {primaryOwner.firstName} {primaryOwner.lastName}
            </Link>
          )}
        </td>
      )}
      <td>{centsToDollar(toWeeklyFromYear(lease.annualRentCents))}</td>
      <td>{formatDate(lease.startDate, 'short')}</td>
      <td>{formatDate(lease.endDate, 'short')}</td>
      {isUpcoming && <td>{daysTillExpiry}</td>}
      <td>
        <Link
          href={`/contacts/managers/${property.managerId}`}
          className="text-left">
          {property.managerName}
        </Link>
      </td>
      {isRentReview && <td>{formatDate(lease.reviewDate, 'short')}</td>}
    </tr>
  );
};

ReportOverviewPropertiesRow.propTypes = {
  property: PropTypes.shape({
    address: PropTypes.object,
    id: PropTypes.number,
    lease: PropTypes.object,
    managerId: PropTypes.number,
    managerName: PropTypes.string,
    primaryOwner: PropTypes.object,
    tenancyStatus: PropTypes.string,
  }),
  isRentReview: PropTypes.string,
  isUpcoming: PropTypes.string,
};

ReportOverviewPropertiesRow.defaultProps = {
  property: {},
};
