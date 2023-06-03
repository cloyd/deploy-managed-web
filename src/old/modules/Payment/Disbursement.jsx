import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Alert } from 'reactstrap';

import { useRolesContext } from '../Profile';

const alerts = {
  default: 'You may want to use an offset account to save on interest.',
  caveat: 'Changes made here will not affect other properties.',
  properties:
    'To change bank account for an individual property, please go to the Property > Settings page.',
};

export const PaymentDisbursement = ({
  children,
  className,
  isLoading,
  isSetup,
  properties,
  style,
  isSecondaryTenant,
}) => {
  const { isExternalCreditor, isOwner, isPrincipal, isTenant } =
    useRolesContext();

  const heading = useMemo(
    () =>
      isPrincipal || isExternalCreditor
        ? 'Where would you like payments deposited?'
        : isOwner
        ? 'Where would you like rental payments deposited?'
        : isTenant
        ? `Where would you like to ${
            isSecondaryTenant ? 'receive' : 'send'
          } any refunds or reimbursements?`
        : 'Where would you like the app to send any fees collected?',
    [isPrincipal, isExternalCreditor, isOwner, isTenant, isSecondaryTenant]
  );

  const alert = useMemo(
    () =>
      `${alerts.default}${isSetup ? '' : ` ${alerts.caveat}`} ${
        properties.length > 1 ? alerts.properties : ''
      }`,
    [properties.length, isSetup]
  );

  return (
    <div
      className={className}
      data-testid="payment-settings-disbursement"
      style={style}>
      <h4 className="mb-3" data-testid="section-heading">
        {heading}
      </h4>
      {!isLoading && isOwner && (
        <Alert color="warning" fade={false}>
          {alert}
        </Alert>
      )}
      {!isLoading && children}
    </div>
  );
};

PaymentDisbursement.defaultProps = {
  className: 'mb-3',
  properties: [],
  isSecondaryTenant: false,
};

PaymentDisbursement.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  isSetup: PropTypes.bool,
  properties: PropTypes.array,
  style: PropTypes.object,
  isSecondaryTenant: PropTypes.bool,
};
