import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { Table } from 'reactstrap';

import { PaymentRowAddress, PaymentRowInfo, PaymentRowWallets } from '.';
import { USER_TYPES } from '../../redux/users';
import { centsToDollar } from '../../utils';

export const PaymentByBank = ({
  address,
  canShowPayByWallet,
  intention,
  tenantWalletBalance,
  onChangePayingWallet,
  ...props
}) => {
  const { fees, payBy } = intention.formatted?.debtor || {};

  const [total, setTotal] = useState(intention.formatted?.debtor?.total);

  const isPayByWallet = useMemo(() => {
    return (
      intention.debtor !== USER_TYPES.owner &&
      (intention.isPayByWallet || canShowPayByWallet)
    );
  }, [intention, canShowPayByWallet]);

  const formattedBalance = useMemo(() => {
    if (Number.isInteger(tenantWalletBalance)) {
      return centsToDollar(tenantWalletBalance);
    }
  }, [tenantWalletBalance]);

  const isZero = useMemo(() => {
    return formattedBalance === '$0';
  }, [formattedBalance]);

  const defaultWallet = useMemo(() => {
    const description = intention.isDD
      ? null
      : intention.isCC
      ? `Transaction fees (${fees?.percentage} + ${fees?.fixed})`
      : `Available balance: ${formattedBalance || '-'}`;

    const formattedFees = intention.isCC
      ? fees?.amount
      : `Transaction fee: ${fees?.amount}`;

    return {
      id: 0,
      name: `Pay via ${isPayByWallet ? 'wallet' : payBy?.method}`,
      balance: intention.floatBalanceAmountCents,
      currency: intention.floatBalanceAmountCurrency,
      description,
      formattedFees,
    };
  }, [fees, formattedBalance, intention, isPayByWallet, payBy]);

  const payingWallets = useMemo(() => {
    return props.payingWallets.map((wallet) => {
      const description = `Available Balance: ${centsToDollar(wallet.balance)}`;

      return {
        ...wallet,
        description,
        formattedFees: undefined,
      };
    });
  }, [props.payingWallets]);

  const wallets = useMemo(() => {
    return [defaultWallet, ...payingWallets];
  }, [defaultWallet, payingWallets]);

  const onChange = useCallback(
    (walletId) => {
      if (walletId === 0) {
        setTotal(intention.formatted?.debtor?.total);
        onChangePayingWallet(undefined);
      } else {
        setTotal(intention.formatted?.debtor?.payBy?.amount);
        onChangePayingWallet(walletId);
      }
    },
    [intention, onChangePayingWallet]
  );

  return (
    <Table className="mb-0">
      <tbody>
        <PaymentRowAddress {...address} />
        <PaymentRowInfo intention={intention} />
        {wallets.length === 1 ? (
          <>
            {isPayByWallet && (
              <tr>
                <td>Available amount in wallet</td>
                <td
                  className={`text-right align-bottom ${
                    isZero && 'text-danger'
                  }`}>
                  {formattedBalance}
                </td>
              </tr>
            )}
            <tr>
              <td>
                <strong>{defaultWallet.name}</strong>
                <br />
                <small>{defaultWallet.description}</small>
              </td>
              <td className="text-right align-bottom">
                {defaultWallet.formattedAmount}
                {defaultWallet.formattedFees && (
                  <span className="d-block">{defaultWallet.formattedFees}</span>
                )}
              </td>
            </tr>
          </>
        ) : (
          <>
            <tr>
              <td colSpan={2} className="px-0">
                <PaymentRowWallets wallets={wallets} onChange={onChange} />
              </td>
            </tr>
            <tr className="font-weight-bold">
              <td>Total Amount</td>
              <td colSpan={2} className="text-right">
                {total}
              </td>
            </tr>
          </>
        )}
      </tbody>
    </Table>
  );
};

PaymentByBank.defaultProps = {
  canShowPayByWallet: false,
  payingWallets: [],
};

PaymentByBank.propTypes = {
  address: PropTypes.object.isRequired,
  intention: PropTypes.object.isRequired,
  onChangePayingWallet: PropTypes.func.isRequired,
  canShowPayByWallet: PropTypes.bool,
  payingWallets: PropTypes.array,
  tenantWalletBalance: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};
