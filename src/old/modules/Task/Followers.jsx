import PropTypes from 'prop-types';
import React from 'react';

import { TaskFollower } from '@app/modules/Task';

export const TaskFollowers = ({ task }) => (
  <div className="d-flex flex-row align-items-center">
    <small className="mt-1 mr-1">Followed by:</small>
    <TaskFollower label="Agency" role="agent" />
    {task.followedByOwner && <TaskFollower label="All owners" role="owner" />}
    {task.followedByTenant && (
      <TaskFollower label="All tenants" role="tenant" />
    )}
  </div>
);

TaskFollowers.propTypes = {
  task: PropTypes.object,
};

TaskFollowers.defaultProps = {
  task: {},
};
