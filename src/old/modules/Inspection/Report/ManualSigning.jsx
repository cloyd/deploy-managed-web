import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

import { InspectionReportUpload } from './Upload';

/**
 * Component that allows upload of manually signed inspection
 */
export const InspectionReportManualSigning = (props) => {
  const { hasReportFile, onUploaderComplete, reportId } = props;

  return hasReportFile && reportId ? (
    <InspectionReportUpload
      isEdit={true}
      reportId={reportId}
      onUploaderComplete={onUploaderComplete}
    />
  ) : (
    <div className="d-flex">
      <FontAwesomeIcon className="mr-1 mt-2" icon={['far', 'spinner']} spin />
      <div className="d-flex flex-column">
        <small>Report is being generated, please check</small>
        <small>again later to complete manual signing</small>
      </div>
    </div>
  );
};

InspectionReportManualSigning.propTypes = {
  className: PropTypes.string,
  hasReportFile: PropTypes.bool,
  onUploaderComplete: PropTypes.func.isRequired,
  reportId: PropTypes.number,
};
