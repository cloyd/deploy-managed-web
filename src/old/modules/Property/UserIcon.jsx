import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Badge } from 'reactstrap';

import { InvalidBankDetailsBadge } from '.';
import { useClassName } from '../../hooks';
import { fullName, toPercentFormattedAmount } from '../../utils';
import { Link } from '../Link';
import { UserAvatar } from '../User';

export const PropertyUserIcon = (props) => {
  const { disabled, role, user, isArchived, isMissingBank, isInvalidBank } =
    props;

  const className = useClassName(
    ['d-flex', 'align-items-center'],
    props.className
  );

  return user ? (
    <Link
      className={className}
      to={disabled ? '#' : `/contacts/${role}s/${user.id}`}
      disabled={isArchived}>
      <small className="text-capitalize mr-2">
        {props.userName || fullName(user)}
      </small>
      <UserAvatar
        isActive={props.isActive || user.status === 'active'}
        role={role}
        size={props.size || 0.8}
        user={user}
      />
      {props.isShowOwnershipPercentage && props.hasMultipleOwners && (
        <Badge className="ml-1" color="primary" title="Ownership Percentage">
          {toPercentFormattedAmount(props.percentageOwnership || 0)}
        </Badge>
      )}
      {props.isPrimary && (
        <Badge className="ml-1" color="primary">
          Primary Owner
        </Badge>
      )}
      {isMissingBank && (
        <Badge className="ml-1" color="danger">
          <FontAwesomeIcon icon={['far', 'exclamation-triangle']} />
        </Badge>
      )}
      {isInvalidBank && (
        <InvalidBankDetailsBadge className="ml-1" isShowText={false} />
      )}
    </Link>
  ) : null;
};

PropertyUserIcon.propTypes = {
  className: '',
  disabled: true,
};

PropertyUserIcon.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hasMultipleOwners: PropTypes.bool,
  isActive: PropTypes.bool,
  isPrimary: PropTypes.bool,
  isShowOwnershipPercentage: PropTypes.bool,
  percentageOwnership: PropTypes.number,
  role: PropTypes.string.isRequired,
  size: PropTypes.number,
  user: PropTypes.object.isRequired,
  userName: PropTypes.string,
  isArchived: PropTypes.bool,
  isMissingBank: PropTypes.bool,
  isInvalidBank: PropTypes.bool,
};
