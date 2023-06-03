import PropTypes from 'prop-types';
import React from 'react';

import { Link } from '../Link';

export const PropertyAddressLink = ({
  className,
  property,
  hasLink,
  isExpiredLease,
}) => {
  const { address, id } = property;
  const { postcode, state, street, suburb } = address || {};

  return hasLink && !isExpiredLease ? (
    <Link to={`/property/${id}`} className={`text-left ${className}`}>
      <small className="text-dark">
        {street}, <br className="d-none d-lg-block" />
        {suburb}, {state}, {postcode}
      </small>
    </Link>
  ) : (
    <small className={`text-dark ${className}`}>
      {street}, <br className="d-none d-lg-block" />
      {suburb}, {state}, {postcode}
    </small>
  );
};

PropertyAddressLink.propTypes = {
  className: PropTypes.string,
  property: PropTypes.object,
  hasLink: PropTypes.bool,
  isExpiredLease: PropTypes.bool,
};

PropertyAddressLink.defaultProps = {
  hasLink: false,
  isExpiredLease: false,
};
