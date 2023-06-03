import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { PulseLoader } from 'react-spinners';

import { PaymentTransactionItem } from '.';
import { getTransactionViewRole } from '../../redux/profile';
import { CardLight } from '../Card';

export const PaymentTransaction = ({
  canApplyCredit,
  children,
  hasError,
  intentions,
  isLoading,
  message,
  property,
  title,
  onClickPayment,
  onClickRemove,
  onSubmit,
  tenantWalletBalance,
  isCompleted,
}) => {
  const transactionViewRole = useSelector((state) =>
    getTransactionViewRole(state.profile)
  );

  return (
    <CardLight className="mb-3" title={title}>
      {!isLoading ? (
        <>
          {intentions.map((intention, index) => (
            <PaymentTransactionItem
              key={`transaction-${intention.id}`}
              canApplyCredit={canApplyCredit}
              hasError={hasError}
              intention={intention}
              isDebtor={transactionViewRole === intention.debtor}
              isLoading={isLoading}
              isLast={index + 1 === intentions.length}
              property={property}
              isShowAddress={false}
              totals={intention.formatted[transactionViewRole]}
              onClickPayment={onClickPayment}
              onClickRemove={onClickRemove}
              onSubmit={onSubmit}
              tenantWalletBalance={tenantWalletBalance}
              isCompleted={isCompleted}
            />
          ))}
          {message && intentions.length === 0 && (
            <small className="mx-2">{message}</small>
          )}
          {children}
        </>
      ) : (
        <PulseLoader color="#dee2e6" />
      )}
    </CardLight>
  );
};

PaymentTransaction.propTypes = {
  canApplyCredit: PropTypes.bool,
  children: PropTypes.node,
  hasError: PropTypes.bool.isRequired,
  intentions: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  message: PropTypes.string,
  property: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  transactionViewRole: PropTypes.string.isRequired,
  onClickPayment: PropTypes.func,
  onClickRemove: PropTypes.func,
  onSubmit: PropTypes.func,
  tenantWalletBalance: PropTypes.number,
  isCompleted: PropTypes.bool,
};

PaymentTransaction.defaultProps = {
  canApplyCredit: false,
  isLoading: true,
  isCompleted: false,
};

export default memo(PaymentTransaction);
