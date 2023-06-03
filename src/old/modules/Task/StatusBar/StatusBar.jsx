import camelCase from 'lodash/fp/camelCase';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';

import { useIsOpen } from '@app/hooks';
import { ModalConfirm } from '@app/modules/Modal';
import { useRolesContext } from '@app/modules/Profile';
import { TaskStatusBarButton } from '@app/modules/Task';

export const TaskStatusBar = ({ onClick, task, taskMeta }) => {
  const [selectedStatus, setSelectedStatus] = useState();
  const [isOpen, actions] = useIsOpen();
  const { isManager } = useRolesContext();
  const { taskStatus, taskType } = task;

  const statuses = useMemo(() => {
    const meta = taskMeta[camelCase(taskType.key)] || {};
    return meta.statuses || [];
  }, [taskType.key, taskMeta]);

  const indexOfActive = useMemo(() => {
    return statuses.findIndex((item) => item.key === taskStatus.key);
  }, [statuses, taskStatus.key]);

  const handleCancel = useCallback(() => {
    setSelectedStatus(null);
    actions.handleClose();
  }, [actions]);

  const handleClick = useCallback(
    (item) => () => {
      if (isManager) {
        setSelectedStatus(item);
        actions.handleOpen();
      }
    },
    [actions, isManager]
  );

  const handleSubmit = useCallback(() => {
    if (selectedStatus && onClick) {
      onClick(selectedStatus);
      actions.handleClose();
    }
  }, [actions, onClick, selectedStatus]);

  return (
    <div className="status-bar">
      {statuses.map((item, index) => (
        <TaskStatusBarButton
          key={`task-status-${item.key}`}
          isCurrent={index === indexOfActive}
          isDisabled={!isManager}
          isSelected={index >= 0 && index <= indexOfActive}
          status={item.key}
          onClick={handleClick(item.key)}
        />
      ))}
      <ModalConfirm
        isOpen={isOpen}
        onCancel={handleCancel}
        onSubmit={handleSubmit}>
        {selectedStatus &&
          `Are you sure you would like to set task status to "${startCase(
            selectedStatus
          )}"?`}
      </ModalConfirm>
    </div>
  );
};

TaskStatusBar.propTypes = {
  onClick: PropTypes.func,
  task: PropTypes.object,
  taskMeta: PropTypes.object,
};

TaskStatusBar.defaultProps = {
  task: {},
  taskMeta: {},
};
