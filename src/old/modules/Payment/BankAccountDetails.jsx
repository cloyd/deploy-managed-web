import PropTypes from 'prop-types';
import React from 'react';

export const BankAccountDetails = ({
  bankName,
  accountName,
  routingNumber,
  accountNumber,
}) => (
  <>
    {bankName?.length ? (
      <>
        <span>
          <strong>Bank:</strong> {bankName}
        </span>
        <br />
        <span>
          <strong>Name:</strong> {accountName}
        </span>
        <br />
        <span>
          <strong>Acc #:</strong>
          {`${routingNumber ? `${routingNumber}-` : ''}${accountNumber}`}
        </span>
      </>
    ) : (
      <span>No account set for Withdrawals</span>
    )}
  </>
);

BankAccountDetails.propTypes = {
  bankName: PropTypes.string,
  accountName: PropTypes.string,
  routingNumber: PropTypes.string,
  accountNumber: PropTypes.string,
};

BankAccountDetails.defaultProps = {
  bankName: '',
  accountName: '',
  routingNumber: '',
  accountNumber: '',
};
