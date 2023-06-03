import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardBody, CardDeck, CardImgOverlay } from 'reactstrap';

import {
  InvalidBankDetailsBadge,
  MissingBankDetailsBadge,
  PropertyAddress,
  PropertyBadge,
  PropertyMeta,
} from '.';
import { DividerTitle } from '../Divider';
import LazyLoadImage from './LazyLoadImage';

export const PropertyCard = (props) => {
  const {
    children,
    property,
    hasImage,
    imageSrc,
    thumbnail,
    currentLoggedUser,
    ...otherProps
  } = props;
  const {
    address,
    propertyFeature,
    isArchived,
    status = 'Loading',
    isDisbursementAccountInvalid,
  } = property;

  return (
    <div {...otherProps}>
      <CardDeck>
        <Card className="border-0 shadow-sm">
          {hasImage && (
            <>
              <LazyLoadImage
                src={imageSrc}
                thumbnail={thumbnail}
                alt={`${property.title} featured image`}
              />
              <CardImgOverlay>
                <div className="position-absolute d-flex">
                  <PropertyBadge status={status} />
                  {currentLoggedUser && (
                    <MissingBankDetailsBadge
                      property={property}
                      currentLoggedUser={currentLoggedUser}
                    />
                  )}
                  {isDisbursementAccountInvalid && <InvalidBankDetailsBadge />}
                </div>
              </CardImgOverlay>
            </>
          )}
          <CardBody>
            {children || (
              <>
                <div className="d-flex justify-content-between align-items-start">
                  <PropertyAddress
                    className="mb-2 h5-font-size"
                    {...address}
                    isArchived={isArchived}
                  />
                </div>
                <DividerTitle />
                <PropertyMeta
                  bathrooms={propertyFeature?.bathrooms || '0'}
                  bedrooms={propertyFeature?.bedrooms || '0'}
                  carSpaces={propertyFeature?.carSpaces || '0'}
                  propertyType={property.propertyType}
                  landSize={propertyFeature?.landSize || 0}
                />
              </>
            )}
          </CardBody>
        </Card>
      </CardDeck>
    </div>
  );
};

PropertyCard.defaultProps = {
  hasImage: true,
};

PropertyCard.propTypes = {
  children: PropTypes.node,
  property: PropTypes.object.isRequired,
  imageSrc: PropTypes.string,
  thumbnail: PropTypes.string,
  hasImage: PropTypes.bool,
  currentLoggedUser: PropTypes.object,
  isArchived: PropTypes.bool,
};
