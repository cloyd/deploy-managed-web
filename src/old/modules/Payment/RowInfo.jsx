import PropTypes from 'prop-types';
import React from 'react';

import { PaymentInfo } from '.';

export const PaymentRowInfo = ({ intention }) => (
  <tr>
    <td>
      <PaymentInfo intention={intention} />
    </td>
    <td className="text-right">
      <strong>{intention.formatted?.debtor?.total}</strong>
    </td>
  </tr>
);

PaymentRowInfo.propTypes = {
  intention: PropTypes.object,
};
