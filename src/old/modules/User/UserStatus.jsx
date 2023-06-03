import PropTypes from 'prop-types';
import React from 'react';
import { Badge } from 'reactstrap';

export const UserStatus = ({ status }) => {
  if (!status) return null;

  return (
    <span>
      {(() => {
        switch (status) {
          case 'active':
            return <Badge color="success">Active</Badge>;
          case 'invited':
            return <Badge color="info">Invited</Badge>;
          case 'draft':
            return <Badge color="warning">Awaiting invite</Badge>;
          default:
            return <Badge color="warning">Awaiting invite</Badge>;
        }
      })()}
    </span>
  );
};

UserStatus.propTypes = {
  status: PropTypes.string,
};
