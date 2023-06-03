import PropTypes from 'prop-types';
import React from 'react';

import {
  InvalidBankDetailsBadge,
  MissingBankDetailsBadge,
  PropertyAddress,
  PropertyBadge,
  PropertyMeta,
} from '.';
import { centsToDollar } from '../../utils';
import { CardImage } from '../Card';

export const PropertyCardRow = (props) => {
  const { property, imageSrc, currentLoggedUser } = props;
  const {
    address,
    propertyFeature,
    isArchived,
    status = 'Loading',
    isDisbursementAccountInvalid,
  } = property;
  return (
    <div className="position-relative">
      <PropertyBadge
        className="position-absolute position-top position-left d-md-none"
        style={{ zIndex: 1000, top: '10px', left: '10px' }}
        status={status && status.replace(' Activate', '')}
      />
      <CardImage className="border-0 shadow-sm" src={imageSrc}>
        <div className="d-flex col-12 px-0 justify-content-between align-items-start align-items-md-center flex-column flex-md-row">
          <div className="d-flex col-4 flex-column justify-content-center h-100 w-100">
            <PropertyAddress
              className="mb-2 mb-md-0"
              {...address}
              isArchived={isArchived}
            />
            {!!property.floatBalanceAmountCents && (
              <span className="pb-2">
                Wallet Balance:{' '}
                {centsToDollar(property.floatBalanceAmountCents)}
              </span>
            )}
          </div>
          <div className="col-3 align-self-start">
            <PropertyMeta
              bathrooms={propertyFeature?.bathrooms || '0'}
              bedrooms={propertyFeature?.bedrooms || '0'}
              carSpaces={propertyFeature?.carSpaces || '0'}
              propertyType={property.propertyType}
              landSize={propertyFeature?.landSize || 0}
            />
          </div>
          <div className="d-none d-md-flex h-100 pr-3 col-5 align-self-start justify-content-end">
            <span>
              {currentLoggedUser && (
                <MissingBankDetailsBadge
                  property={property}
                  currentLoggedUser={currentLoggedUser}
                />
              )}
            </span>
            <span>
              {isDisbursementAccountInvalid && <InvalidBankDetailsBadge />}
            </span>
            <span className="ml-2">
              <PropertyBadge status={status} />
            </span>
          </div>
        </div>
      </CardImage>
    </div>
  );
};

PropertyCardRow.propTypes = {
  property: PropTypes.object.isRequired,
  imageSrc: PropTypes.string,
  currentLoggedUser: PropTypes.object,
};
