import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { Link as ReactRouterLink } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { Col } from 'reactstrap';

import { PropertyCard, PropertyCardRow } from '.';
import {
  selectIsPropertyLoading,
  selectProperties,
} from '../../redux/property';
import {
  featurePropertyImage,
  imageSrcMedium,
  imageSrcThumb,
} from '../../utils';
import { Link } from '../Link';

const PropertyList = ({ isList }) => {
  const profile = useSelector((state) => state.profile);
  const isLoading = useSelector(selectIsPropertyLoading);
  const properties = useSelector(selectProperties);

  if (isLoading) {
    return (
      <Col className="text-center py-3">
        <PulseLoader color="#dee2e6" />
      </Col>
    );
  }

  return (
    <>
      {properties.length > 0 ? (
        properties.map((property) => {
          const imageSrc = imageSrcMedium(
            featurePropertyImage(property.attachments)
          );
          const thumbnail = imageSrcThumb(
            featurePropertyImage(property.attachments)
          );

          return (
            <Col
              md={isList ? 12 : 6}
              lg={isList ? 12 : 4}
              key={property.id}
              className={`pointer mb-2 ${
                !isList && 'mb-md-4'
              } property-list-container`}>
              <ReactRouterLink
                to={`/property/${property.id}`}
                className="text-dark"
                data-testid={`property-${property.id}`}>
                {isList ? (
                  <PropertyCardRow
                    property={property}
                    imageSrc={imageSrc}
                    thumbnail={thumbnail}
                    currentLoggedUser={profile}
                  />
                ) : (
                  <PropertyCard
                    property={property}
                    imageSrc={imageSrc}
                    thumbnail={thumbnail}
                    hasImage
                    currentLoggedUser={profile}
                  />
                )}
              </ReactRouterLink>
            </Col>
          );
        })
      ) : (
        <Col className="py-4 text-center">
          An active property hasn&apos;t been set up yet. You&apos;ll get a
          notification, but in the meantime please check we&apos;ve got
          <Link to="/profile">&nbsp;your profile details</Link> correct.
        </Col>
      )}
    </>
  );
};

PropertyList.propTypes = {
  isList: PropTypes.bool,
};

export default memo(PropertyList);
