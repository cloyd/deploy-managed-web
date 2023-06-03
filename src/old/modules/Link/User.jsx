import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { USER_TYPES } from '../../redux/users';
import { Link } from './Link';

export const LinkUser = (props) => {
  const { hasLink, userId, userName, userType } = props;

  const link = useMemo(
    () =>
      !hasLink
        ? null
        : userType === USER_TYPES.externalCreditor
        ? `/marketplace/tradie/${userId}`
        : userType === USER_TYPES.manager
        ? `/contacts/managers/${userId}`
        : userType === USER_TYPES.owner
        ? `/contacts/owners/${userId}`
        : userType === USER_TYPES.tenant
        ? `/contacts/tenants/${userId}`
        : null,
    [hasLink, userId, userType]
  );

  return link ? (
    <Link to={link}>
      <small className="text-capitalize">{userName || ''}</small>
    </Link>
  ) : (
    <small className="text-capitalize">{userName || ''}</small>
  );
};

LinkUser.defaultProps = {
  hasLink: true,
};

LinkUser.propTypes = {
  hasLink: PropTypes.bool,
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  userName: PropTypes.string,
  userType: PropTypes.string,
};
