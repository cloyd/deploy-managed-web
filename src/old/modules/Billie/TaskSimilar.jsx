import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Button } from 'reactstrap';

import { formatDate } from '../../utils';

export const BillieTaskSimilar = ({ isActive, onClick, task }) => {
  const dueDate = useMemo(() => {
    return task.dueDate && `(${formatDate(task.dueDate)})`;
  }, [task.dueDate]);

  const icon = useMemo(
    () => (isActive ? 'check-circle' : 'circle'),
    [isActive]
  );

  return (
    <Button onClick={onClick} color="link" className="p-0 d-block text-left">
      <FontAwesomeIcon icon={['far', icon]} className="mr-1" />
      {task.title} {dueDate} &ndash; <i>{task.taskStatus.key}</i>
    </Button>
  );
};

BillieTaskSimilar.propTypes = {
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
};

BillieTaskSimilar.defaultProps = {
  isActive: false,
};
