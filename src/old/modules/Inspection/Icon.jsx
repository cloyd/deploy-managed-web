import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

export const IconInspectionReport = ({ className, inspectionReportId, size }) =>
  inspectionReportId ? (
    <FontAwesomeIcon
      className={className}
      icon={['far', 'clipboard-list']}
      size={size || 'sm'}
      title="Inspection report"
    />
  ) : null;

IconInspectionReport.propTypes = {
  className: PropTypes.string,
  inspectionReportId: PropTypes.number,
  size: PropTypes.string,
};
