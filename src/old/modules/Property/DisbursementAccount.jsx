import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Alert, Col, Row } from 'reactstrap';

import { selectBankAccounts } from '../../redux/assembly';
import {
  selectIsInvalidPhoneNumber,
  selectProfileRole,
} from '../../redux/profile';
import { DividerDouble } from '../Divider';
import { PaymentAccount, PaymentAccounts, PaymentSelector } from '../Payment';

export const PropertyDisbursementAccount = (props) => {
  const {
    isAssemblyLoading,
    account,
    onChange,
    onDestroy,
    onEnable,
    onSetDefault,
    isShowAccountSelector,
    hasError,
    hasAgreedDda,
    selectorOnCancel,
    selectorOnSubmit,
    user,
    fingerprint,
    hostedFieldsEnv,
  } = props;

  const isInvalidPhoneNumber = useSelector(selectIsInvalidPhoneNumber);
  const profileRole = useSelector(selectProfileRole);
  const accounts = useSelector(selectBankAccounts);

  return (
    <div className="mb-3">
      <h4 className="mb-3">Where would you like rental payments deposited?</h4>
      <Alert color="info" fade={false}>
        You may want to use an offset account to save on interest. Changes made
        here will not affect other properties.
      </Alert>

      {isInvalidPhoneNumber && profileRole === 'owner' ? null : (
        <Row>
          {account && (
            <Col xs={12} className="mb-3">
              <PaymentAccount
                account={account}
                title="Bank account for rental deposits"
                isActive={true}
                isEditing={false}
                onChange={onChange}
                fingerprint={fingerprint}
              />
            </Col>
          )}
          {isShowAccountSelector && (
            <Col xs={12}>
              <DividerDouble />
              {accounts.length > 0 && (
                <PaymentAccounts
                  account={account}
                  accounts={accounts}
                  isEditing={true}
                  onDestroy={onDestroy}
                  onEnable={onEnable}
                  onSetDefault={onSetDefault}
                />
              )}
              <PaymentSelector
                canReset
                hasError={hasError}
                hasAgreedDda={hasAgreedDda}
                isLoading={isAssemblyLoading}
                type="bank"
                onCancel={selectorOnCancel}
                onEnable={onEnable}
                onSubmit={selectorOnSubmit}
                user={user}
                fingerprint={fingerprint}
                hostedFieldsEnv={hostedFieldsEnv}
              />
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};

PropertyDisbursementAccount.propTypes = {
  isAssemblyLoading: PropTypes.bool,
  account: PropTypes.object,
  onChange: PropTypes.func,
  onDestroy: PropTypes.func,
  onEnable: PropTypes.func,
  onSetDefault: PropTypes.func,
  isShowAccountSelector: PropTypes.bool,
  hasError: PropTypes.bool,
  hasAgreedDda: PropTypes.bool,
  selectorOnCancel: PropTypes.func,
  selectorOnSubmit: PropTypes.func,
  user: PropTypes.object,
  hostedFieldsEnv: PropTypes.string,
  fingerprint: PropTypes.string,
};
