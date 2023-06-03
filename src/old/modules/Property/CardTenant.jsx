import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import { PropertyCardRow } from '.';
import { featurePropertyImage, imageSrcMedium } from '../../utils';

export const PropertyCardTenant = ({ handleProperty, property }) => {
  return (
    <Row className="my-4" data-testid="property-card-tenant">
      <Col xs={12} onClick={handleProperty(property)}>
        <PropertyCardRow
          property={property}
          imageSrc={imageSrcMedium(featurePropertyImage(property.attachments))}
        />
      </Col>
    </Row>
  );
};

PropertyCardTenant.propTypes = {
  handleProperty: PropTypes.func,
  property: PropTypes.object,
};

PropertyCardTenant.defaultProps = {};
