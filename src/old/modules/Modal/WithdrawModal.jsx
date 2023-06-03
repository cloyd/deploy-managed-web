import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { centsToDollar, toDollarAmount } from '../../utils';
import { FormLabelInput } from '../Form';
import { Link } from '../Link';
import { PaymentCardIcon } from '../Payment';
import { QUERY_KEYS } from '../Payment/hooks/use-assembly';
import SmsVerification from '../SmsVerification/';

const MIN_WITHDRAW_VALUE = 1;
const EXPONENT_KEY_CODE = 69;
const MINUS_KEY_CODE = 187;
const ADD_KEY_CODE = 189;

export const WithdrawModal = ({
  isOpen,
  toggleResetModal,
  onConfirmWithdrawal,
  onConfirmIdentity,
  ...props
}) => {
  const renderModalContent = () => {
    if (isOpen.confirmWithdrawal) {
      return <ConfirmAmountModal onConfirm={onConfirmWithdrawal} {...props} />;
    } else if (isOpen.indicateAmount) {
      return <IndicateAmount toggleModal={toggleResetModal} {...props} />;
    }
  };

  return (
    <Modal
      isOpen={isOpen.indicateAmount}
      toggle={toggleResetModal}
      unmountOnClose
      centered>
      {renderModalContent()}
      {isOpen.smsVerification && (
        <SmsVerification
          modalState={{
            isOpen: isOpen.smsVerification,
            callback: onConfirmIdentity,
          }}
          toggle={toggleResetModal}
        />
      )}
    </Modal>
  );
};

WithdrawModal.propTypes = {
  // generic modal props
  isOpen: PropTypes.shape({
    selectBank: PropTypes.bool,
    indicateAmount: PropTypes.bool,
    onConfirmWithdrawal: PropTypes.bool,
    smsVerification: PropTypes.bool,
  }),
  toggleResetModal: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  // amount modal props
  billsToPayAmount: PropTypes.number,
  // confirm withdrawal modal props
  onConfirmWithdrawal: PropTypes.func.isRequired,
  bankAccountId: PropTypes.string,
  amountCents: PropTypes.number,
  onConfirmAmount: PropTypes.func.isRequired,
  // 2fa modal props
  onConfirmIdentity: PropTypes.func.isRequired,
};

WithdrawModal.defaultProps = {
  isOpen: {
    selectBank: false,
    indicateAmount: false,
    onConfirmWithdrawal: false,
    smsVerification: false,
  },
  isLoading: false,
  amountCents: 0,
};

const IndicateAmount = ({
  onConfirmAmount,
  amountCents,
  isLoading,
  bankAccountId,
  toggleModal,
}) => {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const bankDetails = queryClient
    .getQueryData([QUERY_KEYS.FETCH_ACCOUNTS])
    .bank.filter(({ id }) => id.toString() === bankAccountId);

  const handleChange = useCallback(
    ({ target }) => {
      const { value } = target;

      if (value < MIN_WITHDRAW_VALUE) {
        setError('Withdrawals are currently set to $1 minimum.');
      } else if (value > toDollarAmount(amountCents)) {
        setError('Insufficient wallet balance.');
      } else {
        setError('');
      }

      // remove leading 0 when adding numbers
      setAmount(Number(value).toString());
    },
    [amountCents]
  );

  const verifyAmount = (amount) => {
    onConfirmAmount({ amount });
  };

  return (
    <>
      <ModalHeader>Withdraw</ModalHeader>
      <ModalBody>
        <FormLabelInput
          data-testid="withdraw-to-wallet-amount"
          label="Amount"
          name="withdrawAmount"
          type="number"
          prepend="$"
          value={amount}
          handleChange={handleChange}
          // prevent E (for exponent), +/- inputs
          // eslint-disable-next-line react/jsx-no-bind
          onKeyDown={(event) => {
            if (
              [EXPONENT_KEY_CODE, MINUS_KEY_CODE, ADD_KEY_CODE].includes(
                event.keyCode
              )
            )
              event.preventDefault();
          }}
          error={error}
          isTouched
        />
        <small className="d-block pt-2">
          Available Balance: {centsToDollar(amountCents)}
        </small>
        <div>
          <h6 className="my-2 ml-1">To</h6>
          <span>
            <PaymentCardIcon cardType="bank" className="mr-2" />
            {bankDetails[0].bankName}
          </span>
          <br />
          <small>{bankDetails[0].accountName}</small>
          <br />
          <small>
            {bankDetails[0].accountNumber
              ? `${bankDetails[0].routingNumber}-${bankDetails[0].accountNumber}`
              : ''}
          </small>
        </div>
      </ModalBody>
      <ModalFooter className="d-flex">
        <Button
          date-testid="cancel-withdraw-wallet"
          color="secondary"
          onClick={toggleModal}
          disabled={isLoading}>
          Cancel
        </Button>
        <Button
          data-testid="verify-withdraw-wallet"
          color="primary"
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => verifyAmount(amount)}
          disabled={!!error || amount === '' || isLoading}>
          Confirm
        </Button>
      </ModalFooter>
    </>
  );
};

IndicateAmount.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  bankAccountId: PropTypes.string,
  amountCents: PropTypes.number,
  onConfirmAmount: PropTypes.func.isRequired,
};
IndicateAmount.defaultProps = {};

const ConfirmAmountModal = ({ onConfirm, billsToPayAmount }) => (
  <>
    <ModalHeader>Are you sure?</ModalHeader>
    <ModalBody>
      <small>
        There are currently bills to be paid with the total amount of&nbsp;
        <strong>{centsToDollar(billsToPayAmount)}</strong>.
      </small>
      <br />
      <br />
      <small>
        Proceeding with this withdrawal will leave too little funds to pay
        upcoming bills.
      </small>
      <br />
      <br />
    </ModalBody>
    <ModalFooter className="d-flex justify-content-between">
      <Link data-testid="pay-bills-first" to="/payments" color="danger">
        Pay Bills First
      </Link>
      <Button
        data-testid="confirm-withdraw-wallet"
        color="primary"
        onClick={onConfirm}>
        Proceed
      </Button>
    </ModalFooter>
  </>
);

ConfirmAmountModal.propTypes = {
  isOpen: PropTypes.bool,
  billsToPayAmount: PropTypes.number,
  onConfirm: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

ConfirmAmountModal.defaultProps = {
  isOpen: false,
  billsToPayAmount: 0,
};
