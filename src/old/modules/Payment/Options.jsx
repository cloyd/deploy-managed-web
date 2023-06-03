import PropTypes from 'prop-types';
import React from 'react';
import { CustomInput } from 'reactstrap';

import { CardLight } from '../Card';

export const PaymentOptions = ({ isAutoPay, isDisabled, onChange }) => (
  <CardLight title="Payment Options">
    {isAutoPay ? (
      <p>Automatic rental payments enabled</p>
    ) : (
      <CustomInput
        data-testid="input-autoPay"
        type="checkbox"
        id="autoPay"
        name="autoPay"
        label="Re-enable automatic payments"
        disabled={isDisabled}
        checked={isAutoPay}
        onChange={onChange}
      />
    )}
  </CardLight>
);

PaymentOptions.defaultProps = {
  isAutoPay: false,
  isDisabled: false,
};

PaymentOptions.propTypes = {
  isAutoPay: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};
