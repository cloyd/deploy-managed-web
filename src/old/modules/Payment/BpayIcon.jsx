import PropTypes from 'prop-types';
import React from 'react';

import bpayImg from '../../assets/bpay.svg';

export const PaymentBpayIcon = (props) => {
  return (
    <div className="d-flex">
      <img src={bpayImg} height="60px" />
      <div className="ml-2">
        <strong>Paying via BPAY</strong>
        {props.children}
      </div>
    </div>
  );
};

PaymentBpayIcon.propTypes = {
  children: PropTypes.node,
};
