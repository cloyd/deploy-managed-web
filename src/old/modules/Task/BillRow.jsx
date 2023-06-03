import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { UserAvatar } from '@app/modules/User';
import { toClassName } from '@app/utils';

export const TaskBillRow = (props) => {
  const { avatarUrl, children, className, id, name, role } = props;

  return (
    <div className={toClassName(['d-flex'], className)}>
      <UserAvatar role={role} size={0.65} user={{ avatarUrl }} />
      <div className="ml-2 mt-1 d-flex flex-column">
        {role === 'ExternalCreditor' && id ? (
          <Link
            className="text-primary btn-link"
            to={`/marketplace/tradie/${id}`}>
            <strong className="text-capitalize">{name}</strong>
          </Link>
        ) : (
          <strong className="text-capitalize">{name}</strong>
        )}
        <small>{children}</small>
      </div>
    </div>
  );
};

TaskBillRow.defaultProps = {
  children: '...',
  className: '',
  name: '',
  role: 'tenant',
};

TaskBillRow.propTypes = {
  avatarUrl: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  role: PropTypes.string,
};
