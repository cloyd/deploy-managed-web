import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React from 'react';

import { InspectionReportBlockedAlert, InspectionStatusBadge } from '..';
import { formatDate } from '../../../utils';
import { ContentWithLabel } from '../../Content';
import { Link } from '../../Link';
import { PropertyUserIcon } from '../../Property';

/**
 * Inspection report details
 */
export const InspectionReportDetails = (props) => {
  const { report, pathname } = props;

  return (
    <div className="d-flex flex-column">
      <div className="mb-3">
        <InspectionStatusBadge status={report.status} />
      </div>
      <div className="d-block d-md-flex">
        <ContentWithLabel
          className="mr-3"
          label="Inspection date"
          value={formatDate(report.inspectionDate)}
        />
        <ContentWithLabel label="Type" value={startCase(report.typeOf)} />
      </div>
      <ContentWithLabel className="mr-3" label="Inspection by">
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
      </ContentWithLabel>
      <ContentWithLabel className="mr-3" label="Tenant">
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
      </ContentWithLabel>
      {report.updateBlockedByReportId ? (
        <InspectionReportBlockedAlert
          path={pathname}
          text="Another property inspection is currently in progress."
          updateBlockedByReportId={report.updateBlockedByReportId}
        />
      ) : (
        <p className="mt-3 mb-0">
          <Link className="w-100" to={`${pathname}/report/${report.id}`}>
            View {startCase(report.typeOf)} Report
            <FontAwesomeIcon className="ml-2" icon={['far', 'chevron-right']} />
          </Link>
        </p>
      )}
    </div>
  );
};

InspectionReportDetails.propTypes = {
  pathname: PropTypes.string,
  report: PropTypes.object,
};

InspectionReportDetails.defaultProps = {
  report: {},
};
