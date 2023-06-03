import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

export const IconWorkOrder = ({ className, job, quote, size }) => {
  const icon =
    quote?.isWorkOrder || job?.myQuote?.isWorkOrder || job?.hasWorkOrder
      ? 'hammer'
      : 'comment-dollar';

  return (
    <FontAwesomeIcon
      className={className}
      icon={['far', icon]}
      size={size || 'sm'}
      title="Work order"
    />
  );
};

IconWorkOrder.propTypes = {
  className: PropTypes.string,
  job: PropTypes.object,
  quote: PropTypes.object,
  size: PropTypes.string,
};
