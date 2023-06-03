import PropTypes from 'prop-types';
import React from 'react';
import { CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap';

import { CardLight } from '@app/modules/Card';
import { ContentAddress, ContentDefinition } from '@app/modules/Content';
import { formatDate } from '@app/utils';

export const CardPrimaryContact = (props) => {
  const { tradie } = props;
  const { address } = tradie || {};

  return (
    <CardLight className={props.className}>
      <CardHeader className="d-flex justify-content-between bg-white border-400">
        <CardTitle className="mb-0" tag="h5">
          Contact Details
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <Col xs={12} className="mb-3">
            <ContentDefinition label="Name">{tradie.name}</ContentDefinition>
          </Col>
          <Col xs={12} className="mb-3">
            <ContentDefinition label="Email">
              <a
                href={`mailto:${tradie.primaryContactEmail}`}
                className="btn-link mr-3">
                {tradie.primaryContactEmail}
              </a>
            </ContentDefinition>
          </Col>
          <Col xs={12} className="mb-3">
            <ContentDefinition label="Mobile">
              <a
                href={`tel:${tradie.primaryContactMobile}`}
                className="btn-link mr-3">
                {tradie.primaryContactMobile}
              </a>
            </ContentDefinition>
          </Col>
          <Col xs={12} className="mb-3">
            <ContentDefinition
              label="Date of birth"
              value={formatDate(tradie.primaryContactDob)}
            />
          </Col>
          <Col xs={12} className="mb-3">
            <ContentDefinition label="Address">
              {address && (
                <ContentAddress
                  postcode={address.postcode}
                  state={address.state}
                  street={address.street}
                  suburb={address.suburb}
                />
              )}
            </ContentDefinition>
          </Col>
        </Row>
      </CardBody>
    </CardLight>
  );
};

CardPrimaryContact.propTypes = {
  className: PropTypes.string,
  tradie: PropTypes.object,
};

CardPrimaryContact.defaultProps = {
  tradie: {},
};
