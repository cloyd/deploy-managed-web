import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { CustomInput } from 'reactstrap';

import { PaymentBankValue } from '.';
import { httpClient } from '../../utils';
import { CardLight } from '../Card';
import { FormBankAccount, FormCardAccount } from '../Form';

export const PaymentSelector = (props) => {
  const {
    account,
    hasAgreedDda,
    hasError,
    isEnablePromisepay,
    isEnableMtech,
    isLoading,
    isSetup,
    onCancel,
    onChange,
    onEnable,
    onSubmit,
    type,
    types,
    fingerprint,
    hostedFieldsEnv,
  } = props;

  const history = useHistory();

  const hasAccount = useMemo(
    () => account && !!account.promisepayId,
    [account]
  );

  const isType = useMemo(
    () => ({
      account: type === 'account',
      bank: type === 'bank',
      bpay: type === 'bpay',
      card: type === 'card',
      noPaymentAccount: type === 'noDefaultPayment',
      noDefaultBiller: type === 'noDefaultBiller',
    }),
    [type]
  );

  const show = useMemo(() => {
    const account = types.indexOf('account') > -1 && hasAccount;
    const bank = types.indexOf('bank') > -1;
    const bpay = types.indexOf('bpay') > -1;
    const card = types.indexOf('card') > -1;
    const noPaymentAccount = types.indexOf('noDefaultPayment') > -1;
    const noDefaultBiller = types.indexOf('noDefaultBiller') > -1;

    return {
      account,
      bank,
      bpay,
      card,
      noPaymentAccount,
      noDefaultBiller,
      selector: account || bank || card || noDefaultBiller,
    };
  }, [hasAccount, types]);

  // Assembly suggests having separated instances for card and bank forms.
  const hostedFieldsCard = useMemo(
    () =>
      window.assembly.hostedFields({
        environment: hostedFieldsEnv,
      }),
    [hostedFieldsEnv]
  );

  const hostedFieldsBank = useMemo(
    () =>
      window.assembly.hostedFields({
        environment: hostedFieldsEnv,
      }),
    [hostedFieldsEnv]
  );

  const createTokenCard = useCallback(async () => {
    return httpClient
      .get(`/assembly/generate-token/card`, { params: { fingerprint } })
      .then((response) => {
        return response.data;
      });
  }, [fingerprint]);

  const createTokenBank = useCallback(async () => {
    return httpClient
      .get(`/assembly/generate-token/bank`, { params: { fingerprint } })
      .then((response) => {
        return response.data;
      });
  }, [fingerprint]);

  const createCardAccount = useCallback(
    async (token, promisepayUserId) => {
      hostedFieldsCard
        .createCardAccount({
          token: token,
          user_id: promisepayUserId,
        })
        .then((response) => {
          return response;
        });
    },
    [hostedFieldsCard]
  );

  return (
    <div>
      {show.selector && (
        <CardLight className="mb-3" title="Choose a payment method">
          {show.account && (
            <CustomInput
              checked={isSetup ? null : isType.account}
              id="typeAccount"
              label={`Use existing account (${account.accountName})`}
              name="type"
              type="radio"
              value="account"
              onChange={onChange('account')}
            />
          )}
          {show.bank && (
            <CustomInput
              checked={isSetup ? null : isType.bank}
              data-testid="input-typeBank"
              id="typeBank"
              label={
                show.account ? 'Use another bank account' : 'Add bank account'
              }
              name="type"
              type="radio"
              value="bank"
              onChange={onChange('bank')}
            />
          )}
          {show.card && (
            <CustomInput
              checked={isSetup ? null : isType.card}
              data-testid="input-typeCard"
              id="typeCard"
              label="Add credit card"
              name="type"
              type="radio"
              value="card"
              onChange={onChange('card')}
            />
          )}
          {show.bpay && (
            <CustomInput
              checked={isSetup ? null : isType.bpay}
              id="typeBpay"
              label="Direct Payments: BPAY or BSB / Account Number"
              name="type"
              type="radio"
              value="bpay"
              onChange={onChange('bpay')}
            />
          )}
          {show.noPaymentAccount && (
            <CustomInput
              checked={isSetup ? null : isType.noPaymentAccount}
              id="typeNoAccount"
              label="Pay via rent"
              name="type"
              type="radio"
              value="noPaymentAccount"
              onChange={onChange('noDefaultPayment')}
            />
          )}
          {show.noDefaultBiller && (
            <CustomInput
              checked={isSetup ? null : isType.noDefaultBiller}
              id="typeNoAccount"
              label="Pay my own bills"
              name="type"
              type="radio"
              value="noDefaultBiller"
              onChange={onChange('noDefaultBiller')}
            />
          )}
        </CardLight>
      )}
      {isType.account && (
        <PaymentBankValue
          account={account}
          isEditing={isType.account}
          isEnablePromisepay={isEnablePromisepay}
          isEnableMtech={isEnableMtech}
          isSetup={isSetup}
          onEnable={onEnable}
        />
      )}
      {isType.bank && (
        <FormBankAccount
          canReset
          hasAgreed={hasAgreedDda}
          hasError={hasError}
          isLoading={isLoading}
          isSetup={isSetup}
          onCancel={onCancel}
          onSubmit={onSubmit}
          hostedFields={hostedFieldsBank}
          createToken={createTokenBank}
          createCardAccount={createCardAccount}
        />
      )}
      {isType.card && (
        <FormCardAccount
          hasError={hasError}
          isLoading={isLoading}
          onCancel={onCancel}
          onSubmit={onSubmit}
          hostedFields={hostedFieldsCard}
          createToken={createTokenCard}
          createCardAccount={createCardAccount}
          history={history}
        />
      )}
    </div>
  );
};

PaymentSelector.propTypes = {
  account: PropTypes.object,
  hasAgreedDda: PropTypes.bool,
  hasError: PropTypes.bool,
  isEnableMtech: PropTypes.bool,
  isEnablePromisepay: PropTypes.bool,
  isLoading: PropTypes.bool,
  isSetup: PropTypes.bool,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onEnable: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  type: PropTypes.string,
  types: PropTypes.array,
  fingerprint: PropTypes.string,
  hostedFieldsEnv: PropTypes.string,
};

PaymentSelector.defaultProps = {
  account: {},
  hasAgreedDda: false,
  hasError: false,
  isEnableMtech: false,
  isEnablePromisepay: false,
  isLoading: true,
  isSetup: false,
  type: null,
  types: [],
};
