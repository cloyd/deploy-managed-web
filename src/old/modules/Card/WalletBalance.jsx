import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardBody, FormText } from 'reactstrap';

import { centsToDollar } from '../../utils';
import { ButtonIcon } from '../Button';

export const CardWalletBalance = ({
  amountCents,
  isOwner,
  isPrincipal,
  isTenant,
  isLoading,
  toggle,
  isAuthyEnabled,
}) => {
  return (
    <Card className="mb-3" data-testid="card-wallet-balance">
      <CardBody className="d-flex flex-column">
        <div
          className={`d-flex justify-content-between ${
            isTenant ? 'h4' : 'h5'
          }-font-size flex-column flex-sm-row`}>
          <span>
            {isOwner || isPrincipal
              ? 'Funds waiting to be disbursed:'
              : 'Wallet balance:'}
          </span>
          <span data-testid="card-wallet-balance-amount">
            {centsToDollar(amountCents)}
          </span>
        </div>
        {isTenant && (
          <>
            <ButtonIcon
              data-testid="withdraw-to-bank"
              buttonColor="secondary"
              className="mt-4 align-self-start align-self-sm-end"
              disabled={isLoading || !isAuthyEnabled}
              icon={['far', 'money-bill-transfer']}
              onClick={toggle}>
              Withdraw to Bank
            </ButtonIcon>
            {!isAuthyEnabled && (
              <FormText className="text-left text-sm-right">
                <FontAwesomeIcon icon={['far', 'lock']} /> Enable two-factor
                authentication to be able to withdraw to bank
              </FormText>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};

CardWalletBalance.propTypes = {
  amountCents: PropTypes.number,
  toggle: PropTypes.func,
  isOwner: PropTypes.bool,
  isPrincipal: PropTypes.bool,
  isTenant: PropTypes.bool,
  isLoading: PropTypes.bool,
  isAuthyEnabled: PropTypes.bool,
};

CardWalletBalance.defaultProps = {
  amountCents: 0,
  toggle: null,
  isOwner: false,
  isPrincipal: false,
  isTenant: false,
  isLoading: false,
  isAuthyEnabled: false,
};
