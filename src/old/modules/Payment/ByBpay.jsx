import PropTypes from 'prop-types';
import React from 'react';
import { Alert, Table } from 'reactstrap';

import {
  PaymentBpayIcon,
  PaymentBpayValue,
  PaymentRowAddress,
  PaymentRowInfo,
} from '.';

export const PaymentByBpay = (props) => {
  const { address, intention } = props;

  return (
    <div>
      <Alert color="warning" fade={false} isOpen>
        Please use your internet banking to pay this bill.
      </Alert>
      <Table className="mb-0">
        <tbody>
          <PaymentRowAddress {...address} />
          <PaymentRowInfo intention={intention} />
          <tr>
            <td colSpan="2">
              <PaymentBpayIcon>
                <PaymentBpayValue
                  bpayBillerCode={intention.lease.primaryTenant.bpayBillerCode}
                  bpayReference={intention.lease.primaryTenant.bpayReference}
                />
              </PaymentBpayIcon>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

PaymentByBpay.propTypes = {
  address: PropTypes.object.isRequired,
  intention: PropTypes.object.isRequired,
};
