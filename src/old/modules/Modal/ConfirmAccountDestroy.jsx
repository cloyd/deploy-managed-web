import PropTypes from 'prop-types';
import React from 'react';

import { ModalConfirm } from '.';

export const ModalConfirmAccountDestroy = ({ account, children, ...props }) => (
  <ModalConfirm
    data-testid="modal-confirm-destroy"
    btnCancel={{ text: 'Cancel' }}
    btnSubmit={{ text: 'Remove', color: 'danger' }}
    title="Confirm details"
    {...props}>
    <p>
      Are you sure you would like to remove the following{' '}
      {account && account.routingNumber ? 'bank account' : 'card'}? It will be
      removed from all of your properties.
    </p>
    {account?.routingNumber ? (
      <p>
        <strong>Bank: </strong> {account.bankName}
        <br />
        <strong>Acc Name: </strong> {account.accountName}
        <br />
        <strong>Acc Number:</strong> {account.routingNumber}-
        {account.accountNumber}
      </p>
    ) : account?.number ? (
      <p>
        <strong>Name: </strong> {account.fullName}
        <br />
        <strong>Card number: </strong> {account.number}
      </p>
    ) : (
      <p>Error: invalid account details</p>
    )}
    {children}
  </ModalConfirm>
);

ModalConfirmAccountDestroy.propTypes = {
  account: PropTypes.object,
  body: PropTypes.string,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  size: PropTypes.string,
  title: PropTypes.string,
};

ModalConfirmAccountDestroy.defaultProps = {
  account: {},
  isOpen: false,
};
