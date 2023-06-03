import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import { Task } from '.';
import { Pagination } from '../Pagination';
import SortableColumn from './SortableColumn';

export const TaskListPreviews = ({
  isManager,
  onClickTask,
  selectedTaskId,
  tasks: tasksProps,
}) => (
  <>
    {!!tasksProps.length &&
      tasksProps.map((taskItem) => (
        <button
          type="button"
          className="d-block w-100 border-0 p-0 mb-2 bg-transparent btn-card"
          key={`task-${taskItem.id}`}
          onClick={onClickTask(taskItem.id, taskItem.propertyId)}>
          <Task value={taskItem}>
            <Task.CardPreview
              className={
                selectedTaskId && selectedTaskId === String(taskItem.id)
                  ? 'alert-secondary'
                  : taskItem.priority === 'emergency'
                  ? 'alert-danger'
                  : undefined
              }
              isManager={isManager}
            />
          </Task>
        </button>
      ))}
    <Pagination className="mt-3" name="tasks" isReload={false} />
  </>
);

TaskListPreviews.defaultProps = {
  tasks: [],
};

TaskListPreviews.propTypes = {
  isManager: PropTypes.bool,
  onClickTask: PropTypes.func.isRequired,
  selectedTaskId: PropTypes.string,
  tasks: PropTypes.array,
};

const columns = [
  {
    id: 'type',
    name: 'Type',
    sortable: true,
  },
  {
    id: 'title',
    name: 'Title',
    size: 4,
    sortable: true,
  },
  {
    id: 'status',
    name: 'Status',
    sortable: true,
  },
  {
    id: 'address',
    name: 'Address',
    sortable: true,
  },
  {
    id: 'date',
    name: 'Due date',
    sortable: true,
  },
];

export const TaskListPreviewsHeader = (props) => (
  <Row className="d-none d-lg-flex text-small text-muted mb-3 no-gutters">
    {columns.map((column) => (
      <Col key={column.id} lg={column.size || 2}>
        <SortableColumn column={column} {...props} />
      </Col>
    ))}
  </Row>
);

TaskListPreviewsHeader.propTypes = {
  requestSort: PropTypes.func.isRequired,
  sortConfig: PropTypes.object,
};
