// TODO: This is a future refactor which is currently only used by ContactsCreditor.
// TODO: Add this to PaymentSettings and update PaymentDefault & PaymentBiller.
// TODO: Look into merging PaymentAccounts into PaymentSelector
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert } from 'reactstrap';

import { PaymentAccounts, PaymentSelector } from '.';

export class PaymentDisbursementV2 extends Component {
  static propTypes = {
    account: PropTypes.object,
    accountDefault: PropTypes.object,
    accounts: PropTypes.array,
    canEdit: PropTypes.bool,
    hasError: PropTypes.bool,
    isLoading: PropTypes.bool,
    isOwner: PropTypes.bool,
    onDestroy: PropTypes.func.isRequired,
    onSetDefault: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    hostedFieldsEnv: PropTypes.string,
  };

  static defaultProps = {
    account: {},
    accounts: [],
    canEdit: true,
    hasError: false,
    isOwner: false,
    isLoading: true,
  };

  state = {
    isEditing: false,
    type: 'bank',
    types: [],
  };

  handleChangeType = (type) => {
    // this.setState((state) => ({ ...state, type }));
  };

  handleToggleEditing = () => {
    this.setState((state) => ({ ...state, isEditing: !state.isEditing }));
  };

  render() {
    const { isEditing, type, types } = this.state;

    const {
      account,
      accountDefault,
      accounts,
      canEdit,
      hasError,
      isLoading,
      isOwner,
      onDestroy,
      onSetDefault,
      onSubmit,
      hostedFieldsEnv,
      ...props
    } = this.props;

    const hasAccount = account && !!account.promisepayId;

    return (
      <div {...props} data-testid="payment-disbursement">
        <h4 className="mb-3">
          {isOwner
            ? 'Where would you like rental payments deposited?'
            : 'Where would you like payments deposited?'}
        </h4>
        {isOwner && (
          <Alert color="warning" fade={false}>
            We recommend your offset account as our instant payments will reduce
            your home loan interest.
          </Alert>
        )}
        {hasAccount && (
          <PaymentAccounts
            account={account}
            accounts={accounts}
            isEditing={isEditing}
            onChange={canEdit ? this.handleToggleEditing : null}
            onDestroy={onDestroy}
            onEnable={onSetDefault}
            onSetDefault={onSetDefault}
          />
        )}
        {(!hasAccount || isEditing) && (
          <PaymentSelector
            account={accountDefault}
            hasError={hasError}
            isLoading={isLoading}
            isSetup={true} // Need to change isSetup to hasAccount // Needs to be true for external creditor so that we hide the DDA checkbox
            type={accountDefault ? 'account' : type}
            types={accountDefault ? ['bank', 'account'] : types}
            onChange={this.handleChangeType}
            onCancel={hasAccount ? this.handleToggleEditing : null}
            onSubmit={onSubmit}
            hostedFieldsEnv={hostedFieldsEnv}
          />
        )}
      </div>
    );
  }
}
