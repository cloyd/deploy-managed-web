import PropTypes from 'prop-types';
import React from 'react';
import { CustomInput } from 'reactstrap';

import { CardLight } from '../Card';

export const PaymentAutomateSelector = ({ isAutoBills, isAutoRent }) => (
  <CardLight className="mb-3" title="Automate my payments">
    <CustomInput
      checked={isAutoRent}
      data-testid="payment-settings-auto-rent"
      id="paymentSettings-autoRent"
      label="Automatically Pay my Rent"
      name="autoRent"
      type="checkbox"
      disabled={true}
    />
    <CustomInput
      checked={isAutoBills}
      data-testid="payment-settings-auto-bills"
      id="paymentSettings-autoBills"
      label="Automatically Pay my Bills"
      name="autoBills"
      type="checkbox"
      disabled={true}
    />
  </CardLight>
);

PaymentAutomateSelector.propTypes = {
  isAutoBills: PropTypes.bool,
  isAutoRent: PropTypes.bool,
};

PaymentAutomateSelector.defaultProps = {
  isAutoBills: true,
  isAutoRent: true,
};
