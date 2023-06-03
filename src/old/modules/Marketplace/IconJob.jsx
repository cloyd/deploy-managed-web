import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

export const IconJob = ({ className, hasWorkOrder, size, tradieJobId }) =>
  tradieJobId ? (
    <FontAwesomeIcon
      className={className}
      icon={['far', hasWorkOrder ? 'user-hard-hat' : 'wrench']}
      size={size || 'sm'}
      title={hasWorkOrder ? 'Work order' : 'Job'}
    />
  ) : null;

IconJob.propTypes = {
  className: PropTypes.string,
  hasWorkOrder: PropTypes.bool,
  size: PropTypes.string,
  tradieJobId: PropTypes.number,
};
