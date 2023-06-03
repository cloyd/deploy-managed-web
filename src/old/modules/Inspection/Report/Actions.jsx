import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import { InspectionReportUpload } from '..';
import { InspectionReportCreateDropdown } from './CreateDropdown';

export const InspectionReportActions = (props) => {
  return (
    <Row>
      <Col className="d-md-flex align-items-center">
        <div className="d-flex w-100 align-items-center mb-3 mb-md-0">
          <h3>{props.title}</h3>
        </div>
        <div className="d-flex">
          {props.onCreateReport && (
            <InspectionReportCreateDropdown
              className="mr-1"
              isDisabled={props.isLoading || props.isArchived}
              leases={props.leases}
              onCreateReport={props.onCreateReport}
            />
          )}
          {props.onUploaderComplete && (
            <InspectionReportUpload
              className="ml-1"
              createdReport={props.createdReport}
              leases={props.leases}
              reportId={props.createdReport.id}
              onClosed={props.onUploadClosed}
              onCreateReport={props.onCreateUploadedReport}
              onUploaderComplete={props.onUploaderComplete}
              isArchived={props.isArchived}
            />
          )}
        </div>
      </Col>
    </Row>
  );
};

InspectionReportActions.propTypes = {
  createdReport: PropTypes.object,
  isLoading: PropTypes.bool,
  leases: PropTypes.array,
  onCreateReport: PropTypes.func,
  onCreateUploadedReport: PropTypes.func,
  onUploadClosed: PropTypes.func,
  onUploaderComplete: PropTypes.func,
  title: PropTypes.string,
  isArchived: PropTypes.bool,
};

InspectionReportActions.defaultProps = {
  title: '',
};
