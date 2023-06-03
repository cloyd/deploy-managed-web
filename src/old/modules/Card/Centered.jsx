import PropTypes from 'prop-types';
import React from 'react';
import { Card, Col, Container, Row } from 'reactstrap';

export const CardCentered = ({ children, className, cardWidth, ...props }) => (
  <Container fluid className={`h-100 ${className}`} {...props}>
    <Row className="justify-content-center h-100">
      <Col xs="auto" className="d-flex align-items-center">
        <Card className="p-4 shadow-sm" style={{ width: cardWidth }}>
          {children}
        </Card>
      </Col>
    </Row>
  </Container>
);

CardCentered.propTypes = {
  children: PropTypes.array.isRequired,
  className: PropTypes.string,
  cardWidth: PropTypes.string,
};

CardCentered.defaultProps = {
  cardWidth: '290px',
};
