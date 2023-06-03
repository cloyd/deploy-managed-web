import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Alert, Col, Row } from 'reactstrap';

import { DividerDouble } from '../Divider';
import { PaymentAccount, PaymentAccounts, PaymentSelector } from '../Payment';

export const PropertyPaymentAccount = (props) => {
  const {
    account,
    accounts,
    hasAgreedDda,
    hasError,
    isAssemblyLoading,
    isShowAccountSelector,
    onAccountChange,
    onAccountDestroy,
    onAccountEnable,
    onAccountSet,
    onAccountTypeChange,
    onNewAccountCancel,
    onNewAccountEnable,
    onNewAccountSubmit,
    percentageSplit,
    type,
    user,
    fingerprint,
    hostedFieldsEnv,
  } = props;

  const canChangePaymentAccount = useMemo(
    () => percentageSplit === 10000,
    [percentageSplit]
  );

  const infoText = useMemo(
    () =>
      canChangePaymentAccount
        ? `We can pay all building maintenance and repairs so please nominate the account you would like to use. Changes made here will not affect other properties.
        Note: Paying by Visa/MasterCard will incur a 1.6% + 10c transaction fee.`
        : 'Other payment methods cannot be used if income is being split between multiple owners.',
    [canChangePaymentAccount]
  );

  return (
    <div className="mb-3">
      <h4 className="mb-3">How would you like to pay for expenses?</h4>
      <Alert color="info" fade={false}>
        {infoText}
      </Alert>
      <Row>
        <Col xs={12} className="mb-3">
          <PaymentAccount
            account={account}
            canPayViaRent={true}
            isActive={true}
            isEditing={false}
            isEnablePromisepay
            canChange={canChangePaymentAccount}
            onChange={onAccountChange}
            fingerprint={fingerprint}
          />
        </Col>
        {isShowAccountSelector && (
          <Col xs={12}>
            <DividerDouble />
            <PaymentAccounts
              account={account}
              accounts={accounts}
              canPayViaRent={true}
              isEditing={true}
              isEnablePromisepay
              onDestroy={onAccountDestroy}
              onEnable={onAccountEnable}
              onSetDefault={onAccountSet}
              user={user}
            />
            <PaymentSelector
              account={account}
              hasAgreedDda={hasAgreedDda}
              hasError={hasError}
              isEnablePromisepay
              isLoading={isAssemblyLoading}
              type={type}
              types={['bank', 'card', 'noDefaultPayment']}
              onChange={onAccountTypeChange}
              onCancel={onNewAccountCancel}
              onEnable={onNewAccountEnable}
              onSubmit={onNewAccountSubmit}
              fingerprint={fingerprint}
              hostedFieldsEnv={hostedFieldsEnv}
            />
          </Col>
        )}
      </Row>
    </div>
  );
};

PropertyPaymentAccount.propTypes = {
  account: PropTypes.object,
  accounts: PropTypes.array,
  hasAgreedDda: PropTypes.bool,
  hasError: PropTypes.bool,
  isAssemblyLoading: PropTypes.bool,
  isShowAccountSelector: PropTypes.bool,
  onAccountChange: PropTypes.func,
  onAccountDestroy: PropTypes.func,
  onAccountEnable: PropTypes.func,
  onAccountSet: PropTypes.func,
  onAccountTypeChange: PropTypes.func,
  onNewAccountCancel: PropTypes.func,
  onNewAccountEnable: PropTypes.func,
  onNewAccountSubmit: PropTypes.func,
  percentageSplit: PropTypes.number,
  type: PropTypes.string,
  user: PropTypes.object,
  hostedFieldsEnv: PropTypes.string,
  fingerprint: PropTypes.string,
};
