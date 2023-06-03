import pluralize from 'pluralize';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { PulseLoader } from 'react-spinners';

import {
  InspectionReportDownloadLink,
  InspectionReportManualSigning,
  InspectionReportSendTenantButton,
  InspectionStatusBadge,
} from '..';
import { formatDate, toClassName } from '../../../utils';
import { ButtonDestroy } from '../../Button';
import { Link } from '../../Link';
import { useRolesContext } from '../../Profile';
import { PropertyUserIcon } from '../../Property';
import { SignatureModule } from '../../Signature';
import { useInspectionReportTotals } from '../hooks';

export const InspectionReportAreaActions = (props) => {
  const { isIngoingReport, onUploaderComplete, permissionsStatus, report } =
    props;
  const { report: reportFile } = report;

  const { isManager, isTenant } = useRolesContext();
  const totals = useInspectionReportTotals(report, props.areas);

  const canSignReport = useMemo(
    () =>
      isTenant || (isManager && isIngoingReport)
        ? totals.remaining === 0
        : true,
    [isManager, isTenant, isIngoingReport, totals.remaining]
  );

  return props.isLoading ? (
    <PulseLoader size={12} color="#dee2e6" className="ml-4" />
  ) : (
    <div className="d-lg-flex" data-testid="report-area-actions">
      <div className="w-100 mb-2 mb-md-0">
        <div className="d-sm-flex mb-2">
          <h3 className="text-capitalize">
            {report.typeOf
              ? `${report.typeOf} Report - ${formatDate(report.inspectionDate)}`
              : 'Inspection Report'}
          </h3>
          <span className="mx-sm-2 my-sm-1">
            <InspectionStatusBadge status={report.status} />
          </span>
        </div>
        {report.propertyTaskId && isManager && (
          <p className="mb-0 text-small">
            Task:&nbsp;
            <Link
              to={`/property/${props.propertyId}/tasks/${report.propertyTaskId}`}>
              <small>view task</small>
            </Link>
          </p>
        )}
        {report.lease?.startDate && (
          <p className="mb-0 text-small">
            Lease: {formatDate(report.lease.startDate)} to{' '}
            {formatDate(report.lease?.endDate)}
          </p>
        )}
        {report.tenant?.id && (
          <div className="d-flex align-items-center mb-0 text-small">
            Tenant:
            <PropertyUserIcon
              className="text-dark ml-2"
              role="tenant"
              isActive={true}
              size={0.6}
              user={report.tenant}
              userName={report.tenant.name}
            />
          </div>
        )}
        {permissionsStatus?.isPendingAgency && !isIngoingReport && (
          <p className="mb-0 text-primary">
            {totals.reviewed} {pluralize('items', totals.reviewed)} checked
          </p>
        )}
        {(permissionsStatus?.isPendingTenant ||
          (permissionsStatus?.isPendingAgency && isIngoingReport)) && (
          <p
            className={toClassName(
              ['mb-0'],
              canSignReport ? 'text-success' : 'text-danger'
            )}>
            {totals.remaining} {pluralize('items', totals.remaining)} left to
            review
          </p>
        )}
      </div>
      <hr className="d-lg-none" />
      <div className="d-flex flex-column flex-sm-row align-items-start text-nowrap mt-3 mt-sm-0">
        {props.onDelete && (
          <ButtonDestroy
            btnCancel={{ text: 'Cancel' }}
            btnSubmit={{ text: 'Delete', color: 'danger' }}
            className="mx-3"
            icon={['far', 'trash-alt']}
            modal={{
              body: 'Are you sure you would like to delete this report?',
            }}
            size="md"
            onConfirm={props.onDelete}>
            <span className="ml-2">Delete</span>
          </ButtonDestroy>
        )}
        {props.onSendToTenant && (
          <InspectionReportSendTenantButton
            hasReportBeenSent={!!report.tenantCompletionReminderSentAt}
            onSendToTenant={props.onSendToTenant}
          />
        )}
        {props.onSignReport && (
          <SignatureModule
            buttonOptions={{
              text: props.canCompleteReport ? 'Complete Report' : 'Sign Report',
            }}
            isDisabled={!canSignReport}
            onConfirm={canSignReport ? props.onSignReport : null}>
            <p>
              By digitally signing this form, the Tenant, Owner or Agent
              acknowledges that they have reviewed the condition of the property
              and has marked each area as either &#34;Clean&#34;,
              &#34;Undamaged&#34; or &#34;Working&#34; and has provided any
              additional commentary on each area, as may be required.
            </p>
          </SignatureModule>
        )}
        {reportFile?.link &&
          (permissionsStatus.isCompleted || onUploaderComplete) && (
            <InspectionReportDownloadLink link={reportFile.link} />
          )}
        {onUploaderComplete && !permissionsStatus.isCompleted && (
          <InspectionReportManualSigning
            hasReportFile={!!reportFile?.link}
            reportId={report.id}
            onUploaderComplete={onUploaderComplete}
          />
        )}
      </div>
    </div>
  );
};

InspectionReportAreaActions.propTypes = {
  areas: PropTypes.array,
  canCompleteReport: PropTypes.bool,
  isIngoingReport: PropTypes.bool,
  isLoading: PropTypes.bool,
  isManager: PropTypes.bool,
  isTenant: PropTypes.bool,
  onDelete: PropTypes.func,
  onSendToTenant: PropTypes.func,
  onSignReport: PropTypes.func,
  onUploaderComplete: PropTypes.func,
  permissionsStatus: PropTypes.shape({
    isCompleted: PropTypes.bool,
    isPendingAgency: PropTypes.bool,
    isPendingTenant: PropTypes.bool,
  }),
  propertyId: PropTypes.number,
  report: PropTypes.object,
};

InspectionReportAreaActions.defaultProps = {
  canCompleteReport: false,
  isLoading: false,
  report: {},
};
