import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'reactstrap';

import { Link } from '../../Link';

export const ReportOverviewPropertiesVacantTable = (props) => {
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
            <th className="align-top">Days Vacant</th>
          </tr>
        </thead>
        <tbody>
          {properties && properties.length > 0 ? (
            properties.map((property) => (
              <ReportOverviewPropertiesVacantRow
                key={property.id}
                property={property}
              />
            ))
          ) : (
            <tr>
              <td className="text-center" colSpan={7}>
                No properties to show.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

ReportOverviewPropertiesVacantTable.propTypes = {
  className: PropTypes.string,
  properties: PropTypes.array,
};

ReportOverviewPropertiesVacantTable.defaultProps = {
  className: '',
  properties: [],
};

const ReportOverviewPropertiesVacantRow = (props) => {
  const { property } = props;
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
      <td>{property.daysVacant}</td>
    </tr>
  );
};

ReportOverviewPropertiesVacantRow.propTypes = {
  property: PropTypes.shape({
    address: PropTypes.object,
    daysVacant: PropTypes.number,
    id: PropTypes.number,
    currentLease: PropTypes.object,
    primaryOwner: PropTypes.object,
    tenancyStatus: PropTypes.string,
  }),
};

ReportOverviewPropertiesVacantRow.defaultProps = {
  property: {},
};
