import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import { Task } from '.';
import { CardPlain } from '../Card';

export const TaskCard = ({ className, isManager }) => {
  return (
    <CardPlain className={className} classNameInner="px-3 py-2">
      <Row className="align-items-center">
        <Col xs={9} lg={{ order: 2, size: 4 }}>
          <div className="mb-1 mb-sm-0">
            <Task.Title />
            <Task.Description />
          </div>
        </Col>
        <Col xs={3} lg={{ order: 6, size: 1 }}>
          <div className="d-flex align-items-center justify-content-end">
            <Task.Assignee />
            <Task.Edit />
          </div>
        </Col>
        <Col xs={6} lg={{ order: 1, size: 2 }}>
          <Task.Priority />
        </Col>
        <Col xs={6} lg={{ order: 3, size: 1 }} className="text-small px-1">
          <Task.DueDate isManager={isManager} />
        </Col>
        <Col xs={6} lg={{ order: 4, size: 2 }} className="text-small">
          <Task.Status />
        </Col>
        <Col xs={6} lg={{ order: 5, size: 2 }} className="text-small">
          <Task.IntentionStatus />
        </Col>
      </Row>
    </CardPlain>
  );
};

TaskCard.propTypes = {
  className: PropTypes.string,
  isManager: PropTypes.bool,
};
