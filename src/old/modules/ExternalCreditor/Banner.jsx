import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Container, Row } from 'reactstrap';

export const ExternalCreditorBanner = () => (
  <div className="py-3 py-md-5 bg-300">
    <Container>
      <Row className="text-center">
        <Col md={4}>
          <BannerIcon icon="comment-dollar" />
          <h5 className="mt-3 mb-0">Get quotes from multiple tradies, fast!</h5>
        </Col>
        <Col md={4} className="my-3 my-md-0">
          <BannerIcon icon="tasks" />
          <h5 className="mt-3 mb-0">Show progress to owners and tenants</h5>
        </Col>
        <Col md={4}>
          <BannerIcon icon="hand-holding-usd" />
          <h5 className="mt-3 mb-0">Pay tradie on Managed</h5>
        </Col>
      </Row>
    </Container>
  </div>
);

const BannerIcon = (props) => (
  <span className="d-inline-block p-3 bg-white rounded-circle">
    <FontAwesomeIcon icon={['far', props.icon]} size="3x" />
  </span>
);

BannerIcon.propTypes = {
  icon: PropTypes.string,
};
