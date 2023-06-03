import PropTypes from 'prop-types';
import React from 'react';

import { ModalConfirm } from '.';

export const ModalConfirmAccount = ({ account, children, ...props }) => (
  <ModalConfirm
    btnCancel={{ text: 'Cancel' }}
    btnSubmit={{ text: 'Confirm' }}
    data-testid="modal-confirm-account"
    title="Confirm details"
    {...props}>
    <p>Please confirm the account details you entered are correct:</p>
    {account?.routingNumber ? (
      <p>
        <strong>Bank: </strong> {account.bankName}
        <br />
        <strong>Acc Name: </strong> {account.accountName}
        <br />
        <strong>Acc Number:</strong> {account.routingNumber}-
        {account.accountNumber}
        <br />
        <strong>Acc Type: </strong>{' '}
        <span className="text-capitalize">{account.accountType}</span>
        <br />
        <strong>Holder Type: </strong>{' '}
        <span className="text-capitalize">{account.holderType}</span>
      </p>
    ) : account?.number ? (
      <p>
        <strong>Name: </strong> {account.fullName}
        <br />
        <strong>Card number: </strong> {account.number}
        <br />
        <strong>Expiry: </strong> {account.expiryMonth}/{account.expiryYear}
        <br />
        <strong>CVV: </strong> {account.cvv}
        <br />
      </p>
    ) : (
      <p>Error: invalid account details</p>
    )}
    <small>
      A payment reversal will incur a transaction fee if caused by incorrect
      banking account.
    </small>
    {children}
  </ModalConfirm>
);

ModalConfirmAccount.propTypes = {
  account: PropTypes.object,
  body: PropTypes.string,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  size: PropTypes.string,
  title: PropTypes.string,
};

ModalConfirmAccount.defaultProps = {
  account: {},
  isOpen: false,
};
