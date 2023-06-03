import PropTypes from 'prop-types';
import React from 'react';
import { CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap';

import { CardLight } from '../../Card';
import {
  ContentAddress,
  ContentBooleanIcon,
  ContentDefinition,
} from '../../Content';
import { GoogleMap } from '../../GoogleAPI';

export const CardBusinessDetails = (props) => {
  const { company, tradie } = props;
  const { postcodeLatitude, postcodeLongitude, servicingRadiusKm } = company;
  const showServiceRadiusMap =
    postcodeLatitude && postcodeLongitude && servicingRadiusKm;

  return (
    <CardLight className={props.className}>
      <CardHeader className="d-flex justify-content-between bg-white border-400">
        <CardTitle className="mb-0" tag="h5">
          Business Details
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <Col xs={12} className="mb-3">
            <ContentDefinition
              label="Legal Trading Name"
              value={company.legalName}
            />
          </Col>
          <Col md={6} className="mb-3">
            <ContentDefinition
              label="ABN / Tax file number"
              value={company.taxNumber}
            />
          </Col>
          <Col md={6} className="mb-3">
            <ContentDefinition
              label="License number"
              value={company.licenseNumber}
            />
          </Col>
          <Col xs={12} className="mb-3">
            <ContentDefinition label="Does creditor collect GST?">
              <ContentBooleanIcon className="mr-1" value={tradie.gstIncluded} />
              {tradie.gstIncluded ? 'Yes' : 'No'}
            </ContentDefinition>
          </Col>
          <Col xs={12} className="mb-3">
            <ContentDefinition label="Business address">
              <ContentAddress
                postcode={company.zip}
                state={company.state}
                street={company.addressLine1 || '-'}
                suburb={company.city}
              />
            </ContentDefinition>
          </Col>
          <Col xs={12} className="mb-3">
            <ContentDefinition label="Service radius">
              {servicingRadiusKm || 0} km
            </ContentDefinition>
          </Col>
          <Col xs={12}>
            {showServiceRadiusMap && (
              <GoogleMap
                className="overflow-auto"
                latitude={postcodeLatitude}
                longitude={postcodeLongitude}
                radiusInKm={servicingRadiusKm}
              />
            )}
          </Col>
        </Row>
      </CardBody>
    </CardLight>
  );
};

CardBusinessDetails.propTypes = {
  className: PropTypes.string,
  company: PropTypes.object,
  tradie: PropTypes.object,
};

CardBusinessDetails.defaultProps = {
  company: {},
  tradie: {},
};
