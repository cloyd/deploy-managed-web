import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { PulseLoader } from 'react-spinners';
import { Button, Col, Container, Row } from 'reactstrap';

import { Task, TaskListHeader } from '.';
import { useTaskTypes } from '../../modules/Task/hooks';
import { PRIORITIES } from '../../redux/task';
import { Filter } from '../Filter';
import { Header } from '../Header';
import { Link } from '../Link';

export const TaskList = (props) => {
  const {
    defaultFilter,
    disabledFilters,
    handleClear,
    handleSearchManager,
    handleSearchTask,
    handleSelectType,
    isExcludeAgencyBillsHidden,
    isLoading,
    isManager,
    isTenant,
    managers,
    metaValues,
    property,
    tasks,
    taskMeta,
    sortProps,
  } = props;
  const taskTypes = useTaskTypes(taskMeta, isManager);
  const isPastPropertyForTenant = useMemo(
    () =>
      isTenant &&
      (property.status === 'expired' || property.status === 'cancelled'),
    [property.status, isTenant]
  );

  const renderTask = (task) => (
    <Link
      to={`/property/${task.propertyId}/tasks/${task.id}`}
      className="w-100 text-left"
      key={`task-${task.id}`}>
      <Task value={task}>
        <Task.Card
          isManager={isManager}
          className={task.priority === 'emergency' ? 'alert-danger' : undefined}
        />
      </Task>
    </Link>
  );

  return (
    <>
      <Filter name="tasks" defaultParams={defaultFilter} isSaved={true}>
        <Header
          className="p-0"
          color="transparent"
          title="Tasks"
          hasAlert={false}>
          <div className="d-flex align-items-center justify-content-end">
            {isManager && (
              <Filter.Search
                isRightDropdown={true}
                isSubmitOnClick={true}
                label="Search by keyword"
                name="keyword"
                onChange={handleSearchTask}
              />
            )}
            {!isPastPropertyForTenant && (
              <Link to={`/property/${property.id}/tasks/create`}>
                <Button
                  className="ml-3"
                  color="primary"
                  style={{ opacity: property.isArchived ? 0.3 : 1 }}
                  disabled={property.isArchived}>
                  Add a task
                </Button>
              </Link>
            )}
            {isManager && (
              <Link to={`/property/${property.id}/tasks/create?type=bill`}>
                <Button
                  className="ml-3"
                  color="primary"
                  style={{ opacity: property.isArchived ? 0.3 : 1 }}
                  disabled={property.isArchived}>
                  Add a bill
                </Button>
              </Link>
            )}
          </div>
        </Header>
        <Container className="mt-3">
          {isManager && (
            <>
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
                    clearKeysOnChange={[
                      'category',
                      'status',
                      'excludeAgencyBills',
                    ]}
                    label="Type"
                    name="type"
                    onSelect={handleSelectType}
                    values={taskTypes}
                    disabled={disabledFilters}
                  />
                </Col>
                <Col
                  xs={6}
                  md={4}
                  lg={2}
                  className="pb-2 pr-1 pr-md-0 pl-3 pl-md-1">
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
                  <Filter.Clear
                    onClick={handleClear}
                    disabled={disabledFilters}
                  />
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
            </>
          )}

          {!disabledFilters && !isLoading && tasks.length === 0 && (
            <p className="py-4 text-center">
              There are currently no outstanding tasks.
            </p>
          )}

          <>
            {tasks.length !== 0 && <TaskListHeader {...sortProps} />}
            {disabledFilters ? (
              <div className="d-block py-4 text-center mt-4 ">
                <PulseLoader size={12} color="#dee2e6" />
              </div>
            ) : (
              tasks.map(renderTask)
            )}
          </>
        </Container>
      </Filter>
    </>
  );
};

TaskList.defaultProps = {
  isLoading: true,
  isManager: false,
  isOwner: false,
  property: {},
  taskMeta: {},
  tasks: [],
};

TaskList.propTypes = {
  defaultFilter: PropTypes.object,
  disabledFilters: PropTypes.bool,
  handleClear: PropTypes.func,
  handleSearchManager: PropTypes.func,
  handleSearchTask: PropTypes.func,
  handleSelectType: PropTypes.func,
  isExcludeAgencyBillsHidden: PropTypes.bool,
  isLoading: PropTypes.bool,
  isManager: PropTypes.bool,
  isTenant: PropTypes.bool,
  isOwner: PropTypes.bool,
  managers: PropTypes.array,
  metaValues: PropTypes.object,
  property: PropTypes.object,
  statuses: PropTypes.array,
  tasks: PropTypes.array,
  taskMeta: PropTypes.object,
  taskStore: PropTypes.object,
  userId: PropTypes.number,
  sortProps: PropTypes.object,
};
