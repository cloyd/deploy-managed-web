import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import {
  InvalidBankDetailsBadge,
  MissingBankDetailsBadge,
  PropertyAddress,
  PropertyBadge,
  PropertyMeta,
  PropertyUserIcon,
} from '.';
import { DividerTitle } from '../Divider';
import { Header } from '../Header';

export const PropertyHeader = ({
  hasColPadding,
  isManager,
  isOwner,
  lease,
  property,
  currentLoggedUser,
  ...props
}) => {
  const {
    address,
    propertyFeature,
    status,
    primaryOwner,
    isDisbursementAccountInvalid,
  } = property;
  const { bathrooms, bedrooms, carSpaces } = propertyFeature || {};
  return (
    <Header {...props}>
      <Row className="flex-fill">
        <Col xs={6} className={hasColPadding ? null : 'p-0'}>
          <PropertyAddress
            className="mb-2 h5-font-size"
            isArchived={property.isArchived}
            {...address}
          />
          <DividerTitle />
          <PropertyMeta
            bathrooms={bathrooms}
            bedrooms={bedrooms}
            carSpaces={carSpaces}
            propertyType={property.propertyType}
            landSize={propertyFeature?.landSize || 0}
            isHeader={true}
          />
        </Col>
        <Col
          xs={6}
          className={`d-flex flex-column justify-content-between ${
            hasColPadding ? null : 'p-0'
          }`}>
          <Row>
            <Col className="text-right">
              <PropertyBadge status={status} />
              {currentLoggedUser && (
                <MissingBankDetailsBadge
                  className="ml-2"
                  property={property}
                  currentLoggedUser={currentLoggedUser}
                />
              )}
              {isDisbursementAccountInvalid && <InvalidBankDetailsBadge />}
            </Col>
          </Row>
          {(isManager || isOwner) && (
            <Row className="flex-row justify-content-end m-0">
              {primaryOwner && (
                <PropertyUserIcon
                  role="owner"
                  user={primaryOwner}
                  disabled={!isManager}
                  className="mb-1 mb-sm-0"
                />
              )}
              {lease.tenant && (
                <PropertyUserIcon
                  role="tenant"
                  user={lease.tenant}
                  userName={lease.tenant.company?.legalName}
                  disabled={!isManager}
                  className="ml-3"
                />
              )}
            </Row>
          )}
        </Col>
      </Row>
    </Header>
  );
};

PropertyHeader.defaultProps = {
  hasColPadding: true,
  isManager: false,
  isOwner: false,
  lease: {},
};

PropertyHeader.propTypes = {
  hasColPadding: PropTypes.bool,
  isManager: PropTypes.bool,
  isOwner: PropTypes.bool,
  lease: PropTypes.object,
  property: PropTypes.object.isRequired,
  currentLoggedUser: PropTypes.object,
};
