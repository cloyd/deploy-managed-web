import PropTypes from 'prop-types';
import React from 'react';

import { Link } from '../../Link';

export const ReportManagementAddressLink = (props) => {
  const { address, propertyId } = props;

  return (
    <Link to={`/property/${propertyId}`} className="text-left">
      {address}
    </Link>
  );
};

ReportManagementAddressLink.propTypes = {
  address: PropTypes.string,
  propertyId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

ReportManagementAddressLink.defaultProps = {
  address: '',
};
