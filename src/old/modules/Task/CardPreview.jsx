import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import { Task } from '.';
import { CardPlain } from '../Card';

export const TaskCardPreview = ({ className, isManager }) => (
  <CardPlain className={className} isHideSpacing classNameInner="py-2">
    <Row className="align-items-center text-left">
      <Col sm={8} lg={{ order: 2, size: 4 }} className="text-truncate px-1">
        <Task.Title />
      </Col>
      <Col sm={4} lg={{ order: 5, size: 2 }} className="text-small px-1">
        <Task.DueDatePreview isManager={isManager} />
      </Col>
      <Col lg={{ order: 4, size: 2 }} className="px-1">
        <Task.PropertyPreview />
      </Col>
      <Col
        xs={6}
        sm={8}
        lg={{ order: 1, size: 2 }}
        className="text-truncate px-1">
        <Task.Type />
      </Col>
      <Col xs={6} sm={4} lg={{ order: 3, size: 2 }} className="px-1">
        <Task.Status />
      </Col>
    </Row>
  </CardPlain>
);

TaskCardPreview.propTypes = {
  className: PropTypes.string,
  isManager: PropTypes.bool,
};
