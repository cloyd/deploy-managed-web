import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';

import { useOnce } from '../../hooks';
import { TaskFormPreview } from '../../modules/Task';
import { hasError } from '../../redux/notifier';
import { fetchTaskMeta, getTaskMeta, updateTask } from '../../redux/task';

const TaskPreviewEditComponent = (props) => {
  const { property, task, taskMeta, updateTask } = props;

  const handleSubmitEditTask = useCallback(
    (values) => updateTask(values),
    [updateTask]
  );

  useOnce(() => {
    if (Object.keys(taskMeta).length === 0) {
      props.fetchTaskMeta({
        propertyId: property.id,
      });
    }
  });

  return props.isLoading || !property.id ? (
    <div className="d-block py-4 text-center">
      <PulseLoader size={12} color="#dee2e6" />
    </div>
  ) : (
    <div className="px-md-0 py-3 border-top">
      <TaskFormPreview
        hasError={props.hasError}
        isLoading={false}
        property={property}
        task={task}
        taskMeta={taskMeta}
        onSubmit={handleSubmitEditTask}
      />
    </div>
  );
};

TaskPreviewEditComponent.propTypes = {
  fetchTaskMeta: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  property: PropTypes.object,
  task: PropTypes.object,
  taskId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  taskMeta: PropTypes.object,
  updateTask: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  hasError: hasError(state),
  isLoading: state.task.isLoading,
  taskMeta: getTaskMeta(state.task),
});

const mapDispatchToProps = {
  fetchTaskMeta,
  updateTask,
};

export const TaskPreviewEdit = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskPreviewEditComponent);
