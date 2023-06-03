import PropTypes from 'prop-types';
import React from 'react';
import { Badge } from 'reactstrap';

export const TwoFactorAuthStatusBadge = ({ isAuthyEnabled, isLoading }) => {
  if (isLoading) return null;

  return (
    <span>
      {isAuthyEnabled ? (
        <Badge color="success">Enabled</Badge>
      ) : (
        <Badge color="warning">Disabled</Badge>
      )}
    </span>
  );
};

TwoFactorAuthStatusBadge.propTypes = {
  isAuthyEnabled: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
};
