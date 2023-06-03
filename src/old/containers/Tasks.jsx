import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Button, Col, Container, Row } from 'reactstrap';
import localStorage from 'store';

import { useSortableData } from '@app/hooks';

import {
  useIsMobile,
  useLocationParams,
  useOnce,
  useUpdateParam,
} from '../hooks';
import { Filter, findItemByValue } from '../modules/Filter';
import { Header } from '../modules/Header';
import { useRolesContext } from '../modules/Profile';
import { TaskListPreviews, TaskListPreviewsHeader } from '../modules/Task';
import { useTaskTypes } from '../modules/Task/hooks';
import { getProfile } from '../redux/profile';
import { fetchProperties, getPropertyList } from '../redux/property';
import {
  PRIORITIES,
  fetchTaskMeta,
  fetchTasks,
  getTask,
  getTaskCategories,
  getTaskMeta,
  getTaskStatuses,
  getTasks,
} from '../redux/task';
import { fetchManagers, getManagersAsFilters } from '../redux/users';
import { toQueryObject, toQueryString } from '../utils';
import { TaskPreview } from './TaskPreview';

const TasksComponent = (props) => {
  const {
    disabledFilters,
    history,
    isLoading,
    managers,
    properties,
    taskMeta,
    taskPropertyId,
    tasks,
    taskStore,
    userId,
  } = props;

  const dispatch = useDispatch();

  const sortConfig = localStorage.get('tasksSortConfig');

  const [type, setType] = useState(null);

  const { isManager, isCorporateUser } = useRolesContext();
  const taskTypes = useTaskTypes(taskMeta, isManager);
  const isMobile = useIsMobile();

  const { updateMultipleParams, updateSingleParam } = useUpdateParam();
  const params = useLocationParams();

  const [isExcludeAgencyBillsHidden, setIsExcludeAgencyBillsHidden] = useState(
    params.type !== 'bill'
  );

  const showPreview = useMemo(
    // Previews not shown on mobile sizes
    () => params && params.taskId && taskPropertyId && !isMobile,
    [isMobile, params, taskPropertyId]
  );

  const metaValues = useMemo(
    () => ({
      categories: getTaskCategories(taskStore, type),
      statuses: getTaskStatuses(
        taskStore,
        type === 'arrears' ? 'arrear' : type
      ),
    }),
    [taskStore, type]
  );

  const defaultFilter = useMemo(
    () => (isManager && !isCorporateUser ? { assigneeId: userId } : {}),
    [isCorporateUser, isManager, userId]
  );

  const handleAddTask = useCallback(
    (query) => () =>
      history.push(
        `/property/${params.propertyId}/tasks/create${
          query ? toQueryString(query) : ''
        }`
      ),
    [params.propertyId, history]
  );

  const handleClear = useCallback(() => {
    history.replace('/tasks?page=1');
    setIsExcludeAgencyBillsHidden(true);
  }, [history]);

  const handleClickTask = useCallback(
    (taskId, propertyId) => () => {
      if (isMobile) {
        history.push(`/property/${propertyId}/tasks/${taskId}`);
      } else {
        updateSingleParam('taskId')(taskId);
      }
    },
    [history, isMobile, updateSingleParam]
  );

  const handleClosePreview = useCallback(
    () => updateMultipleParams({ taskId: undefined, page: params.page || 1 }),
    [params.page, updateMultipleParams]
  );

  const handleSearchManager = useCallback(
    (value) => dispatch(fetchManagers(value ? { search: value } : {})),
    [dispatch]
  );

  const handleSearchProperty = useCallback(
    (address) => dispatch(fetchProperties({ address })),
    [dispatch]
  );

  const handleSelectType = useCallback((value) => {
    setIsExcludeAgencyBillsHidden(value.type !== 'bill');

    if (value.type) {
      setType(value.type);
    } else {
      setType(null);
    }
  }, []);

  // update Categories if Type query exists
  useEffect(() => {
    params.type && setType(params.type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // Fetch property to ensure address filter displays correctly
    if (params.propertyId) {
      const propertyNotFound = !findItemByValue(properties, params.propertyId);
      propertyNotFound &&
        dispatch(fetchProperties({ propertyId: params.propertyId }));
    }
  }, [params.propertyId]);

  useEffect(() => {
    dispatch(fetchManagers());

    if (Object.keys(taskMeta).length === 0) {
      dispatch(
        fetchTaskMeta({
          propertyId: params.propertyId,
        })
      );
    }
  }, []);

  useEffect(() => {
    // Fetch tasks list only when paginating or changing filters

    if (sortConfig) {
      params.sort = sortConfig;
    }

    if (params.status) {
      dispatch(fetchTasks({ ...params, isManager }));
    } else {
      dispatch(
        fetchTasks({
          ...params,
          statusNotIn: ['completed', 'declined'],
          isManager,
        })
      );
    }
  }, [
    params.assigneeId,
    params.category,
    params.excludeAgencyBills,
    params.page,
    params.priority,
    params.propertyId,
    params.status,
    params.type,
  ]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useOnce(() => {
    localStorage.remove('tasks'); // no prior task filters to interfere
  });

  const handleSortTasks = (sort) => {
    localStorage.set('tasksSortConfig', sort);
    if (params.status) {
      dispatch(fetchTasks({ ...params, isManager }));
    } else {
      dispatch(
        fetchTasks({
          ...params,
          statusNotIn: ['completed', 'declined'],
          isManager,
          sort,
        })
      );
    }
  };

  const sortProps = useSortableData(handleSortTasks, sortConfig);

  const { page, ...filterParams } = params;

  return (
    <Filter name="tasks" defaultParams={defaultFilter} isSaved>
      <Header title="Tasks">
        <div className="d-flex w-100">
          <Filter.Search
            isRightDropdown
            isSubmitOnClick
            label="Enter Street Address"
            name="propertyId"
            values={properties}
            onChange={handleSearchProperty}
          />
          <Button
            color="primary"
            className="ml-3 text-nowrap"
            disabled={!params.propertyId}
            onClick={handleAddTask()}>
            <span className="d-none d-sm-inline">Add a </span>Task
          </Button>
          <Button
            color="primary"
            className="ml-3 text-nowrap"
            disabled={!params.propertyId}
            onClick={handleAddTask({ type: 'bill' })}>
            <span className="d-none d-sm-inline">Add a </span>Bill
          </Button>
        </div>
      </Header>
      <Container className="mt-3">
        <Row className="d-flex pr-md-3 pr-lg-3">
          <Col xs={6} md={4} lg={2} className="pb-2 pr-1">
            <Filter.TypeaheadSelect
              label="Priority"
              name="priority"
              values={PRIORITIES}
              disabled={disabledFilters}
            />
          </Col>
          <Col xs={6} md={4} lg={2} className="pb-2 pl-1 pr-md-1">
            <Filter.TypeaheadSelect
              clearKeysOnChange={['category', 'status', 'excludeAgencyBills']}
              label="Type"
              name="type"
              onSelect={handleSelectType}
              values={taskTypes}
              disabled={disabledFilters}
            />
          </Col>
          <Col xs={6} md={4} lg={2} className="pb-2 pr-1 pr-md-0 pl-3 pl-md-1">
            <Filter.TypeaheadSelect
              label="Category"
              name="category"
              values={metaValues.categories}
              disabled={disabledFilters}
            />
          </Col>
          <Col
            xs={6}
            md={4}
            lg={2}
            className="pb-2 pl-1 pl-md-3 pl-lg-2 pr-md-1">
            <Filter.TypeaheadSelect
              label="Status"
              name="status"
              values={metaValues.statuses}
              disabled={disabledFilters}
            />
          </Col>
          <Col
            xs={6}
            md={4}
            lg={2}
            className="pb-2 pr-1 pr-md-0 pl-3 pl-md-1 pr-lg-1">
            <Filter.TypeaheadSelect
              label="Manager"
              name="assigneeId"
              values={managers}
              onKeyDown={handleSearchManager}
              disabled={disabledFilters}
            />
          </Col>
          <Col xs={3} md={2} lg={1} className="pt-2 px-1 text-center">
            <Filter.Clear onClick={handleClear} disabled={disabledFilters} />
          </Col>
          <Col
            xs={3}
            md={2}
            lg={1}
            className="pl-3 pl-md-1 flex-lg-fill text-center pl-sm-0 pr-sm-3 pr-md-0">
            <Filter.Submit
              className="mt-1 w-100"
              color="primary"
              size="md"
              disabled={disabledFilters}>
              Filter
            </Filter.Submit>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            {!isExcludeAgencyBillsHidden && (
              <Filter.Check
                label="Exclude Agency Bills"
                name="excludeAgencyBills"
                disabled={disabledFilters}
              />
            )}
          </Col>
        </Row>

        {!disabledFilters && !isLoading && tasks.length === 0 && (
          <p className="py-4 text-center">
            {Object.keys(filterParams).length
              ? 'There are currently no tasks matching your query.'
              : 'There are currently no outstanding tasks.'}
          </p>
        )}

        <Row>
          <Col lg={showPreview ? 8 : 12}>
            {tasks.length !== 0 && <TaskListPreviewsHeader {...sortProps} />}
            {disabledFilters ? (
              <div className="d-block py-4 text-center mt-4 ">
                <PulseLoader size={12} color="#dee2e6" />
              </div>
            ) : (
              <TaskListPreviews
                isManager={isManager}
                selectedTaskId={params.taskId}
                tasks={tasks}
                onClickTask={handleClickTask}
                sortProps={sortProps}
              />
            )}
          </Col>
          {!isLoading && showPreview && (
            <Col lg={4}>
              <TaskPreview
                propertyId={taskPropertyId}
                taskId={params.taskId}
                onClose={handleClosePreview}
              />
            </Col>
          )}
        </Row>
      </Container>
    </Filter>
  );
};

TasksComponent.propTypes = {
  disabledFilters: PropTypes.bool,
  history: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  location: PropTypes.object.isRequired,
  managers: PropTypes.array,
  properties: PropTypes.array,
  taskPropertyId: PropTypes.number,
  taskMeta: PropTypes.object,
  tasks: PropTypes.array,
  taskStore: PropTypes.object,
  userId: PropTypes.number,
};

TasksComponent.deaultProps = {
  disabledFilters: true,
  isLoading: true,
  managers: [],
  properties: [],
  taskMeta: {},
  tasks: [],
  taskStore: {},
};

const mapStateToProps = ({ profile, property, task, users }, props) => {
  const { location } = props;
  const params = toQueryObject(location.search);

  return {
    disabledFilters: task.isLoading || task.isLoadingIndex,
    isLoading: task.isLoadingIndex,
    managers: getManagersAsFilters(users),
    taskPropertyId: getTask(task, params.taskId).propertyId,
    properties: getPropertyList(property),
    tasks: getTasks(task, params.type),
    taskMeta: getTaskMeta(task),
    taskStore: task,
    userId: getProfile(profile).id,
  };
};

export const Tasks = connect(mapStateToProps)(TasksComponent);
