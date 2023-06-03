import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'reactstrap';

import { PROPERTY_LOST_REASON } from '../../../redux/property';
import { centsToDollar, formatDate } from '../../../utils';
import { Link } from '../../Link';
import { ReportManagementAddressLink } from './AddressLink';

export const ReportManagementLostTable = (props) => {
  const { propertyManagements } = props;

  return (
    <Table responsive>
      <thead>
        <tr>
          <th className="align-top">Property ID</th>
          <th className="align-top">Street Address</th>
          <th className="align-top">Suburb</th>
          <th className="align-top">State</th>
          <th className="align-top">Postcode</th>
          <th className="align-top">Primary Owner</th>
          <th className="align-top">Weekly Rent</th>
          <th className="align-top">Lost Date</th>
          <th className="align-top">Reason Type</th>
          <th className="align-top">Lost Reason</th>
          <th className="align-top">Preventive Action</th>
          <th className="align-top">Comment</th>
        </tr>
      </thead>
      <tbody>
        {propertyManagements.length > 0 ? (
          propertyManagements.map((management) => (
            <ReportManagementLostRow
              key={management.id}
              management={management}
            />
          ))
        ) : (
          <tr>
            <td className="text-center py-3" colSpan={12}>
              No property managements to show.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

ReportManagementLostTable.propTypes = {
  propertyManagements: PropTypes.array,
};

ReportManagementLostTable.defaultProps = {
  propertyManagements: [],
};

const ReportManagementLostRow = (props) => {
  const { management } = props;
  const { isArchived, primaryOwner } = management;
  const address = management.propertyAddress || {};

  return (
    <tr>
      <td>{management.propertyId}</td>
      <td>
        <ReportManagementAddressLink
          address={address.street}
          isArchived={isArchived}
          propertyId={management.propertyId}
        />
      </td>
      <td>{address.suburb}</td>
      <td>{address.state}</td>
      <td>{address.postcode}</td>
      <td>
        {primaryOwner && (
          <Link
            href={`/contacts/owners/${primaryOwner.id}`}
            className="text-left">
            {primaryOwner.firstName} {primaryOwner.lastName}
          </Link>
        )}
      </td>
      <td>{centsToDollar(management.averageWeeklyRentCents)}</td>
      <td className="text-nowrap">
        {formatDate(management.createdAt, 'short')}
      </td>
      <td>{PROPERTY_LOST_REASON[management.lostReasonType]}</td>
      <td>{management.reasonSource}</td>
      <td className="align-top">{management.preventiveAction}</td>
      <td className="align-top">{management.comment}</td>
    </tr>
  );
};

ReportManagementLostRow.propTypes = {
  management: PropTypes.object,
};

ReportManagementLostRow.defaultProps = {
  management: {},
};
