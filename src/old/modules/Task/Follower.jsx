import PropTypes from 'prop-types';
import React from 'react';

import { UserAvatar } from '@app/modules/User';

export const TaskFollower = ({ label, role }) => (
  <>
    <UserAvatar className="mt-1" role={role} size={0.65} />
    <div className="ml-1 mr-2">
      <small className="text-capitalize">{label}</small>
    </div>
  </>
);

TaskFollower.propTypes = {
  label: PropTypes.string,
  role: PropTypes.string,
};
