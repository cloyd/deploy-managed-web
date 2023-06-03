import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import localStorage from 'store';

import { useSortableData } from '@app/hooks';

import { useLocationParams, useOnce } from '../../hooks';
import { Pagination } from '../../modules/Pagination';
import { useRolesContext } from '../../modules/Profile';
import { TaskList } from '../../modules/Task';
import { getProfile } from '../../redux/profile';
import {
  STATUSES,
  fetchPropertyTasks,
  fetchTasks,
  getTaskCategories,
  getTaskMeta,
  getTaskStatuses,
  getTasksForProperty,
} from '../../redux/task';
import { fetchManagers, getManagersAsFilters } from '../../redux/users';
import { toQueryObject, toQueryString } from '../../utils';

const PropertyTaskListComponent = ({
  disabledFilters,
  isLoading,
  managers,
  page,
  property,
  tasks,
  taskMeta,
  taskStore,
}) => {
  const dispatch = useDispatch();
  const [type, setType] = useState(null);

  const { isManager, isOwner, isTenant } = useRolesContext();
  const params = useLocationParams();
  let history = useHistory();

  const [isExcludeAgencyBillsHidden, setIsExcludeAgencyBillsHidden] = useState(
    params.type !== 'bill'
  );

  // update Categories if Type query exists
  useEffect(() => {
    params.type && setType(params.type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSearchManager = useCallback(
    (value) => dispatch(fetchManagers(value ? { search: value } : {})),
    [dispatch]
  );

  const handleSearchTask = useCallback(
    (keyword) => {
      history.replace({ search: toQueryString({ ...params, keyword }) });
    },
    [history, params]
  );

  const handleSelectType = useCallback((value) => {
    setIsExcludeAgencyBillsHidden(value.type !== 'bill');

    if (value.type) {
      setType(value.type);
    } else {
      setType(null);
    }
  }, []);

  const handleClear = useCallback(() => {
    history.replace(`/property/${property.id}/tasks?page=1`);
    setIsExcludeAgencyBillsHidden(true);
  }, [history, property.id]);

  useOnce(() => {
    localStorage.remove('tasks'); // no prior task filters to interfere

    if (isManager) {
      fetchManagers();
    }
  });

  useEffect(() => {
    const sortConfig = localStorage.get('propertyTasksSortConfig');

    if (sortConfig) {
      params.sort = sortConfig;
    }

    if (isManager) {
      dispatch(
        fetchTasks({
          ...params,
          isManager,
          propertyId: property.id,
          isPropertyArchived: !!property.archivedAt,
        })
      ); // Fetch tasks list only when paginating or changing filters
    } else {
      dispatch(
        fetchPropertyTasks({
          sort: params?.sort,
          page,
          propertyId: property.id,
        })
      );
    }
  }, [dispatch, isManager, page, params, property.archivedAt, property.id]);

  const handleSortTasks = (sort) => {
    localStorage.set('propertyTasksSortConfig', sort);
    if (isManager) {
      dispatch(
        fetchTasks({
          ...params,
          isManager,
          propertyId: property.id,
          isPropertyArchived: !!property.archivedAt,
          sort,
        })
      ); // Fetch tasks list only when paginating or changing filters
    } else {
      dispatch(
        fetchPropertyTasks({
          sort,
          page,
          propertyId: property.id,
        })
      );
    }
  };

  const { ...sortProps } = useSortableData(
    handleSortTasks,
    localStorage.get('propertyTasksSortConfig')
  );

  return (
    <>
      <TaskList
        disabledFilters={disabledFilters}
        isExcludeAgencyBillsHidden={isExcludeAgencyBillsHidden}
        handleSearchManager={handleSearchManager}
        handleSearchTask={handleSearchTask}
        handleSelectType={handleSelectType}
        handleClear={handleClear}
        isLoading={isLoading}
        isManager={isManager}
        isOwner={isOwner}
        managers={managers}
        metaValues={metaValues}
        statuses={isManager || isOwner ? Object.keys(STATUSES) : []}
        property={property}
        tasks={tasks}
        taskMeta={taskMeta}
        isTenant={isTenant}
        sortProps={sortProps}
      />
      {!isLoading && <Pagination name="tasks" isReload={false} />}
    </>
  );
};

PropertyTaskListComponent.propTypes = {
  disabledFilters: PropTypes.bool,
  isCorporateUser: PropTypes.bool,
  isLoading: PropTypes.bool,
  isManager: PropTypes.bool,
  isOwner: PropTypes.bool,
  managers: PropTypes.array,
  page: PropTypes.string.isRequired,
  statuses: PropTypes.array,
  taskMeta: PropTypes.object,
  taskStore: PropTypes.object,
  properties: PropTypes.array,
  userId: PropTypes.number,
  location: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
  tasks: PropTypes.array,
};

const mapStateToProps = ({ profile, task, users }, props) => {
  return {
    disabledFilters: task.isLoading || task.isLoadingIndex,
    isLoading: !!task.isLoadingIndex,
    managers: getManagersAsFilters(users),
    page: toQueryObject(props.location.search).page || '1',
    status: toQueryObject(props.location.search).status || '',
    tasks: getTasksForProperty(task, props.property),
    taskMeta: getTaskMeta(task),
    taskStore: task,
    userId: getProfile(profile).id,
  };
};

export const PropertyTaskList = connect(mapStateToProps)(
  PropertyTaskListComponent
);
