import PropTypes from 'prop-types';
import React from 'react';

export const PaymentVirtualAccountValue = ({
  virtualAccountBsb,
  virtualAccountNumber,
}) => (
  <small className="d-block" data-testid="bpay-value">
    <strong>BSB:</strong> <span>{virtualAccountBsb || '-'}</span>
    <br />
    <strong>Account Number:</strong> <span>{virtualAccountNumber || '-'}</span>
  </small>
);

PaymentVirtualAccountValue.defaultProps = {
  virtualAccountBsb: '-',
  virtualAccountNumber: '-',
};

PaymentVirtualAccountValue.propTypes = {
  virtualAccountBsb: PropTypes.string,
  virtualAccountNumber: PropTypes.string,
};
