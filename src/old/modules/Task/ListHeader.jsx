import React from 'react';
import { Col, Row } from 'reactstrap';

import SortableColumn from './SortableColumn';

const columns = [
  {
    id: 'priority',
    name: 'Priority & Category',
    sortable: true,
  },
  {
    id: 'title',
    name: 'Title & Description',
    size: 4,
    sortable: true,
  },
  {
    id: 'date',
    name: 'Due date',
    size: 1,
    sortable: true,
  },
  {
    id: 'status',
    name: 'Status',
    sortable: true,
  },
  {
    id: 'intentionStatusLabel',
    name: 'Bill Status',
    sortable: true,
  },
  {
    id: 'more',
    name: 'More',
    size: 1,
  },
];

export const TaskListHeader = (props) => (
  <Row className="d-none d-lg-flex text-small text-muted mb-3 px-3">
    {columns.map((column) => (
      <Col
        key={column.id}
        lg={column.size || 2}
        className={`${column.id === 'date' && 'px-1'}`}>
        {column.sortable ? (
          <SortableColumn column={column} {...props} />
        ) : (
          column.name
        )}
      </Col>
    ))}
  </Row>
);

export default TaskListHeader;
