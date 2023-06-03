import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import { CardLight } from '../../modules/Card';
import {
  PropertyAuthoritiesCard,
  PropertyCard,
  PropertyDetailsCard,
  PropertyHeader,
  PropertyKeysCard,
  PropertyManagementCard,
  PropertyOwnershipCard,
  PropertyStrataCard,
} from '../../modules/Property';
import { updatePropertyAttachments } from '../../redux/property';

export const PropertyOverviewComponent = (props) => {
  const {
    history,
    isManager,
    isOwner,
    lease,
    property,
    profile,
    isTenant,
    updatePropertyAttachments,
  } = props;
  const agentName = property.managerName || '';
  const isManagerOrOwner = isManager || isOwner;

  const inclusions = useMemo(
    () => property.inclusions.filter((inclusion) => inclusion.value),
    [property.inclusions]
  );

  const type = useMemo(
    () => (property.propertyType ? property.propertyType : ''),
    [property.propertyType]
  );

  const category = useMemo(
    () =>
      property.propertyFeature?.typeOf ? property.propertyFeature.typeOf : '',
    [property.propertyFeature]
  );

  const handleClick = useCallback(
    () => history.push(`/property/${property.id}/edit`),
    [history, property.id]
  );

  const handleEditAuthoritiesClick = useCallback(
    () => history.push(`/property/${property.id}/authoritiesEdit`),
    [history, property.id]
  );

  return (
    <Container>
      <PropertyCard
        className="mb-sm-3"
        property={property}
        hasImage={false}
        currentLoggedUser={profile}>
        <PropertyHeader
          className="p-0 m-0"
          hasAlert={false}
          hasColPadding={false}
          isManager={isManager}
          isOwner={isOwner}
          lease={lease}
          property={property}
          currentLoggedUser={profile}
        />
      </PropertyCard>
      <PropertyDetailsCard
        className="mb-3 text-capitalize"
        inclusions={inclusions}
        type={type}
        category={category}
        onClick={isManager ? handleClick : undefined}
      />
      {isManagerOrOwner && (
        <PropertyOwnershipCard
          className="mb-3 text-capitalize"
          isManager={isManager}
          property={property}
        />
      )}
      <Row>
        {agentName && (
          <Col md={isManagerOrOwner ? 6 : 12} className="mb-3">
            <CardLight title="Managing Agent">{agentName}</CardLight>
          </Col>
        )}
        {isManagerOrOwner && (
          <Col md={agentName ? 6 : 12} className="mb-3">
            <PropertyKeysCard keys={property.propertyKeys} />
          </Col>
        )}
      </Row>
      <Row>
        {(isManagerOrOwner || isTenant) && property.hasStrataDetails && (
          <Col sm={isManagerOrOwner ? 6 : 12} className="mb-3">
            <PropertyStrataCard className="d-flex h-100" property={property} />
          </Col>
        )}
        {isManagerOrOwner && (
          <Col sm={property.hasStrataDetails ? 6 : 12} className="mb-3">
            <PropertyAuthoritiesCard
              className="d-flex h-100"
              property={property}
              lease={lease}
              isOwner={isOwner}
              onClick={handleEditAuthoritiesClick}
              onUploaderComplete={updatePropertyAttachments}
            />
          </Col>
        )}
      </Row>
      {isManager && property.propertyManagementGain && (
        <Row>
          <Col xs={12} className="mb-3">
            <PropertyManagementCard property={property} />
          </Col>
        </Row>
      )}
    </Container>
  );
};

PropertyOverviewComponent.propTypes = {
  history: PropTypes.object.isRequired,
  isManager: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired,
  lease: PropTypes.object,
  property: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  isTenant: PropTypes.bool,
  updatePropertyAttachments: PropTypes.func,
};

const mapStateToProps = (state, props) => {
  const { match, property } = props;
  const isCreate = /create/.test(match.path);

  return {
    isArchived: isCreate
      ? false
      : property.isArchived || property.archivedAt !== null,
    isLoading: state.property.isLoading,
  };
};

const mapDispatchToProps = {
  updatePropertyAttachments,
};

export const PropertyOverview = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyOverviewComponent);
