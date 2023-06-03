import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { matchPath } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import {
  PropertyTaskCreate,
  PropertyTaskEdit,
  PropertyTaskFormNine,
  PropertyTaskList,
  PropertyTaskOverview,
  PropertyTaskQuote,
} from '@app/containers/PropertyTask';
import { TaskJob } from '@app/containers/TaskJob';
import { usePrevious } from '@app/hooks';
import { TaskHeader } from '@app/modules/Task';
import {
  archiveTask,
  fetchTask,
  fetchTaskMeta,
  getTask,
  getTaskMeta,
  updateTask,
} from '@app/redux/task';
import { toQueryObject } from '@app/utils';

const PropertyTaskComponent = ({
  archiveTask,
  fetchTask,
  fetchTaskMeta,
  history,
  isBill,
  isCreate,
  location,
  match,
  params,
  property,
  task,
  taskMeta,
  tenant,
  updateTask,
}) => {
  const prevTask = usePrevious(task);

  const taskState = useMemo(() => {
    const hasPrevTask = prevTask && prevTask.id;

    return {
      hasBeenDestroyed: hasPrevTask && !isCreate && !task.id,
      hasBeenSent:
        hasPrevTask &&
        !prevTask.isIntentionTriggered &&
        task.isIntentionTriggered &&
        task.id,
    };
  }, [isCreate, prevTask, task.id, task.isIntentionTriggered]);

  const handleBack = useCallback(() => history.goBack(), [history]);

  const handleArchive = useCallback(
    () => archiveTask(task),
    [archiveTask, task]
  );

  const handleChangeStatus = useCallback(
    (status) =>
      updateTask({
        status,
        propertyId: task.propertyId,
        taskId: task.id,
      }),
    [task.id, task.propertyId, updateTask]
  );

  const renderTaskOverview = useCallback(() => {
    return (
      <PropertyTaskOverview
        property={property}
        task={task}
        taskMeta={taskMeta}
      />
    );
  }, [property, task, taskMeta]);

  const renderCreate = useCallback(
    () => (
      <>
        <TaskHeader
          task={task}
          taskMeta={taskMeta}
          isEditPage={true}
          handleArchive={handleArchive}
          handleBack={handleBack}
          handleChangeStatus={handleChangeStatus}
          property={property}
          history={history}
        />
        <PropertyTaskCreate
          history={history}
          isBill={isBill}
          property={property}
          taskMeta={taskMeta}
          tenant={tenant}
        />
      </>
    ),
    [
      task,
      taskMeta,
      handleArchive,
      handleBack,
      handleChangeStatus,
      property,
      history,
      isBill,
      tenant,
    ]
  );

  const renderEdit = useCallback(
    () => (
      <>
        <TaskHeader
          task={task}
          taskMeta={taskMeta}
          isEditPage={true}
          handleArchive={handleArchive}
          handleBack={handleBack}
          handleChangeStatus={handleChangeStatus}
        />
        <PropertyTaskEdit
          history={history}
          isBill={isBill}
          property={property}
          task={task}
          taskMeta={taskMeta}
          tenant={tenant}
        />
      </>
    ),
    [
      task,
      taskMeta,
      handleArchive,
      handleBack,
      handleChangeStatus,
      history,
      isBill,
      tenant,
      property,
    ]
  );

  const renderFormNine = useCallback(
    () => (
      <>
        <TaskHeader task={task} taskMeta={taskMeta} handleBack={handleBack}>
          <h2>Entry notice (Form 9)</h2>
          <p>
            <small>
              Residential Tenancies and Rooming Accommodation Act 2008 (Sections
              192–199)
            </small>
          </p>
        </TaskHeader>
        <PropertyTaskFormNine
          location={location}
          history={history}
          params={params}
          property={property}
          task={task}
          tenant={tenant}
        />
      </>
    ),
    [handleBack, history, location, params, property, task, taskMeta, tenant]
  );

  const renderQuote = useCallback(
    () => (
      <>
        <TaskHeader
          task={task}
          taskMeta={taskMeta}
          handleBack={handleBack}
          handleChangeStatus={handleChangeStatus}
        />
        <PropertyTaskQuote history={history} task={task} />
      </>
    ),
    [task, taskMeta, history, handleBack, handleChangeStatus]
  );

  const renderTaskJob = useCallback(() => {
    return <TaskJob task={task} />;
  }, [task]);

  const renderTasksList = useCallback(
    () => <PropertyTaskList property={property} location={location} />,
    [location, property]
  );

  useEffect(() => {
    // Redirect after destroy task
    // Redirect after send task
    if (taskState.hasBeenDestroyed || taskState.hasBeenSent) {
      history.push(`/property/${property.id}/tasks`);
    }
  }, [property.id, history, taskState]);

  useEffect(() => {
    // Always fetch latest task data when landing on task overview
    if (!taskState.hasBeenDestroyed && !isCreate && params.taskId) {
      fetchTask({ propertyId: property.id, taskId: params.taskId });
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [params.taskId]);

  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (Object.keys(taskMeta).length === 0) {
      fetchTaskMeta({
        propertyId: property.id,
      });
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [fetchTaskMeta, taskMeta]);

  useEffect(() => {
    if (task.id && task.propertyId !== property.id) {
      history.push(`/property/${task.propertyId}/tasks/${task.id}`);
    }
  }, [history, property, task]);

  return (
    <Switch>
      <Route path={match.url} render={renderTasksList} exact />
      <Route path={`${match.url}/create`} render={renderCreate} exact />
      <Route
        path={[`${match.url}/:taskId/bill`, `${match.url}/:taskId/edit`]}
        render={renderEdit}
        exact
      />
      <Route
        path={`${match.url}/:taskId/form-9`}
        render={renderFormNine}
        exact
      />
      <Route path={`${match.url}/:taskId/tradie`} render={renderQuote} exact />
      <Route path={`${match.url}/:taskId/job`} render={renderTaskJob} />
      <Route path={`${match.url}/:taskId`} render={renderTaskOverview} exact />
    </Switch>
  );
};

PropertyTaskComponent.propTypes = {
  archiveTask: PropTypes.func.isRequired,
  fetchTask: PropTypes.func.isRequired,
  fetchTaskMeta: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isBill: PropTypes.bool.isRequired,
  isCreate: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  params: PropTypes.object,
  property: PropTypes.object.isRequired,
  task: PropTypes.object,
  taskMeta: PropTypes.object,
  tenant: PropTypes.object.isRequired,
  updateTask: PropTypes.func.isRequired,
};

PropertyTaskComponent.defaultProps = {
  task: {},
};

const getParams = ({ history, match }) => {
  const { location } = history;
  const search = toQueryObject(location.search);

  const mp = matchPath(location.pathname, {
    path: `${match.url}/:taskId`,
  });

  return {
    ...(mp ? mp.params : {}),
    ...search,
  };
};

const mapStateToProps = (state, props) => {
  const { location } = props;
  const params = getParams(props);
  return {
    params,
    isBill:
      /type=bill/.test(location.search) || /bill$/.test(location.pathname),
    isCreate: /create$/.test(location.pathname),
    isLoading: state.task.isLoading,
    task: getTask(state.task, params.taskId),
    taskMeta: getTaskMeta(state.task),
  };
};

const mapDispatchToProps = {
  archiveTask,
  fetchTask,
  fetchTaskMeta,
  updateTask,
};

export const PropertyTask = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyTaskComponent);
