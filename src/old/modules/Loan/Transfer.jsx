import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Form,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';

import { useLoanTransfer, useLoansEndpoint } from '.';
import { ButtonTransfer } from '../../modules/Button';
import { showSuccess } from '../../redux/notifier';
import { centsToDollar } from '../../utils';
import { FormButtons, FormFieldRadio } from '../Form';

export const LoanTransfer = ({ loan, property }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('wallet_transfer');
  const dispatch = useDispatch();
  const history = useHistory();

  const combinedBalance = useMemo(() => {
    const total =
      loan && property
        ? loan.walletBalanceCents + property.floatBalanceAmountCents
        : 0;

    return centsToDollar(total);
  }, [loan, property]);

  const options = useMemo(() => {
    return [
      {
        name: 'wallet_transfer',
        title: 'To Property Wallet',
        description: `Balance after transfer: ${combinedBalance}`,
      },
      {
        name: 'discharge',
        title: 'To Property Owner(s)',
        description: 'Bank transfers usually take 1-2 business days',
      },
    ];
  }, [combinedBalance]);

  const handleToggle = useCallback(() => {
    setIsOpen((state) => !state);
  }, [setIsOpen]);

  const handleChange = useCallback(
    (e) => {
      setValue(e.currentTarget.value);
    },
    [setValue]
  );

  const endpoint = useLoansEndpoint(property, loan, value);

  const handleSubmit = useLoanTransfer(endpoint, (success) => {
    if (success) {
      dispatch(showSuccess('Funds have been successfully transferred'));
      history.push(`${window.location.pathname}?refresh=${Date.now()}`);
    }

    setIsOpen(false);
  });

  return loan.walletBalanceCents > 0 ? (
    <div className="mt-2">
      <ButtonTransfer onClick={handleToggle} data-testid="btn-transfer">
        Transfer funds
      </ButtonTransfer>
      <Modal
        data-testid="modal"
        isOpen={isOpen}
        toggle={handleToggle}
        contentClassName="border-0"
        centered>
        <ModalHeader toggle={handleToggle}>
          <span className="h3 text-primary">Transfer Funds</span>
        </ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column mb-3" data-testid="balance">
            <strong>From {loan.name}</strong>
            <small className="text-muted">
              Available balance {centsToDollar(loan.walletBalanceCents)}
            </small>
          </div>
          <Form onSubmit={handleSubmit}>
            <ListGroup className="mb-3">
              {options.map((option, i) => (
                <ListGroupItem
                  key={`value-${i}`}
                  className="d-flex pl-3"
                  data-testid={option.name}>
                  <FormFieldRadio
                    id={option.name}
                    name="transferTo"
                    value={option.name}
                    className="p-0"
                    isChecked={option.name === value}
                    onChange={handleChange}
                  />
                  <div className="d-flex flex-column ml-1 w-100">
                    <strong>{option.title}</strong>
                    <small className="text-muted">{option.description}</small>
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
            <FormButtons
              onSubmit={handleSubmit}
              onCancel={handleToggle}
              btnSubmit={{ size: 'lg', text: 'Transfer now' }}
              btnCancel={{ size: 'lg' }}
            />
          </Form>
        </ModalBody>
      </Modal>
    </div>
  ) : null;
};

LoanTransfer.propTypes = {
  loan: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
};
