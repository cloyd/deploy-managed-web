import PropTypes from 'prop-types';
import React from 'react';
import { Input, Label } from 'reactstrap';

import { CardLight } from '../Card';

export const PaymentDda = ({ isChecked, onChange, ...props }) => (
  <CardLight data-testid="payment-dda-card" title="Agreement" {...props}>
    <div className="custom-checkbox custom-control">
      <Input
        className="custom-control-input"
        data-testid="input-dda-agreement"
        defaultChecked={isChecked}
        id="agreement"
        name="agreement"
        type="checkbox"
        onChange={onChange}
      />
      <Label className="custom-control-label mb-2" htmlFor="agreement">
        Accept platform{' '}
        <a
          href="/dda-agreement"
          className="btn-link"
          target="_blank"
          rel="noopener noreferrer">
          terms of use and authorities
        </a>
        .
      </Label>
    </div>
  </CardLight>
);

PaymentDda.defaultProps = {
  isChecked: false,
  onChange: null,
};

PaymentDda.propTypes = {
  isChecked: PropTypes.bool,
  onChange: PropTypes.func,
};
