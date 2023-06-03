import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

export const PaymentListHeader = ({ isFilterByUpcoming, className }) => (
  <Row
    className={`${className} d-none d-lg-flex text-small text-muted mb-3 mt-4 px-3`}>
    <Col lg={9}>
      <Row>
        <Col lg={7}>Description</Col>
        <Col lg={2} className="d-flex align-items-center pt-2 pt-lg-0">
          Property
        </Col>
        {isFilterByUpcoming && (
          <>
            <Col lg={2} className="d-flex align-items-center">
              Date
            </Col>
            <Col lg={1} className="d-flex align-items-center">
              Status
            </Col>
          </>
        )}
      </Row>
    </Col>
    <Col
      lg={3}
      className="d-flex justify-content-end align-items-center px-0 pr-4">
      Payment
    </Col>
  </Row>
);

PaymentListHeader.propTypes = {
  isFilterByUpcoming: PropTypes.bool,
  className: PropTypes.string,
};

PaymentListHeader.defaultProps = {
  isFilterByUpcoming: false,
  className: '',
};
