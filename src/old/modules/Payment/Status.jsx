import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Badge } from 'reactstrap';

import { useTaskIsState } from '@app/modules/Task';

export const PaymentStatus = ({ className, intention }) => {
  const { paymentStatus } = useTaskIsState({
    frontendStatus: intention?.frontendStatus,
  });

  return intention?.isWalletDischarge ? (
    <span className={`text-nowrap ${className}`}>
      <FontAwesomeIcon icon={['far', 'wallet']} className="text-success" />
      <FontAwesomeIcon
        icon={['far', 'exchange']}
        className="text-success mx-1"
      />
      <FontAwesomeIcon icon={['far', 'user']} className="text-success" />
    </span>
  ) : (
    <Badge
      color={paymentStatus?.color}
      className={`p-1 ${className} ${paymentStatus?.style || ''}`}>
      {paymentStatus?.text}
    </Badge>
  );
};

PaymentStatus.propTypes = {
  className: PropTypes.string,
  intention: PropTypes.object.isRequired,
};

PaymentStatus.defaultProps = {
  className: '',
};
