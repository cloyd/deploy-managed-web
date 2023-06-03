import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { InspectionArea } from '.';
import { useInspectionPermissions } from '../../modules/Inspection';
import { NavPrevAndNext } from '../../modules/Nav';
import {
  fetchInspectionPropertyCondition,
  getInspectionConditionByProperty,
  getInspectionConditionPrevAndNextArea,
} from '../../redux/inspection';

const InspectionLiveConditionAreaComponent = (props) => {
  const { condition } = props;

  const location = useLocation();
  const permissions = useInspectionPermissions(condition);

  useEffect(() => {
    if (props.property.id && !condition.propertyInspectionReportId) {
      props.fetchInspectionPropertyCondition({ propertyId: props.property.id });
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props.property.id]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <>
      <InspectionArea
        areaId={props.areaId}
        permissions={permissions}
        updateBlockedByReportId={condition.updateBlockedByReportId}
      />
      <NavPrevAndNext
        className="mb-3"
        nextSlug={props.nextAreaId}
        pathname={location.pathname}
        prevSlug={props.prevAreaId}
      />
    </>
  );
};

InspectionLiveConditionAreaComponent.propTypes = {
  areaId: PropTypes.number,
  condition: PropTypes.object,
  fetchInspectionPropertyCondition: PropTypes.func,
  nextAreaId: PropTypes.number,
  prevAreaId: PropTypes.number,
  property: PropTypes.object,
};

InspectionLiveConditionAreaComponent.defaultProps = {
  condition: {},
};

const mapStateToProps = (state, props) => {
  const { match, property } = props;
  const areaId = match?.params ? parseInt(match.params.areaId, 10) : null;

  const condition = getInspectionConditionByProperty(
    state.inspection,
    property.id
  );

  const [prevAreaId, nextAreaId] = getInspectionConditionPrevAndNextArea(
    state.inspection,
    condition.id,
    areaId
  );

  return {
    areaId,
    condition,
    nextAreaId,
    prevAreaId,
  };
};

const mapDispatchToProps = { fetchInspectionPropertyCondition };

export const InspectionLiveConditionArea = connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectionLiveConditionAreaComponent);
