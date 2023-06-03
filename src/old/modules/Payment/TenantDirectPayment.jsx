import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Alert, Button, CardBody, Col, Row } from 'reactstrap';

import {
  PaymentBpayIcon,
  PaymentBpayValue,
  PaymentVirtualAccountIcon,
  PaymentVirtualAccountValue,
} from '.';
import { createVirtualAccount } from '../../redux/users';
import { CardLight } from '../Card';
import { Switch } from '../Form';

export const TenantDirectPayment = ({
  className,
  isAccountsLoading,
  userId,
  isPayByBpay,
  bpayDetails,
  directPaymentDetails,
  onTogglePayByBpay,
}) => {
  const dispatch = useDispatch();
  const { virtualAccount, canGenerateVirtualAccount } = directPaymentDetails;

  const handleGenerateVirtualAccount = useCallback(() => {
    dispatch(createVirtualAccount({ tenantId: userId }));
  }, [dispatch, userId]);

  return (
    <div
      className={`${className} mt-3 mb-5`}
      data-testid="other-payment-settings-card">
      <h4
        className="mb-3"
        data-testid="other-payment-settings-card-section-heading">
        Other Payment Settings
      </h4>
      {isAccountsLoading ? (
        <CardLight className="mb-3">
          <CardBody className="d-flex flex-column justify-content-center align-items-center h-100 w-100">
            <PulseLoader color="#dee2e6" />
          </CardBody>
        </CardLight>
      ) : (
        <>
          <header className="d-flex align-items-center justify-content-between">
            <h6>I would like to make my own payments</h6>
            <Switch
              id="use-bpay-as-payment"
              className="custom-switch-md"
              value={isPayByBpay}
              disabled={isPayByBpay}
              handleChange={onTogglePayByBpay}
            />
          </header>
          <Alert className="mt-3" color="warning" fade={false}>
            Note: Select this to make your own payments. To top up your wallet,
            make a bank or BPAY transfer using the details below. Managed will
            not charge any of your payment methods directly, once enabled.
          </Alert>
          {isPayByBpay && (
            <>
              <CardLight className="my-3">
                <CardBody>
                  <Row>
                    <Col xs={12} sm={6} className="mb-3 mb-sm-0">
                      <PaymentBpayIcon>
                        <PaymentBpayValue
                          bpayBillerCode={bpayDetails?.bpayBillerCode}
                          bpayReference={bpayDetails?.bpayReference}
                        />
                      </PaymentBpayIcon>
                    </Col>
                    <Col xs={12} sm={6}>
                      {(virtualAccount || canGenerateVirtualAccount) && (
                        <PaymentVirtualAccountIcon
                          className={
                            !virtualAccount?.status ? 'text-center' : ''
                          }
                          title={
                            virtualAccount?.status
                              ? 'Bank Transfer'
                              : 'Bank Transfer to a unique BSB and Account Number'
                          }
                          virtualAccountStatus={virtualAccount?.status}>
                          {canGenerateVirtualAccount ? (
                            <Button
                              color="primary"
                              onClick={handleGenerateVirtualAccount}>
                              Generate Details
                            </Button>
                          ) : (
                            <PaymentVirtualAccountValue
                              virtualAccountBsb={virtualAccount?.routingNumber}
                              virtualAccountNumber={
                                virtualAccount?.accountNumber
                              }
                              virtualAccountStatus={
                                virtualAccount?.virtualAccountStatus
                              }
                            />
                          )}
                        </PaymentVirtualAccountIcon>
                      )}
                    </Col>
                  </Row>
                </CardBody>
              </CardLight>
            </>
          )}
        </>
      )}
    </div>
  );
};

TenantDirectPayment.propTypes = {
  className: PropTypes.string,
  userId: PropTypes.number,
  isAccountsFetching: PropTypes.bool,
  isAccountsLoading: PropTypes.bool,
  isPayByBpay: PropTypes.bool,
  onTogglePayByBpay: PropTypes.func.isRequired,
  // props for showing bpay and bank transfer information
  bpayDetails: PropTypes.shape({
    bpayBillerCode: PropTypes.string,
    bpayReference: PropTypes.string,
  }),
  directPaymentDetails: PropTypes.shape({
    virtualAccount: PropTypes.object,
    canCreateVirtualAccount: PropTypes.bool,
  }),
};
TenantDirectPayment.defaultProps = {
  className: '',
  userId: 0,
  isAccountsFetching: false,
  isAccountsLoading: false,
  isPayByBpay: false,
  bpayDetails: {
    bpayBillerCode: '',
    bpayReference: '',
  },
  directPaymentDetails: {
    virtualAccount: null,
    canCreateVirtualAccount: false,
  },
};
