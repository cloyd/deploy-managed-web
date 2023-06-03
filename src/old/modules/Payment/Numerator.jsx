import PropTypes from 'prop-types';
import React from 'react';

export const PaymentNumerator = ({ numerator }) => {
  const className = numerator === '+' ? 'text-success' : 'text-danger';
  return <span className={`${className} mr-1`}>{numerator}</span>;
};

PaymentNumerator.propTypes = {
  numerator: PropTypes.oneOf(['+', '-']).isRequired,
};
