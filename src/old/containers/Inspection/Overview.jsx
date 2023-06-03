import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Container } from 'reactstrap';

import { InspectionAreaList, InspectionReportList } from '.';
import {
  InspectionReportBlockedAlert,
  useInspectionPermissions,
} from '../../modules/Inspection';
import {
  fetchInspectionPropertyCondition,
  getInspectionConditionByProperty,
} from '../../redux/inspection';

const InspectionOverviewComponent = (props) => {
  const { condition, property } = props;

  const location = useLocation();
  const permissions = useInspectionPermissions(condition);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (property.id) {
      props.fetchInspectionPropertyCondition({ propertyId: property.id });
    }
  }, [property.id]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div style={{ opacity: property.isArchived ? 0.2 : 1 }}>
      {permissions.action.canViewLiveCondition && (
        <Container
          className="border-bottom py-4 py-md-5"
          data-testid="overview-area-list">
          <h3>Current property condition</h3>
          {permissions.action.canViewUpdateBlockedAlert && (
            <InspectionReportBlockedAlert
              path={location.pathname}
              updateBlockedByReportId={condition.updateBlockedByReportId}
              isArchived={property.isArchived}
            />
          )}
          <InspectionAreaList
            condition={condition}
            hasActions={permissions.action.canEditArea}
            isLiveCondition={permissions.type.isLiveCondition}
            permissionsStatus={permissions.status}
            isArchived={property.isArchived}
          />
        </Container>
      )}
      <InspectionReportList
        canStartReport={permissions.action.canStartReport}
        className="py-4 py-md-5"
        property={property}
      />
    </div>
  );
};

InspectionOverviewComponent.propTypes = {
  condition: PropTypes.object,
  fetchInspectionPropertyCondition: PropTypes.func.isRequired,
  property: PropTypes.object,
};

const mapStateToProps = (state, props) => {
  const { property } = props;

  return {
    condition: getInspectionConditionByProperty(state.inspection, property.id),
  };
};

const mapDispatchToProps = { fetchInspectionPropertyCondition };

export const InspectionOverview = connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectionOverviewComponent);
