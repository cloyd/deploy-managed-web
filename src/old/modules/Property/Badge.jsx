import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { Badge } from 'reactstrap';

import { useRolesContext } from '../../modules/Profile';
import { statusDisplayValue } from '../../utils';

export const PropertyBadge = ({ status = 'draft', ...props }) => (
  <Badge {...props} style={{ alignSelf: 'center' }}>
    {startCase(statusDisplayValue(status))}
  </Badge>
);

PropertyBadge.propTypes = {
  status: PropTypes.string,
};

export const MissingBankDetailsBadge = (props) => {
  const { property, currentLoggedUser, ...otherProps } = props;

  const checkOwnerSplitPercentage = useCallback(
    (property, currentLoggedUser) => {
      // primary owner
      if (
        property.id &&
        currentLoggedUser?.data?.id &&
        property.primaryOwner.id === currentLoggedUser?.data?.id
      ) {
        return 1;
      }
      // secondary owner
      if (
        property.id &&
        currentLoggedUser?.data?.id &&
        property.secondaryOwners.length > 0
      ) {
        let loggedInOwnerDetails = property.secondaryOwners.filter(
          (owner) => owner.id === currentLoggedUser?.data?.id
        );
        return (
          loggedInOwnerDetails &&
          loggedInOwnerDetails.length > 0 &&
          loggedInOwnerDetails[0].ownership.percentageSplit
        );
      }
    },
    []
  );

  const showBadge = useMemo(() => {
    if (currentLoggedUser.data.role === 'manager') {
      return property?.id && property.isDisbursementAccountSet === false;
    }
    if (currentLoggedUser.data.role === 'owner') {
      return (
        property?.id &&
        property.isDisbursementAccountSet === false &&
        currentLoggedUser &&
        checkOwnerSplitPercentage(property, currentLoggedUser) > 0
      );
    }
  }, [currentLoggedUser, property, checkOwnerSplitPercentage]);

  return showBadge ? (
    <Badge className="ml-2" color="danger" {...otherProps}>
      <FontAwesomeIcon
        className="mr-1"
        icon={['far', 'exclamation-triangle']}
      />
      Missing bank
    </Badge>
  ) : null;
};

MissingBankDetailsBadge.propTypes = {
  property: PropTypes.object,
  currentLoggedUser: PropTypes.object,
};

export const InvalidBankDetailsBadge = ({
  isShowText,
  className,
  isRoundedCorners,
}) => {
  const { isCorporateUser, isManager, isOwner } = useRolesContext();
  const canShowInvalidBadge = useMemo(
    () => isCorporateUser || isManager || isOwner,
    [isCorporateUser, isManager, isOwner]
  );

  return canShowInvalidBadge ? (
    <Badge
      className={className}
      color="warning"
      style={{ transform: isRoundedCorners && 'scale(0.8, 0.8)' }}>
      <FontAwesomeIcon
        className={isShowText ? `mr-1` : ''}
        icon={['far', 'exclamation-triangle']}
      />
      {isShowText && 'Invalid bank'}
    </Badge>
  ) : null;
};

InvalidBankDetailsBadge.propTypes = {
  className: PropTypes.string,
  isShowText: PropTypes.bool,
  isRoundedCorners: PropTypes.bool,
};

InvalidBankDetailsBadge.defaultProps = {
  isShowText: true,
  isRoundedCorners: false,
  className: 'ml-2',
};
