import PropTypes from 'prop-types';
import React from 'react';
import { Alert } from 'reactstrap';

import { useRolesContext } from '../Profile';

export const PaymentDefault = (props) => {
  const { children, className, isAutoPay, isLoading, isSetup } = props;

  const { isOwner, isPrincipal, isTenant } = useRolesContext();

  const heading = isPrincipal
    ? 'Please also add a payment method for any fees, charges or reimbursements required'
    : isOwner
    ? 'How would you like to pay for expenses?'
    : isTenant
    ? 'How would you like to pay rent and bills?'
    : '';

  const alert = isOwner
    ? `We can pay all building maintenance and repairs so please nominate the account you would like to use.${
        isSetup ? '' : ' Changes made here will not affect other properties.'
      }
      Note: Paying by Visa/MasterCard will incur a 1.6% + 10c transaction fee.`
    : `${isAutoPay ? 'Payments will be deducted automatically. ' : ''}
      Note: Paying rent by Visa/MasterCard will incur a 1.6% + 10c transaction fee.`;

  const canShowAlert = !isLoading && (isOwner || (isTenant && !isSetup));

  return (
    <div
      className={className}
      data-testid="payment-settings-default"
      style={props.style}>
      <h4 className="mb-3" data-testid="section-heading">
        {heading}
      </h4>
      {canShowAlert && (
        <Alert color="warning" fade={false}>
          {alert}
        </Alert>
      )}
      {!isLoading && children}
    </div>
  );
};

PaymentDefault.defaultProps = {
  className: 'mb-3',
  isAutoPay: false,
  isSetup: false,
};

PaymentDefault.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isAutoPay: PropTypes.bool,
  isLoading: PropTypes.bool,
  isSetup: PropTypes.bool,
  style: PropTypes.object,
};
