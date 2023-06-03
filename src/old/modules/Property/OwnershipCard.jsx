import PropTypes from 'prop-types';
import React from 'react';
import { CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap';

import { PropertyUserIcon } from '.';
import { CardLight } from '../Card';
import { ContentDefinition } from '../Content';

export const PropertyOwnershipCard = ({ isManager, property, ...props }) => {
  const { company, primaryOwner, secondaryOwners } = property;

  return (
    <CardLight {...props}>
      <CardHeader className="d-flex justify-content-between bg-white border-400">
        <CardTitle className="mb-0" tag="h5">
          Ownership details
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Row className="mb-3">
          {company && (
            <Col>
              <ContentDefinition
                className="d-block"
                label="Ownership entity"
                value={company.legalName}
              />
            </Col>
          )}
          <Col>
            <small className="font-weight-bold">Primary owner</small>
            <PropertyUserIcon
              key={`user-${primaryOwner.id}`}
              className="mb-1 mb-sm-0"
              disabled={!isManager}
              role="owner"
              user={primaryOwner}
              isShowOwnershipPercentage={property.showOwnershipPercentage}
              hasMultipleOwners={!property.isSoleOwnership}
              percentageOwnership={primaryOwner.ownership.percentageSplit}
              isMissingBank={!primaryOwner.isDisbursementAccountSet}
              isInvalidBank={primaryOwner.isDisbursementAccountInvalid}
            />
          </Col>
          {secondaryOwners.length > 0 && (
            <Col>
              <small className="font-weight-bold">Other owners</small>
              {secondaryOwners.map((owner) => (
                <PropertyUserIcon
                  key={`user-${owner.id}`}
                  className="mb-1 mb-sm-0 d-block"
                  disabled={!isManager}
                  role="owner"
                  user={owner}
                  isShowOwnershipPercentage={property.showOwnershipPercentage}
                  hasMultipleOwners={!property.isSoleOwnership}
                  percentageOwnership={owner.ownership.percentageSplit}
                  isMissingBank={!owner.isDisbursementAccountSet}
                  isInvalidBank={owner.isDisbursementAccountInvalid}
                />
              ))}
            </Col>
          )}
        </Row>
      </CardBody>
    </CardLight>
  );
};

PropertyOwnershipCard.propTypes = {
  isManager: PropTypes.bool,
  property: PropTypes.object,
};
