import PropTypes from 'prop-types';
import React from 'react';

export const PaymentRowAddress = ({ street, suburb }) => (
  <tr>
    <td colSpan={2}>
      <strong>{street}</strong>, {suburb}
    </td>
  </tr>
);

PaymentRowAddress.propTypes = {
  street: PropTypes.string.isRequired,
  suburb: PropTypes.string.isRequired,
};
