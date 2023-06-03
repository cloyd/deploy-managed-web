import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

export const ContentDetail = ({ children, title, value }) => (
  <Row>
    <Col xs={3} lg={2}>
      <strong>{title}:</strong>
    </Col>
    <Col xs={9} lg={3}>
      {value || children}
    </Col>
  </Row>
);

ContentDetail.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
};

ContentDetail.defaultProps = {
  value: '',
};
