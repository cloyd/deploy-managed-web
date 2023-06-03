import PropTypes from 'prop-types';
import React from 'react';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Container } from 'reactstrap';

import { ButtonDestroy, ButtonIcon } from '@app/modules/Button';
import { DividerDouble } from '@app/modules/Divider';
import { useRolesContext } from '@app/modules/Profile';
import {
  TaskCustomModalButton,
  TaskDetails,
  TaskFollowers,
  TaskStatusBar,
  useTaskPermissions,
} from '@app/modules/Task';

export const TaskHeader = ({
  children,
  handleArchive,
  handleBack,
  handleChangeStatus,
  isEditPage,
  task,
  taskMeta,
  property,
  history,
}) => {
  const { isManager } = useRolesContext();
  const { canManageCustomTask } = useTaskPermissions(task, { property });
  const { arrears } = task;

  return (
    <Container className="mb-3">
      {handleBack && isManager && (
        <ButtonIcon
          className="p-0 mb-3"
          icon={['far', 'chevron-left']}
          onClick={handleBack}>
          Back
        </ButtonIcon>
      )}
      {canManageCustomTask && (
        <TaskCustomModalButton
          className="float-right"
          history={history}
          property={property}
          taskMeta={taskMeta}
        />
      )}
      {!!children && (
        <>
          {children}
          <DividerDouble className="my-4" />
        </>
      )}
      {!!task.id && handleChangeStatus && (
        <TaskStatusBar
          task={task}
          taskMeta={taskMeta}
          onClick={handleChangeStatus}
        />
      )}
      <TaskDetails task={task} />
      {arrears && arrears.rentOverdueDays > 0 && (
        <p className="small mb-0">
          Payment is overdue by: {arrears.rentOverdueDays} days
        </p>
      )}
      {!isEditPage && <TaskFollowers task={task} />}
      {isEditPage &&
        isManager &&
        !!task.id &&
        !task.isIntentionComplete &&
        handleArchive && (
          <ButtonDestroy onConfirm={handleArchive} className="mt-2 text-small">
            Archive Task
          </ButtonDestroy>
        )}
    </Container>
  );
};

TaskHeader.defaultProps = {
  isEditPage: false,
  task: {},
};

TaskHeader.propTypes = {
  children: PropTypes.node,
  handleArchive: PropTypes.func,
  handleBack: PropTypes.func,
  handleChangeStatus: PropTypes.func,
  isEditPage: PropTypes.bool,
  task: PropTypes.object,
  taskMeta: PropTypes.object,
  property: PropTypes.object,
  history: PropTypes.object,
};
