import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Container } from 'reactstrap';

import { InspectionAreaList } from '.';
import {
  InspectionHeader,
  InspectionReportAreaActions,
  InspectionReportBlockedAlert,
  useInspectionPermissions,
} from '../../modules/Inspection';
import {
  deleteInspectionReport,
  fetchInspectionReport,
  getInspectionAreasById,
  getInspectionCondition,
  getInspectionReport,
  sendInspectionReportToTenant,
  updateInspectionReport,
  updateUploadedReport,
} from '../../redux/inspection';
import { getProfile, getRole } from '../../redux/profile';
import { featurePropertyImage, imageSrcLarge, pathnameBack } from '../../utils';

const InspectionReportComponent = (props) => {
  const {
    deleteInspectionReport,
    property,
    report,
    reportId,
    role,
    sendInspectionReportToTenant,
    updateInspectionReport,
    updateUploadedReport,
    userId,
  } = props;

  const history = useHistory();
  const location = useLocation();
  const permissions = useInspectionPermissions(report, userId);

  const handleSendToTenant = useCallback(
    () => sendInspectionReportToTenant({ reportId }),
    [sendInspectionReportToTenant, reportId]
  );

  const handleSignReport = useCallback(
    (signature) => updateInspectionReport({ reportId, role, signature }),
    [updateInspectionReport, reportId, role]
  );

  const handleDelete = useCallback(() => {
    deleteInspectionReport({ reportId, propertyId: property.id });
    history.push(pathnameBack(location.pathname));
  }, [
    deleteInspectionReport,
    history,
    location.pathname,
    property.id,
    reportId,
  ]);

  const handleUploaderComplete = useCallback(
    (reportId) => (values) => updateUploadedReport({ ...values, reportId }),
    [updateUploadedReport]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (reportId) {
      props.fetchInspectionReport({ reportId });
    }
  }, [reportId]);

  useEffect(() => {
    if (report?.id && !permissions.action.canViewReport) {
      history.replace(pathnameBack(location.pathname));
    }
  }, [permissions.action]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <>
      <InspectionHeader
        backgroundImage={
          property.attachments
            ? imageSrcLarge(featurePropertyImage(property.attachments))
            : null
        }
        name={report.typeOf && `${startCase(report.typeOf)} Report`}
        pathname={location.pathname}
      />
      <Container className="py-3 py-md-5">
        <InspectionReportAreaActions
          areas={props.areas}
          canCompleteReport={permissions.action.canCompleteReport}
          isIngoingReport={permissions.type.isIngoing}
          isLoading={props.isLoading}
          permissionsStatus={permissions.status}
          propertyId={property.id}
          report={report}
          onDelete={permissions.action.canDeleteReport ? handleDelete : null}
          onSignReport={
            permissions.action.canSignReport ? handleSignReport : null
          }
          onSendToTenant={
            permissions.action.canSendToTenant ? handleSendToTenant : null
          }
          onUploaderComplete={
            permissions.action.canUploadPendingTenant
              ? handleUploaderComplete
              : null
          }
        />
        {permissions.action.canViewUpdateBlockedAlert &&
          report.updateBlockedByReportId && (
            <InspectionReportBlockedAlert
              path={pathnameBack(location.pathname)}
              updateBlockedByReportId={report.updateBlockedByReportId}
            />
          )}
        <InspectionAreaList
          report={report}
          hasActions={permissions.action.canEditArea}
          isIngoingReport={permissions.type.isIngoing}
          permissionsStatus={permissions.status}
        />
      </Container>
    </>
  );
};

InspectionReportComponent.propTypes = {
  areas: PropTypes.array,
  condition: PropTypes.object,
  deleteInspectionReport: PropTypes.func,
  fetchInspectionReport: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
  match: PropTypes.object,
  property: PropTypes.object,
  report: PropTypes.object,
  reportId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  role: PropTypes.string,
  sendInspectionReportToTenant: PropTypes.func,
  updateInspectionReport: PropTypes.func,
  updateUploadedReport: PropTypes.func,
  userId: PropTypes.number,
};

InspectionReportComponent.defaultProps = {
  property: {},
  report: {},
};

const mapStateToProps = (state, props) => {
  const { reportId } = props.match?.params || {};
  const report = getInspectionReport(state.inspection, reportId);
  const userId = getProfile(state.profile).id;

  return {
    areas: getInspectionAreasById(state.inspection, report.areas),
    condition: getInspectionCondition(
      state.inspection,
      report.propertyConditionId
    ),
    isLoading: state.inspection.isLoading,
    report,
    reportId,
    role: getRole(state.profile),
    userId,
  };
};

const mapDispatchToProps = {
  deleteInspectionReport,
  fetchInspectionReport,
  sendInspectionReportToTenant,
  updateInspectionReport,
  updateUploadedReport,
};

export const InspectionReport = connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectionReportComponent);
