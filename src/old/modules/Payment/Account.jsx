import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button, Col, Row } from 'reactstrap';

import {
  PaymentBankValue,
  PaymentBpayIcon,
  PaymentBpayValue,
  PaymentCardValue,
  PaymentNoValue,
  PaymentVirtualAccountIcon,
  PaymentVirtualAccountValue,
} from '.';
import { selectIsInvalidPhoneNumber } from '../../redux/profile';
import { useRolesContext } from '../Profile';

export const PaymentAccount = (props) => {
  const {
    account,
    canChange,
    canPayOwnBills,
    canPayViaBpay,
    canPayViaRent,
    isActive,
    isEditing,
    isEnableMtech,
    isEnablePromisepay,
    onChangeType,
    onSetDefault,
    onChange,
    onDestroy,
    title,
    user,
    onRemoveHash,
    handleGenerateVirtualAccount,
  } = props;

  const isInvalidPhoneNumber = useSelector(selectIsInvalidPhoneNumber);

  const { isManager, isOwner, isPrincipal, isTenant } = useRolesContext();
  const isManagerOrOwner = useMemo(
    () => isManager || isOwner || isPrincipal,
    [isManager, isOwner, isPrincipal]
  );
  const showBtn = useMemo(
    () =>
      canChange &&
      onChange &&
      !isEditing &&
      (account.type ||
        account.accountType ||
        canPayOwnBills ||
        canPayViaBpay ||
        canPayViaRent ||
        isManagerOrOwner),
    [
      account.accountType,
      account.type,
      canChange,
      canPayOwnBills,
      canPayViaBpay,
      canPayViaRent,
      isEditing,
      onChange,
      isManagerOrOwner,
    ]
  );

  return (
    <>
      {account.number ? (
        <PaymentCardValue
          account={account}
          title={title}
          isActive={isActive}
          isEditing={isEditing}
          onDestroy={onDestroy}
          onSetDefault={onSetDefault}
          onRemoveHash={onRemoveHash}
        />
      ) : account.accountType ? (
        <PaymentBankValue
          account={account}
          title={title}
          isActive={isActive}
          isEditing={isEditing}
          isEnableMtech={isEnableMtech}
          isEnablePromisepay={isEnablePromisepay}
          onDestroy={onDestroy}
          onEnable={onSetDefault}
          onSetDefault={onSetDefault}
        />
      ) : canPayOwnBills ? (
        <PaymentNoValue
          titleText="Pay my own bills"
          isActive={isEditing}
          isEditing={isEditing}
          onSetDefault={onChangeType}
          accountType="noDefaultBiller">
          <p>Pay my own bills</p>
        </PaymentNoValue>
      ) : canPayViaBpay ? (
        <PaymentNoValue
          titleText="Direct Payments"
          isActive={isEditing}
          isEditing={isEditing}
          onSetDefault={onChangeType}
          accountType="bpay"
          isDirectPayments={true}>
          <Row>
            <Col className="col-6">
              <PaymentBpayIcon>
                <PaymentBpayValue
                  bpayBillerCode={user.bpayBillerCode}
                  bpayReference={user.bpayReference}
                />
              </PaymentBpayIcon>
            </Col>
            <Col className="col-6">
              {(user.virtualAccount || user.canGenerateVirtualAccount) &&
                isTenant && (
                  <PaymentVirtualAccountIcon
                    className={!user?.virtualAccount?.status && 'text-center'}
                    title={
                      user?.virtualAccount?.status
                        ? 'Direct Payment'
                        : 'Direct payment to a unique BSB and Account Number'
                    }
                    virtualAccountStatus={user.virtualAccount?.status}>
                    {!user.canGenerateVirtualAccount ? (
                      <PaymentVirtualAccountValue
                        virtualAccountBsb={user.virtualAccount?.routingNumber}
                        virtualAccountNumber={
                          user.virtualAccount?.accountNumber
                        }
                        virtualAccountStatus={
                          user.virtualAccount.virtualAccountStatus
                        }
                      />
                    ) : (
                      <Button
                        color="primary"
                        className="mt-1"
                        onClick={handleGenerateVirtualAccount}>
                        Generate Details
                      </Button>
                    )}
                  </PaymentVirtualAccountIcon>
                )}
            </Col>
          </Row>
        </PaymentNoValue>
      ) : canPayViaRent ? (
        <PaymentNoValue
          titleText="Pay via rent"
          isActive={isEditing}
          isEditing={isEditing}
          onSetDefault={onChangeType}
          accountType="noPaymentAccount">
          <p data-testid="message-pay-via-rent">
            Automatically deduct payments from property rent wallet
          </p>
        </PaymentNoValue>
      ) : null}

      {showBtn && (
        <Button
          className="pt-2"
          color="link"
          data-testid="payment-account-change-btn"
          onClick={onChange}
          disabled={isOwner && isInvalidPhoneNumber}>
          {Object.keys(account).length === 0
            ? 'Add payment method'
            : 'Change payment method'}
        </Button>
      )}
    </>
  );
};

PaymentAccount.propTypes = {
  account: PropTypes.object,
  accounts: PropTypes.array,
  canChange: PropTypes.bool,
  canPayOwnBills: PropTypes.bool,
  canPayViaBpay: PropTypes.bool,
  canPayViaRent: PropTypes.bool,
  isActive: PropTypes.bool,
  isEditing: PropTypes.bool,
  isEnableMtech: PropTypes.bool,
  isEnablePromisepay: PropTypes.bool,
  onChangeType: PropTypes.func,
  onEnable: PropTypes.func,
  onSetDefault: PropTypes.func,
  onChange: PropTypes.func,
  onDestroy: PropTypes.func,
  title: PropTypes.string,
  user: PropTypes.object,
  onRemoveHash: PropTypes.func,
  handleGenerateVirtualAccount: PropTypes.func,
};

PaymentAccount.defaultProps = {
  account: {},
  accounts: [],
  canChange: true,
  canPayOwnBills: false,
  canPayViaBpay: false,
  canPayViaRent: false,
  isActive: false,
  isEditing: false,
  isEnableMtech: false,
  isEnablePromisepay: false,
  user: {},
};
