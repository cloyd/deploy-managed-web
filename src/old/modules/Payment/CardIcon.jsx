import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

const ICONS = {
  default: ['far', 'credit-card-front'],
  mastercard: ['fab', 'cc-mastercard'],
  master: ['fab', 'cc-mastercard'],
  visa: ['fab', 'cc-visa'],
};

export const PaymentCardIcon = ({ cardType, className, ...props }) => {
  const icon = ICONS[cardType] || ICONS['default'];

  return (
    <FontAwesomeIcon
      icon={icon}
      className={className.split(' ').concat('text-primary').join(' ')}
      {...props}
    />
  );
};

PaymentCardIcon.defaultProps = {
  cardType: 'default',
  className: '',
};

PaymentCardIcon.propTypes = {
  cardType: PropTypes.string,
  className: PropTypes.string,
};
