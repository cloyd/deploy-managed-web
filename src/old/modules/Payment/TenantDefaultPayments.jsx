import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Col, Row } from 'reactstrap';

import { PaymentCardIcon } from '.';
import { BankAccountDetails } from './BankAccountDetails';
import { CardAccountDetails } from './CardAccountDetails';

export const TenantDefaultPayments = ({
  isAccountsFetching,
  isAccountsLoading,
  isPayByBpay,
  bankAccounts,
  creditCards,
}) => {
  const [defaultAccount, setDefaultAccount] = useState({
    reimbursement: {},
    payment: {},
  });

  useEffect(() => {
    let reimbursement = {};
    let payment = {};

    if (bankAccounts.length) {
      bankAccounts.forEach(({ isDisbursement, isDefault, ...account }) => {
        if (isDisbursement) {
          reimbursement = account;
        }
        if (isDefault) {
          payment = { accountType: 'bank', ...account };
        }
      });
    }
    if (creditCards.length) {
      creditCards.forEach(({ isDefault, ...account }) => {
        if (isDefault) {
          payment = { accountType: 'card', ...account };
        }
      });
    }

    if (reimbursement || payment) {
      setDefaultAccount({
        reimbursement,
        payment,
      });
    }
  }, [bankAccounts, creditCards]);

  return (
    <div className="p-3 bg-light border-dark">
      <div className="container">
        <Row className="mx-3">
          <Col xs={12} sm={12} md={6} className="px-0 mb-4 mb-md-0">
            <h5 className="mb-3">
              <PaymentCardIcon cardType="card" className="mr-2" />
              Account for paying Rent and Bills:
            </h5>
            {isAccountsLoading ? (
              <PulseLoader color="#dee2e6" />
            ) : isPayByBpay ? (
              <span>Payments are made by you using BPAY or bank transfer</span>
            ) : defaultAccount?.payment?.accountType === 'card' ? (
              <CardAccountDetails {...defaultAccount?.payment} />
            ) : (
              <BankAccountDetails {...defaultAccount?.reimbursement} />
            )}
          </Col>
          <Col xs={12} sm={12} md={6} className="px-0">
            <h5 className="mb-3">
              <PaymentCardIcon cardType="bank" className="mr-2" />
              Account for Withdrawals:
            </h5>
            {isAccountsLoading ? (
              <PulseLoader color="#dee2e6" />
            ) : (
              <BankAccountDetails {...defaultAccount?.reimbursement} />
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

TenantDefaultPayments.propTypes = {
  isAccountsFetching: PropTypes.bool,
  isAccountsLoading: PropTypes.bool,
  isPayByBpay: PropTypes.bool,
  bankAccounts: PropTypes.array,
  creditCards: PropTypes.array,
};
TenantDefaultPayments.defaultProps = {
  isAccountsFetching: false,
  isAccountsLoading: false,
  isPayByBpay: false,
  bankAccounts: [],
  creditCards: [],
};
