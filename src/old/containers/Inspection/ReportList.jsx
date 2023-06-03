import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  InspectionReportActions,
  InspectionReportList as InspectionReportListModule,
} from '../../modules/Inspection';
import {
  createInspectionReport,
  createUploadedInspectionReport,
  deleteInspectionReport,
  fetchPropertyInspectionReports,
  getCreatedInspectionReport,
  getInspectionReportsByLease,
  resetCreatedReport,
  updateUploadedReport,
} from '../../redux/inspection';
import { fetchLeases, getLeasesByProperty } from '../../redux/lease';
import { getProfile } from '../../redux/profile';

const InspectionReportListComponent = (props) => {
  const {
    canStartReport,
    createInspectionReport,
    createUploadedInspectionReport,
    deleteInspectionReport,
    property,
    updateUploadedReport,
  } = props;

  const location = useLocation();

  const handleCreateReport = useCallback(
    (values) => createInspectionReport({ propertyId: property.id, ...values }),
    [createInspectionReport, property.id]
  );

  const handleCreateUploadedReport = useCallback(
    (values) =>
      createUploadedInspectionReport({
        propertyId: property.id,
        ...values,
      }),
    [createUploadedInspectionReport, property.id]
  );

  const handleDelete = useCallback(
    (reportId) => () =>
      deleteInspectionReport({ reportId, propertyId: property.id }),
    [deleteInspectionReport, property.id]
  );

  const handleUploadReportClosed = useCallback(
    () => props.createdReport.id && props.resetCreatedReport(),
    [props]
  );

  const handleUploaderComplete = useCallback(
    (reportId) => (values) => updateUploadedReport({ ...values, reportId }),
    [updateUploadedReport]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (property.id) {
      props.fetchPropertyInspectionReports({ propertyId: property.id });

      if (props.leases.length === 0) {
        props.fetchLeases({ propertyId: property.id });
      }
    }
  }, [property.id]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <Container className={props.className} data-testid="inspection-report-list">
      <InspectionReportActions
        createdReport={props.createdReport}
        isLoading={props.isLoading}
        leases={props.leases}
        title="Inspection Reports"
        onCreateReport={canStartReport ? handleCreateReport : null}
        onCreateUploadedReport={
          canStartReport ? handleCreateUploadedReport : null
        }
        onUploadClosed={canStartReport ? handleUploadReportClosed : null}
        onUploaderComplete={canStartReport ? handleUploaderComplete : null}
        isArchived={property.isArchived}
      />
      {!props.isLoading && (
        <InspectionReportListModule
          propertyId={property.id}
          reportsByLease={props.reportsByLease}
          path={location.pathname}
          userId={props.userId}
          onDelete={handleDelete}
          onUploaderComplete={handleUploaderComplete}
          isArchived={property.isArchived}
        />
      )}
    </Container>
  );
};

InspectionReportListComponent.propTypes = {
  canStartReport: PropTypes.bool,
  className: PropTypes.string,
  createdReport: PropTypes.object,
  createInspectionReport: PropTypes.func,
  createUploadedInspectionReport: PropTypes.func,
  deleteInspectionReport: PropTypes.func,
  fetchLeases: PropTypes.func.isRequired,
  fetchPropertyInspectionReports: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  leases: PropTypes.array,
  property: PropTypes.object,
  reportsByLease: PropTypes.object,
  resetCreatedReport: PropTypes.func,
  updateUploadedReport: PropTypes.func,
  userId: PropTypes.number,
};

InspectionReportListComponent.defaultProps = {
  canStartReport: false,
  reportsByLease: {},
};

const mapStateToProps = (state, props) => {
  const { property } = props;

  return {
    createdReport: getCreatedInspectionReport(state.inspection),
    isLoading: state.inspection.isLoading,
    leases: getLeasesByProperty(state.lease, property.id, true),
    reportsByLease: getInspectionReportsByLease(state.inspection, property.id),
    userId: getProfile(state.profile).id,
  };
};

const mapDispatchToProps = {
  createInspectionReport,
  createUploadedInspectionReport,
  deleteInspectionReport,
  fetchLeases,
  fetchPropertyInspectionReports,
  resetCreatedReport,
  updateUploadedReport,
};

export const InspectionReportList = connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectionReportListComponent);
