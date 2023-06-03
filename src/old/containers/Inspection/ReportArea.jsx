import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { InspectionArea } from '.';
import { useInspectionPermissions } from '../../modules/Inspection';
import { NavPrevAndNext } from '../../modules/Nav';
import {
  fetchInspectionReport,
  getInspectionReport,
  getInspectionReportPrevAndNextArea,
  isInspectionReportTenant,
} from '../../redux/inspection';
import { isTenant as getIsTenant, getProfile } from '../../redux/profile';
import { formatDate } from '../../utils';

const InspectionReportAreaComponent = (props) => {
  const { isReportTenant, report, reportId } = props;

  const history = useHistory();
  const location = useLocation();
  const permissions = useInspectionPermissions(report, props.userId);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (reportId) {
      props.fetchInspectionReport({ reportId });
    }
  }, [reportId]);

  useEffect(() => {
    if (permissions.status.isPendingUpload) {
      history.replace(location.pathname.replace(/\/report.*$/, ''));
    }
  }, [permissions.status]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <>
      <InspectionArea
        areaId={props.areaId}
        backText={
          report.typeOf &&
          `${startCase(report.typeOf)} Report - ${formatDate(
            report.inspectionDate
          )}`
        }
        isReportTenant={isReportTenant}
        permissions={permissions}
        reportId={reportId}
        updateBlockedByReportId={report.updateBlockedByReportId}
      />
      <NavPrevAndNext
        className="mb-3"
        nextSlug={props.nextAreaId}
        pathname={location.pathname}
        prevSlug={props.prevAreaId}
        textBack="Return to inspection"
      />
    </>
  );
};

InspectionReportAreaComponent.propTypes = {
  areaId: PropTypes.number,
  fetchInspectionReport: PropTypes.func,
  isReportTenant: PropTypes.bool.isRequired,
  nextAreaId: PropTypes.number,
  prevAreaId: PropTypes.number,
  property: PropTypes.object,
  report: PropTypes.object,
  reportId: PropTypes.number,
  userId: PropTypes.number,
};

InspectionReportAreaComponent.defaultProps = {
  report: {},
};

const mapStateToProps = (state, props) => {
  const { params } = props.match || {};
  const areaId = params ? parseInt(params.areaId, 10) : null;
  const reportId = params ? parseInt(params.reportId, 10) : null;

  const report = getInspectionReport(state.inspection, reportId);
  const userId = getProfile(state.profile).id;
  const isTenant = getIsTenant(state.profile);

  const [prevAreaId, nextAreaId] = getInspectionReportPrevAndNextArea(
    state.inspection,
    reportId,
    areaId
  );

  return {
    areaId,
    nextAreaId,
    prevAreaId,
    report,
    reportId,
    isReportTenant: isInspectionReportTenant(report, userId, isTenant),
    userId,
  };
};

const mapDispatchToProps = { fetchInspectionReport };

export const InspectionReportArea = connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectionReportAreaComponent);
