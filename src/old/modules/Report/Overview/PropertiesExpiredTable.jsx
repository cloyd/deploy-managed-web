import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'reactstrap';

import { daysBetween, formatDate } from '../../../utils';
import { Link } from '../../Link';

export const ReportOverviewPropertiesExpiredTable = (props) => {
  const { className, properties } = props;
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
            <th className="align-top">Current Lease Expiry Date</th>
            <th className="align-top">Days Past Expiry</th>
          </tr>
        </thead>
        <tbody>
          {properties && properties.length > 0 ? (
            properties.map((property) => (
              <ReportOverviewPropertiesExpiredRow
                key={property.id}
                property={property}
              />
            ))
          ) : (
            <tr>
              <td className="text-center" colSpan={8}>
                No properties to show.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

ReportOverviewPropertiesExpiredTable.propTypes = {
  className: PropTypes.string,
  properties: PropTypes.array,
};

ReportOverviewPropertiesExpiredTable.defaultProps = {
  className: '',
  properties: [],
};

const ReportOverviewPropertiesExpiredRow = (props) => {
  const { property } = props;
  const { lease } = property;
  const address = property.address || {};

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
      <td>{formatDate(lease.endDate, 'short')}</td>
      <td>{Math.abs(daysBetween(new Date(lease.endDate)))}</td>
    </tr>
  );
};

ReportOverviewPropertiesExpiredRow.propTypes = {
  property: PropTypes.shape({
    address: PropTypes.object,
    id: PropTypes.number,
    lease: PropTypes.object,
    primaryOwner: PropTypes.object,
    tenancyStatus: PropTypes.string,
  }),
};

ReportOverviewPropertiesExpiredRow.defaultProps = {
  property: {},
};
