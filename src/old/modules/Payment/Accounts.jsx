import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { PaymentAccount } from '.';

export const PaymentAccounts = ({
  canPayOwnBills,
  canPayViaBpay,
  canPayViaRent,
  isEditing,
  isEnableMtech,
  isEnablePromisepay,
  onChange,
  onSetDefault,
  onDestroy,
  user,
  onRemoveHash,
  handleGenerateVirtualAccount,
  accounts,
  account,
}) => {
  const isAccountSet = useMemo(
    () => account && Object.keys(account).length > 0,
    [account]
  );

  const renderAccount = useCallback(
    (accountParam) => (
      <div className="mb-3">
        <PaymentAccount
          account={accountParam}
          canPayOwnBills={canPayOwnBills}
          canPayViaBpay={canPayViaBpay}
          canPayViaRent={canPayViaRent}
          isActive={accountParam === account}
          isEditing={isEditing}
          isEnableMtech={isEnableMtech}
          isEnablePromisepay={isEnablePromisepay}
          onChange={onChange}
          onDestroy={onDestroy}
          onEnable={onSetDefault}
          onSetDefault={onSetDefault}
          user={user}
          onRemoveHash={onRemoveHash}
          handleGenerateVirtualAccount={handleGenerateVirtualAccount}
          title={accountParam?.bankName || null}
        />
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      canPayOwnBills,
      canPayViaBpay,
      canPayViaRent,
      isEditing,
      isEnableMtech,
      isEnablePromisepay,
      onChange,
      onDestroy,
      onSetDefault,
      account,
      user,
      onRemoveHash,
    ]
  );

  return isEditing ? (
    <>
      {accounts.map((account) => (
        <div className="mb-3" key={account.promisepayId}>
          {renderAccount(account)}
        </div>
      ))}
      {!isAccountSet && renderAccount()}
    </>
  ) : (
    renderAccount(account)
  );
};

PaymentAccounts.propTypes = {
  account: PropTypes.object,
  accounts: PropTypes.array,
  canPayOwnBills: PropTypes.bool,
  canPayViaBpay: PropTypes.bool,
  canPayViaRent: PropTypes.bool,
  isEditing: PropTypes.bool,
  isEnableMtech: PropTypes.bool,
  isEnablePromisepay: PropTypes.bool,
  onChange: PropTypes.func,
  onChangeType: PropTypes.func,
  onEnable: PropTypes.func,
  onSetDefault: PropTypes.func,
  onDestroy: PropTypes.func,
  user: PropTypes.object,
  onRemoveHash: PropTypes.func,
  handleGenerateVirtualAccount: PropTypes.func,
};

PaymentAccounts.defaultProps = {
  account: {},
  accounts: [],
  canPayOwnBills: false,
  canPayViaBpay: false,
  canPayViaRent: false,
  isEditing: false,
  isEnableMtech: false,
  isEnablePromisepay: false,
  user: {},
};
