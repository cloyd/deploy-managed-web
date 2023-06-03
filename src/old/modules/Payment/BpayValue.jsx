import PropTypes from 'prop-types';
import React from 'react';

export const PaymentBpayValue = ({ bpayBillerCode, bpayReference }) => (
  <small className="d-block" data-testid="bpay-value">
    <strong>Biller Code:</strong> <span>{bpayBillerCode || '-'}</span>
    <br />
    <strong>Ref Number:</strong> <span>{bpayReference || '-'}</span>
  </small>
);

PaymentBpayValue.defaultProps = {
  bpayBillerCode: '-',
  bpayReference: '-',
};

PaymentBpayValue.propTypes = {
  bpayBillerCode: PropTypes.string,
  bpayReference: PropTypes.string,
};
