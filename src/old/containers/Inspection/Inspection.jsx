import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';

import {
  InspectionLiveConditionArea,
  InspectionOverview,
  InspectionReport,
  InspectionReportArea,
} from '.';

export const InspectionComponent = (props) => {
  const { property } = props;

  const history = useHistory();

  const renderLiveConditionArea = useCallback(
    (params) => <InspectionLiveConditionArea property={property} {...params} />,
    [property]
  );

  const renderOverview = useCallback(
    (params) => <InspectionOverview property={property} {...params} />,
    [property]
  );

  const renderReport = useCallback(
    (params) => <InspectionReport property={property} {...params} />,
    [property]
  );

  const renderReportArea = useCallback(
    (params) => <InspectionReportArea property={property} {...params} />,
    [property]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (property.id && !property.isInspectionModuleEnabled) {
      history.replace(`/property/${property.id}`);
    }
  }, [property.id, property.isInspectionModuleEnabled]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <Switch>
      <Route path={`${props.match.url}`} render={renderOverview} exact />
      <Route
        path={`${props.match.url}/area/:areaId`}
        render={renderLiveConditionArea}
        exact
      />
      <Route
        path={`${props.match.url}/report/:reportId`}
        render={renderReport}
        exact
      />
      <Route
        path={`${props.match.url}/report/:reportId/area/:areaId`}
        render={renderReportArea}
        exact
      />
    </Switch>
  );
};

InspectionComponent.propTypes = {
  match: PropTypes.object.isRequired,
  property: PropTypes.object,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export const Inspection = connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectionComponent);
