import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React from 'react';
import { Badge } from 'reactstrap';

export const PropertyMeta = ({
  bathrooms,
  bedrooms,
  carSpaces,
  propertyType,
  landSize,
  isHeader,
}) => {
  const customClassName = `d-flex flex-row list-inline m-0 ${
    !isHeader && 'justify-content-between'
  }`;
  return (
    <div>
      {propertyType === 'residential' ? (
        <ul className={customClassName}>
          <li className="mr-3">
            <FontAwesomeIcon icon={['far', 'bed']} size="lg" />
            <strong className="ml-2">{bedrooms || '-'}</strong>
          </li>
          <li className="mr-3">
            <FontAwesomeIcon icon={['far', 'bath']} size="lg" />
            <strong className="ml-2">{bathrooms || '-'}</strong>
          </li>
          <li className="mr-3">
            <FontAwesomeIcon icon={['far', 'car']} size="lg" />
            <strong className="ml-2">{carSpaces || '-'}</strong>
          </li>
          <li>
            <Badge pill color="primary" className="opacity-50 normal-line-wrap">
              {startCase(propertyType)}
            </Badge>
          </li>
        </ul>
      ) : (
        propertyType && (
          <ul className={customClassName}>
            <li className="mr-3">
              <FontAwesomeIcon
                className="text-muted"
                icon={['far', 'expand']}
                size="lg"
              />
              <strong className="ml-2">
                {landSize}
                <sup className="ml-1">m2</sup>
              </strong>
            </li>
            <li>
              {propertyType && (
                <Badge
                  pill
                  style={{
                    backgroundColor: 'lightgray',
                    opacity: '0.1 !important',
                    border: '1px solid gray',
                  }}
                  className="normal-line-wrap text-primary">
                  {startCase(propertyType)}
                </Badge>
              )}
            </li>
          </ul>
        )
      )}
    </div>
  );
};

PropertyMeta.propTypes = {
  bathrooms: PropTypes.string,
  bedrooms: PropTypes.string,
  carSpaces: PropTypes.string,
  propertyType: PropTypes.string,
  landSize: PropTypes.number,
  isHeader: PropTypes.bool,
};
