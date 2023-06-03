import PropTypes from 'prop-types';
import React from 'react';
import { CardBody, Col, Row } from 'reactstrap';

import { CardLight } from '../Card';
import { ContentDefinition } from '../Content';

export const FinancialsCard = (props) => {
  const {
    address,
    name,
    primaryContactEmail,
    primaryContactFirstName,
    primaryContactLastName,
    primaryContactMobile,
    typeOf,
  } = props.creditor;

  return (
    <CardLight className="d-flex mb-4">
      <CardBody>
        <Row className="mb-2">
          <Col className="mb-2 mb-lg-0">
            <ContentDefinition label="Company Name" value={name || ''} />
          </Col>
          <Col className="mb-2 mb-lg-0">
            <ContentDefinition label="Company Category" value={typeOf || ''} />
          </Col>
          <Col className="mb-2 mb-lg-0">
            <ContentDefinition label="Company Address">
              {address && (
                <div className="address h6-font-size">
                  {address.street}
                  <br />
                  {address.suburb}, {address.state}, {address.postcode}
                </div>
              )}
            </ContentDefinition>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col className="mb-2 mb-lg-0">
            <ContentDefinition label="Primary Contact Name">
              {primaryContactFirstName || ''} {primaryContactLastName || ''}
            </ContentDefinition>
          </Col>
          <Col className="mb-2 mb-lg-0">
            <ContentDefinition
              label="Email"
              value={primaryContactEmail || ''}
            />
          </Col>
          <Col className="mb-2 mb-lg-0">
            <ContentDefinition
              label="Mobile"
              value={primaryContactMobile || ''}
            />
          </Col>
        </Row>
      </CardBody>
    </CardLight>
  );
};

FinancialsCard.propTypes = {
  creditor: PropTypes.object.isRequired,
};
