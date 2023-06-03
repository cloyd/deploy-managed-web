import PropTypes from 'prop-types';
import React from 'react';
import { Badge } from 'reactstrap';

import {
  INSPECTION_STATUS,
  INSPECTION_STATUS_LABELS,
} from '../../redux/inspection';

const COLORS = {
  [INSPECTION_STATUS.COMPLETED]: 'success',
  [INSPECTION_STATUS.DRAFT]: 'light',
  [INSPECTION_STATUS.PENDING_AGENCY]: 'primary',
  [INSPECTION_STATUS.PENDING_TENANT]: 'secondary',
  [INSPECTION_STATUS.PENDING_UPLOAD]: 'warning',
  [INSPECTION_STATUS.REJECTED]: 'danger',
};

export const InspectionStatusBadge = ({ status }) => {
  const color = COLORS[status] || '';
  const text = INSPECTION_STATUS_LABELS[status] || '';
  const classes = status === 'draft' ? 'border' : '';

  return status ? (
    <Badge className={`text-capitalize ${classes}`} color={color}>
      {text}
    </Badge>
  ) : null;
};

InspectionStatusBadge.propTypes = {
  status: PropTypes.string,
};

InspectionStatusBadge.defaultProps = {
  status: '',
};
