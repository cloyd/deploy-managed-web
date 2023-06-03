import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'reactstrap';

import { formatDate } from '../../../utils';
import { Link } from '../../Link';
import { TaskIcon } from '../../Task';

export const ReportEfficiencyDetailsTable = ({ tasks, ...props }) => {
  return (
    <Table responsive {...props}>
      <thead>
        <tr>
          <th className="align-top">ID</th>
          <th className="align-top">Type</th>
          <th className="align-top">Title</th>
          <th className="align-top">Address</th>
          <th className="align-top">Due Date</th>
          <th className="align-top">Status</th>
        </tr>
      </thead>
      <tbody>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{startCase(task.taskType.key)}</td>
              <td>
                <Link
                  to={`/property/${task.propertyId}/tasks/${task.id}`}
                  className="text-left"
                  disabled={task.archivedAt !== null}>
                  {task.title || '(untitled)'}
                </Link>
                {task.archivedAt !== null && (
                  <small className="badge badge-pill badge-warning text-white">
                    archived
                  </small>
                )}
              </td>
              <td>
                <Link to={`/property/${task.propertyId}`} className="text-left">
                  {task.propertyAddress.street}, {task.propertyAddress.suburb}
                </Link>
              </td>
              <td className="text-nowrap">
                {formatDate(task.dueDate, 'short')}
              </td>
              <td>
                <TaskIcon value={task.taskStatus.key}>
                  <span className="small">
                    {typeof task.taskStatus.key === 'string'
                      ? task.taskStatus.key.replace(/_/g, ' ')
                      : task.taskStatus.key}
                  </span>
                </TaskIcon>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="text-center py-3" colSpan={6}>
              No tasks to show.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

ReportEfficiencyDetailsTable.propTypes = {
  tasks: PropTypes.array,
};

ReportEfficiencyDetailsTable.defaultProps = {
  tasks: [],
};
