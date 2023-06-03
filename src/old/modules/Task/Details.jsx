import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React from 'react';

import { formatDate } from '../../utils';
import { HeaderTitle } from '../Header';
import { Link } from '../Link';
import { IconJob } from '../Marketplace';
import { useRolesContext } from '../Profile';

export const TaskDetails = (props) => {
  const { hasDescription, hasHeader, task } = props;
  const { isManager } = useRolesContext();

  const title =
    task.id && task.taskType.key === 'arrear' ? 'Rent is overdue' : task.title;

  return task.id ? (
    <>
      <Link
        className="text-left"
        to={`/property/${task.propertyId}/tasks/${task.id}`}>
        {hasHeader ? (
          <HeaderTitle className="mb-2">
            <IconJob
              className="mb-1 mr-1"
              hasWorkOrder={task.hasWorkOrder}
              size="xs"
              tradieJobId={task.tradieJobId}
            />{' '}
            {title}
          </HeaderTitle>
        ) : (
          <>
            <FontAwesomeIcon icon={['far', 'chevron-left']} /> Back to task
            <h5 className="mt-3">
              <IconJob
                className="mb-1 mr-1"
                hasWorkOrder={task.hasWorkOrder}
                size="xs"
                tradieJobId={task.tradieJobId}
              />{' '}
              {title}
            </h5>
          </>
        )}
      </Link>
      <p className="small mb-1">
        {task.isArrear ? 'Arrears' : startCase(task.taskType.key)}
        {task.categoryLabel && <span> - {task.categoryLabel}</span>}
      </p>
      {isManager && task.reminderDate && (
        <p className="small mb-0">
          Action date: {formatDate(task.reminderDate)}
        </p>
      )}
      {task.dueDate && (
        <p className="small mb-0">Due date: {formatDate(task.dueDate)}</p>
      )}
      {hasDescription && <p className="my-3">{task.description}</p>}
    </>
  ) : (
    <HeaderTitle
      title={isManager ? 'What needs to be done?' : 'Lodge Request'}
      className="text-dark"
    />
  );
};

TaskDetails.defaultProps = {
  hasDescription: false,
  hasHeader: true,
  task: {},
};

TaskDetails.propTypes = {
  hasDescription: PropTypes.bool,
  hasHeader: PropTypes.bool,
  task: PropTypes.object,
};
