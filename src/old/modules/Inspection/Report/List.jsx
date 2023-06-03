import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { InspectionReportListItem } from '..';
import { formatDate } from '../../../utils';

export const InspectionReportList = (props) => {
  const { reportsByLease } = props;

  const leaseIds = useMemo(
    () =>
      Object.keys(reportsByLease)
        .map((key) => parseInt(key, 10))
        .sort((a, b) => b - a),
    [reportsByLease]
  );

  return (
    <div className="mt-4">
      {leaseIds.map((leaseId) => {
        const lease = reportsByLease[leaseId] || {};
        const { endDate, reports, startDate } = lease;

        return lease.id ? (
          <div key={`lease-${leaseId}`} className="mb-4">
            <p className="my-2">
              <strong>
                {startDate
                  ? `${formatDate(startDate)} to ${formatDate(endDate)}`
                  : 'Draft Lease'}
              </strong>
            </p>
            {reports.map((report) => (
              <InspectionReportListItem
                key={`report-${report.id}`}
                path={props.path}
                propertyId={props.propertyId}
                report={report}
                userId={props.userId}
                onDelete={props.onDelete}
                onUploaderComplete={props.onUploaderComplete}
              />
            ))}
          </div>
        ) : null;
      })}
    </div>
  );
};

InspectionReportList.propTypes = {
  onDelete: PropTypes.func,
  onUploaderComplete: PropTypes.func,
  path: PropTypes.string,
  propertyId: PropTypes.number,
  reportsByLease: PropTypes.object,
  userId: PropTypes.number,
};

InspectionReportList.defaultProps = {
  path: '',
  reportsByLease: {},
};
