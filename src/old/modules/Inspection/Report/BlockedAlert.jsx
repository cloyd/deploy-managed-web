import PropTypes from 'prop-types';
import React from 'react';
import { Alert } from 'reactstrap';

import { Link } from '../../Link';

export const InspectionReportBlockedAlert = (props) =>
  !!props.updateBlockedByReportId && (
    <Alert
      color="primary"
      className="mt-3 mb-0"
      data-testid="alert-inspection-in-progress">
      {props.text ||
        `Property inspection is currently in progress and changes to the property
      condition cannot be made until the inspection is complete.`}{' '}
      &nbsp;
      <Link
        to={`${props.path}/report/${props.updateBlockedByReportId}`}
        disabled={props.isArchived}>
        <u>Click here to continue inspection</u>
      </Link>
    </Alert>
  );

InspectionReportBlockedAlert.propTypes = {
  path: PropTypes.string,
  text: PropTypes.string,
  updateBlockedByReportId: PropTypes.number,
  isArchived: PropTypes.bool,
};

InspectionReportBlockedAlert.defaultProps = {
  path: '',
};
