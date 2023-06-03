import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { CardLight } from '../../modules/Card';
import { useRolesContext } from '../../modules/Profile';
import { TaskFormMessage, TaskMessage } from '../../modules/Task';
import { useTaskFetchActivities } from '../../modules/Task/hooks';
import { getProfile, getRole } from '../../redux/profile';
import {
  createTaskMessage,
  fetchTask,
  fetchTaskActivities,
  getTask,
  getTaskActivities,
  getTaskLastReplyingRole,
  sendTask,
} from '../../redux/task';

const TaskPreviewActivitiesComponent = (props) => {
  const {
    activities,
    createTaskMessage,
    fetchTaskActivities,
    isLoadingActivities,
    isShowMessageForm,
    onToggleForm,
    replyTo,
    task,
  } = props;

  const { isManager, isOwner, isTenant } = useRolesContext();

  const hasActivities = activities.length > 0;
  const defaultReplyTo =
    replyTo && replyTo.length > 0
      ? replyTo
      : !isManager || task.taskStatus.key === 'draft'
      ? 'agency'
      : 'all';

  useTaskFetchActivities({
    fetchTaskActivities,
    propertyId: task.propertyId,
    taskId: task.id,
  });

  const handleSubmitMessage = useCallback(
    (values) => {
      const replyToAll = values.replyTo === 'all' && isManager;

      const replyToOwners =
        isOwner || replyToAll || (values.replyTo === 'owners' && isManager);

      const replyToTenants =
        isTenant || replyToAll || (values.replyTo === 'tenants' && isManager);

      createTaskMessage({
        ...values,
        propertyId: task.propertyId,
        taskId: task.id,
        toAgency: true,
        toOwner: replyToOwners,
        toTenant: replyToTenants,
      });

      if (onToggleForm) {
        onToggleForm();
      }
    },
    [
      createTaskMessage,
      isManager,
      isOwner,
      isTenant,
      onToggleForm,
      task.id,
      task.propertyId,
    ]
  );

  return (
    <CardLight
      className="mt-2"
      title={hasActivities ? 'Task activities' : null}>
      {!isLoadingActivities && hasActivities ? (
        <div
          className="d-block"
          style={{ maxHeight: '560px', overflowY: 'scroll' }}>
          <div className="my-3">
            {activities.map((activity) => (
              <TaskMessage
                key={`activity-${activity.id}`}
                activity={activity}
                creatorType={task.creatorType}
                isFullWidth={true}
                isManager={isManager}
                isMarketplaceEnabled={props.isMarketplaceEnabled}
              />
            ))}
          </div>
        </div>
      ) : null}
      {isShowMessageForm && (
        <div className="bg-white border-top p-3">
          <TaskFormMessage
            hasError={false}
            isDraft={task.taskStatus.key === 'draft'}
            isLoading={props.isLoading}
            isManager={isManager}
            isOverlayed={false}
            onCancel={onToggleForm}
            onSubmit={handleSubmitMessage}
            replyTo={defaultReplyTo}
          />
        </div>
      )}
      {props.children && (
        <div className={hasActivities ? 'pt-3 px-0 border-top' : 'p-3'}>
          {props.children}
        </div>
      )}
    </CardLight>
  );
};

TaskPreviewActivitiesComponent.defaultProps = {
  activities: [],
};

TaskPreviewActivitiesComponent.propTypes = {
  activities: PropTypes.array,
  children: PropTypes.node,
  createTaskMessage: PropTypes.func.isRequired,
  fetchTask: PropTypes.func.isRequired,
  fetchTaskActivities: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isLoadingActivities: PropTypes.bool,
  isMarketplaceEnabled: PropTypes.bool,
  isShowMessageForm: PropTypes.bool,
  onToggleForm: PropTypes.func,
  replyTo: PropTypes.string,
  sendTask: PropTypes.func.isRequired,
  task: PropTypes.object,
  taskId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const mapStateToProps = (state, props) => {
  const { taskId } = props;
  const task = getTask(state.task, taskId);
  const activities = getTaskActivities(state.task, task);

  return {
    activities,
    isLoading: state.task.isLoading,
    isLoadingActivities: state.task.isLoadingActivities,
    isMarketplaceEnabled: getProfile(state.profile).isMarketplaceEnabled,
    replyTo: getTaskLastReplyingRole(activities, getRole(state.profile)),
    task,
  };
};

const mapDispatchToProps = {
  createTaskMessage,
  fetchTask,
  fetchTaskActivities,
  sendTask,
};

export const TaskPreviewActivities = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskPreviewActivitiesComponent);
