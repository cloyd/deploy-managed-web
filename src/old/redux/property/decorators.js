import pick from 'lodash/fp/pick';
import values from 'lodash/fp/values';

import {
  KEY_HOLDERS,
  PROPERTY_CATEGORIES,
  PROPERTY_INCLUSIONS,
} from './constants';

const addValue = (features) => (inclusion) => ({
  ...inclusion,
  value: !!(features && features[inclusion.name]),
});

const isType = (features) => (type) =>
  features && features.typeOf === type.name;

export const decorateProperty = ({
  propertyKeys,
  attachments,
  ...property
}) => {
  const isSoleOwnership =
    property.primaryOwner && property.secondaryOwners.length === 0;

  const strataDetails = pick([
    'strataCompanyName',
    'strataPlanNumber',
    'strataLotNumber',
    'strataEmail',
    'strataPhoneNumber',
  ])(property.propertyFeature);
  const hasStrataDetails = values(strataDetails).some((detail) => !!detail);

  return {
    ...property,
    isSoleOwnership,
    hasStrataDetails,
    attachments,
    inclusions: PROPERTY_INCLUSIONS.map(addValue(property.propertyFeature)),
    isArchived: !!property.archivedAt,
    propertyKeys: propertyKeys && decoratePropertyKeys(propertyKeys),
    propertyFeature: property.propertyFeature,
    strataDetails,
    type: PROPERTY_CATEGORIES.find(isType(property.propertyFeature)),
  };
};

export const decoratePropertyKeys = (keys) => keys.map(decoratePropertyKey);

export const decoratePropertyKey = (key) => {
  const holderData = KEY_HOLDERS.find((holder) => {
    return holder.name === key.holder;
  });

  return {
    ...key,
    holderLabel: holderData && holderData.label,
  };
};
