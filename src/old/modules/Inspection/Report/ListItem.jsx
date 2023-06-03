import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import {
  InspectionReportDownloadLink,
  InspectionReportUpload,
  InspectionStatusBadge,
  useInspectionPermissions,
} from '..';
import { formatDate } from '../../../utils';
import { ButtonDestroy } from '../../Button';
import { CardPlain } from '../../Card';
import { Link } from '../../Link';
import { PropertyUserIcon } from '../../Property';

export const InspectionReportListItem = (props) => {
  const { report, userId } = props;
  const { report: reportFile } = report;

  const permissions = useInspectionPermissions(report, userId);

  const isPdfUpload =
    permissions.type.isUploadedReport || permissions.status.isPendingUpload;

  return (
    <CardPlain classNameInner="px-md-2 py-2">
      <Row className="text-left" data-testid="inspection-report-list-item">
        <Col xs={12} md={5}>
          <Row className="no-gutters h-100 d-flex align-items-center">
            <Col xs={12} md={5}>
              <div md={2} className="d-flex align-items-center">
                {isPdfUpload && (
                  <FontAwesomeIcon
                    icon={['far', 'file-pdf']}
                    className="text-primary mx-1"
                  />
                )}
                <strong className={isPdfUpload ? 'ml-2' : 'ml-md-4'}>
                  {formatDate(report.inspectionDate)}
                </strong>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <small className="text-capitalize">{report.typeOf}</small>
              <small className="d-md-none"> Inspection</small>
            </Col>
            <Col xs={6} md={4}>
              <InspectionStatusBadge status={report.status} />
            </Col>
          </Row>
        </Col>
        <Col xs={12} md={3}>
          <Row>
            <Col xs={6} className="d-flex justify-items-center">
              {report.manager && (
                <PropertyUserIcon
                  className="mb-1 mb-sm-0 text-dark text-left"
                  role="manager"
                  isActive={true}
                  size={0.6}
                  user={report.manager}
                  userName={report.manager.name}
                />
              )}
            </Col>
            <Col xs={6} className="d-flex justify-items-center">
              {report.tenant && (
                <PropertyUserIcon
                  className="mb-1 mb-sm-0 text-dark text-left"
                  role="tenant"
                  isActive={true}
                  size={0.6}
                  user={report.tenant}
                  userName={report.tenant.name}
                />
              )}
            </Col>
          </Row>
          <hr className="d-md-none mt-2 mb-1" />
        </Col>
        <Col md={4} className="d-flex align-items-center justify-content-end">
          {permissions.action.canDeleteReport && report.propertyTaskId && (
            <Link
              to={`/property/${props.propertyId}/tasks/${report.propertyTaskId}`}>
              <span className="mr-2 text-secondary">View task</span>
            </Link>
          )}
          {permissions.status.isCompleted && reportFile && (
            <InspectionReportDownloadLink link={reportFile.link} />
          )}
          {permissions.action.canUploadReport && (
            <InspectionReportUpload
              isEdit={true}
              reportId={report.id}
              onUploaderComplete={props.onUploaderComplete}
            />
          )}
          {permissions.action.canViewReport && !isPdfUpload && (
            <Link
              className="px-2 text-primary"
              data-testid="report-link"
              to={`${props.path}/report/${report.id}`}>
              <span className="mr-2">
                {permissions.status.isDraft ? 'Start report' : 'View report'}
              </span>
              <FontAwesomeIcon icon={['far', 'chevron-right']} />
            </Link>
          )}
          {permissions.action.canDeleteReport && props.onDelete && (
            <ButtonDestroy
              btnCancel={{ text: 'Cancel' }}
              btnSubmit={{ text: 'Delete', color: 'danger' }}
              className="mx-1"
              data-testid="button-delete-report"
              icon={['far', 'trash-alt']}
              modal={{
                body: 'Are you sure you would like to delete this report?',
              }}
              size="md"
              onConfirm={props.onDelete(report.id)}>
              <span className="d-md-none ml-2">Delete</span>
            </ButtonDestroy>
          )}
        </Col>
      </Row>
    </CardPlain>
  );
};

InspectionReportListItem.propTypes = {
  onDelete: PropTypes.func,
  onUploaderComplete: PropTypes.func,
  path: PropTypes.string,
  propertyId: PropTypes.number,
  report: PropTypes.object,
  userId: PropTypes.number,
};

InspectionReportListItem.defaultProps = {
  path: '',
  report: {},
};
