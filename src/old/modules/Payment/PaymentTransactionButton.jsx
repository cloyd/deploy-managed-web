import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Button } from 'reactstrap';

import { USER_TYPES } from '../../redux/users';
import { useRolesContext } from '../Profile';
import { useCanPay } from './hooks';

export const PaymentTransactionButton = ({
  className,
  intention,
  onClick,
  property,
  total,
  tenantWalletBalance,
  amount,
  paymentMethod,
}) => {
  const canPay = useCanPay(intention);
  const { isCorporateUser, isManager, isPrincipal } = useRolesContext();
  const isAgencyUser = isManager || isCorporateUser || isPrincipal;
  const debtorPaysViaWallet = ['bpay', 'wallet'].includes(paymentMethod);

  const handleClick = useCallback(
    () => onClick(property, intention),
    [onClick, property, intention]
  );

  const showPayButton = () => {
    if (intention.debtor === USER_TYPES.tenant) {
      if (debtorPaysViaWallet && tenantWalletBalance >= amount) {
        return true;
      } else if (!debtorPaysViaWallet && isAgencyUser) {
        return false;
      } else if (!debtorPaysViaWallet) {
        return true;
      }
    } else if (intention.debtor === USER_TYPES.owner) {
      if (
        (debtorPaysViaWallet && property.floatBalanceAmountCents >= amount) ||
        !debtorPaysViaWallet
      ) {
        return true;
      }
    } else {
      return true;
    }

    return false;
  };

  return canPay && onClick && showPayButton() ? (
    <div
      className={`d-flex flex-column align-items-end justify-content-between ${className}`}>
      <Button
        style={{ minWidth: '85px' }}
        outline={intention.debtor === USER_TYPES.tenant}
        color={intention?.isOverdue ? 'danger' : 'primary'}
        onClick={handleClick}
        disabled={intention.disablePayButton}>
        {intention.debtor === USER_TYPES.tenant && isAgencyUser
          ? 'Prioritise'
          : 'Pay'}{' '}
        {total}
      </Button>
    </div>
  ) : null;
};

PaymentTransactionButton.propTypes = {
  className: PropTypes.string,
  intention: PropTypes.object.isRequired,
  isLast: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  property: PropTypes.object.isRequired,
  total: PropTypes.string,
  tenantWalletBalance: PropTypes.number,
  amount: PropTypes.number,
  paymentMethod: PropTypes.string,
};
PaymentTransactionButton.defaultProps = {
  tenantWalletBalance: 0,
  amount: 0,
  paymentMethod: '',
};
