import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import { PROPERTY_GAIN_REASON } from '../../redux/property';
import { formatDate } from '../../utils';
import { CardLight } from '../Card';
import { ContentDefinition } from '../Content';

export const PropertyManagementCard = ({ className, property }) => {
  const { propertyManagementGain } = property;

  return (
    <CardLight title="Property Management" className={className}>
      <Row>
        <Col md={4}>
          <ContentDefinition
            label="Management gained on"
            value={formatDate(propertyManagementGain.createdAt)}
            className="mb-3 d-block"
          />
        </Col>
        <Col md={4}>
          <ContentDefinition
            label="Reason for management gain"
            value={PROPERTY_GAIN_REASON[propertyManagementGain.gainReasonType]}
            className="mb-3 d-block"
          />
        </Col>
        <Col md={4}>
          <ContentDefinition
            label="Source of management gain"
            value={propertyManagementGain.reasonSource}
            className="mb-3 d-block"
          />
        </Col>
      </Row>
    </CardLight>
  );
};

PropertyManagementCard.propTypes = {
  className: PropTypes.string,
  property: PropTypes.shape({
    propertyManagementGain: PropTypes.object.isRequired,
  }),
};
