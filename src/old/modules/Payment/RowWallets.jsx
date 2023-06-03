import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import {
  Label,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from 'reactstrap';

import { FormFieldRadio } from '../Form';

export const PaymentRowWallets = ({ wallets, onChange }) => {
  const [value, setValue] = useState(0);

  const handleChange = useCallback(
    (e) => {
      const walletId = Number(e.currentTarget.value);
      setValue(walletId);
      onChange(walletId);
    },
    [onChange, setValue]
  );

  return (
    <ListGroup>
      {wallets.map((wallet) => (
        <ListGroupItem key={`wallet-${wallet.id}`}>
          <Label className="d-flex" for={`wallet-${wallet.id}`}>
            <FormFieldRadio
              className="p-0"
              id={`wallet-${wallet.id}`}
              name={`wallet-${wallet.id}`}
              isChecked={value === wallet.id}
              value={`${wallet.id}`}
              onChange={handleChange}
            />
            <div className="ml-2 w-100">
              <ListGroupItemHeading>{wallet.name}</ListGroupItemHeading>
              <ListGroupItemText className="d-flex justify-content-between text-muted mb-0">
                {wallet.description && <span>{wallet.description}</span>}
                <span>{wallet.formattedFees}</span>
              </ListGroupItemText>
            </div>
          </Label>
        </ListGroupItem>
      ))}
    </ListGroup>
  );
};

PaymentRowWallets.propTypes = {
  wallets: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};
