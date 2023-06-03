import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import {
  TaskPreviewActivities,
  TaskPreviewEdit,
  TaskPreviewFormNine,
  TaskPreviewOverview,
} from '@app/containers/TaskPreview';
import { ButtonClose } from '@app/modules/Button';
import { TaskActions } from '@app/modules/Task';
import { createInspectionReport } from '@app/redux/inspection';
import { fetchLease, getLease } from '@app/redux/lease';
import { getProfile, isDebtor } from '@app/redux/profile';
import { fetchProperty, getProperty } from '@app/redux/property';
import { fetchTask, getTask, sendTask, updateTask } from '@app/redux/task';

const DEFAULT_SHOW_STATE = {
  formNine: false,
  messageForm: false,
};

const TaskPreviewComponent = (props) => {
  const {
    createInspectionReport,
    fetchTask,
    isDebtor,
    onClose,
    profile,
    property,
    propertyId,
    sendTask,
    task,
    taskId,
    updateTask,
  } = props;

  const [show, setShow] = useState(DEFAULT_SHOW_STATE);

  const handleCreateInspection = useCallback(
    (values) =>
      createInspectionReport({
        propertyId,
        propertyTaskId: task.id,
        ...values,
      }),
    [createInspectionReport, propertyId, task.id]
  );

  const handleSendTask = useCallback(
    () => sendTask({ id: task.id, propertyId: task.propertyId }),
    [sendTask, task.id, task.propertyId]
  );

  const handleToggleShow = useCallback(
    (key) => () => setShow({ ...show, [key]: !show[key] }),
    [show]
  );

  const handleUpdateTask = useCallback(
    (status) => {
      updateTask({
        status,
        propertyId: task.propertyId,
        taskId: task.id,
      });
    },
    [task, updateTask]
  );

  useEffect(() => {
    if (taskId && +taskId !== +task.id) {
      fetchTask({ propertyId, taskId });
    }
  }, [propertyId, taskId, task.id, fetchTask]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (task.leaseId) {
      props.fetchLease({ leaseId: task.leaseId });
    }
  }, [task.leaseId]);

  useEffect(() => {
    if (task.propertyId) {
      props.fetchProperty({ propertyId: task.propertyId });
      setShow(DEFAULT_SHOW_STATE);
    }
  }, [task.propertyId]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-end">
        <ButtonClose hasText={false} size="1x" onClick={onClose} />
      </div>
      <TaskPreviewOverview task={task} />
      <TaskPreviewEdit property={property} task={task} />
      {show.formNine ? (
        <TaskPreviewFormNine
          property={property}
          task={task}
          onToggleForm={handleToggleShow('formNine')}
        />
      ) : (
        <TaskPreviewActivities
          isShowMessageForm={show.messageForm}
          taskId={taskId}
          onToggleForm={handleToggleShow('messageForm')}>
          {!show.messageForm && (
            <TaskActions
              isDebtor={isDebtor}
              isMarketplaceEnabled={profile.isMarketplaceEnabled}
              lease={props.lease}
              property={property}
              task={task}
              onClose={onClose}
              onCreateInspection={handleCreateInspection}
              onEntry={handleToggleShow('formNine')}
              onReply={handleToggleShow('messageForm')}
              onSend={handleSendTask}
              onUpdateTask={handleUpdateTask}
            />
          )}
        </TaskPreviewActivities>
      )}
    </div>
  );
};

TaskPreviewComponent.propTypes = {
  createInspectionReport: PropTypes.func,
  fetchLease: PropTypes.func,
  fetchProperty: PropTypes.func,
  fetchTask: PropTypes.func,
  isDebtor: PropTypes.bool,
  lease: PropTypes.object,
  onClose: PropTypes.func,
  profile: PropTypes.object,
  property: PropTypes.object,
  propertyId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sendTask: PropTypes.func,
  task: PropTypes.object,
  taskId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  updateTask: PropTypes.func,
};

const mapStateToProps = (state, props) => {
  const { taskId } = props;
  const task = getTask(state.task, taskId);

  return {
    task,
    isDebtor: isDebtor(state.profile, task),
    lease: getLease(state.lease, task.leaseId),
    profile: getProfile(state.profile),
    property: getProperty(state.property, task.propertyId),
  };
};

const mapDispatchToProps = {
  createInspectionReport,
  fetchLease,
  fetchProperty,
  fetchTask,
  sendTask,
  updateTask,
};

export const TaskPreview = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskPreviewComponent);
