import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, CardBody, CardTitle, Col, Row } from 'reactstrap';

import { ButtonDestroy } from '../Button';
import { CardHeaderLight, CardLight } from '../Card';
import { FormButtons, FormDdaMtech, FormDdaPromisepay } from '../Form';
import { useShowDestroy } from './hooks';

export const PaymentBankValue = (props) => {
  const {
    account,
    isActive,
    isEditing,
    hasDefaultBadge,
    isEnableMtech,
    isEnablePromisepay,
    isSetup,
    onDestroy,
    onEnable,
    onSetDefault,
    title,
  } = props;

  const [showMtechDda, setShowMtechDda] = useState(false);
  const [showDefaultDda, setShowDefaultDda] = useState(false);

  const showDestroy = useShowDestroy({ account, onDestroy });

  const items = useMemo(() => {
    const accountNumber = account.accountNumber
      ? `${account.routingNumber}-${account.accountNumber}`
      : '';

    return account
      ? [
          { id: 1, name: 'Bank', value: account.bankName },
          { id: 2, name: 'Name', value: account.accountName },
          { id: 3, name: 'Acc #', value: accountNumber },
        ]
      : [];
  }, [account]);

  const handleDefault = useCallback(() => {
    const shouldShowMtechDda = isEnableMtech && !account.mtechDdaAt;
    const shouldShowDefaultDda = isEnablePromisepay && !account.promisepayDdaAt;

    if (shouldShowMtechDda || shouldShowDefaultDda) {
      setShowMtechDda(shouldShowMtechDda);
      setShowDefaultDda(shouldShowDefaultDda);
    } else {
      onSetDefault && onSetDefault(account);
    }
  }, [account, isEnableMtech, isEnablePromisepay, onSetDefault]);

  const handleDestroy = useCallback(() => {
    onDestroy(account);
  }, [account, onDestroy]);

  const handleEnable = useCallback(
    (params = {}) => {
      onEnable({ ...params, promisepayId: account.promisepayId });
    },
    [account, onEnable]
  );

  const handleCancel = useCallback(() => {
    setShowMtechDda(false);
    setShowDefaultDda(false);
  }, []);

  useEffect(() => {
    isSetup && handleDefault();
  }, [handleDefault, isSetup]);

  useEffect(() => {
    account.mtechDdaAt && showMtechDda && setShowMtechDda(false);
  }, [account.mtechDdaAt, showMtechDda]);

  useEffect(() => {
    account.promisepayDdaAt && showDefaultDda && setShowDefaultDda(false);
  }, [account.promisepayDdaAt, showDefaultDda]);

  return (
    <CardLight
      className={isEditing && isActive ? 'box-shadow-primary' : ''}
      data-testid="payment-bank-value">
      <CardHeaderLight>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-sm-center">
            <FontAwesomeIcon
              icon={['far', 'university']}
              className="text-primary mr-2"
            />
            <CardTitle className="mb-0" tag="h5">
              {title}
            </CardTitle>
          </div>
          <div className="d-flex align-items-center">
            {(hasDefaultBadge || (isEditing && isActive)) && (
              <Badge color="success">Active</Badge>
            )}
            {isEditing && !isActive && (
              <div className="d-flex align-items-center">
                {!isSetup && (
                  <Button
                    className="p-0"
                    color="link"
                    data-testid="bank-use-account-btn"
                    onClick={handleEnable}>
                    Use this account
                  </Button>
                )}
                {showDestroy && (
                  <ButtonDestroy
                    className="ml-2"
                    data-testid="bank-destroy-account-btn"
                    onClick={handleDestroy}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeaderLight>
      <CardBody>
        {items.map((item) => (
          <Row key={item.id}>
            <Col xs={4} sm={2}>
              <strong>{item.name}:</strong>
            </Col>
            <Col xs={8} sm={10}>
              {item.value}
            </Col>
          </Row>
        ))}
        {(showMtechDda || showDefaultDda) && <hr />}
        {showMtechDda && !isSetup && (
          <FormDdaMtech onSubmit={handleEnable} onCancel={handleCancel} />
        )}
        {showDefaultDda && !isSetup && (
          <FormDdaPromisepay onSubmit={handleEnable} onCancel={handleCancel} />
        )}
        {isSetup &&
          (!showMtechDda || !showDefaultDda || (isEditing && !isActive)) && (
            <FormButtons
              btnSubmit={{ text: 'Save and continue', color: 'primary' }}
              className="justify-content-end"
              onSubmit={handleEnable}
            />
          )}
      </CardBody>
    </CardLight>
  );
};

PaymentBankValue.propTypes = {
  account: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  isEditing: PropTypes.bool,
  hasDefaultBadge: PropTypes.bool,
  isEnablePromisepay: PropTypes.bool,
  isEnableMtech: PropTypes.bool,
  isSetup: PropTypes.bool,
  onDestroy: PropTypes.func,
  onEnable: PropTypes.func,
  onSetDefault: PropTypes.func,
  title: PropTypes.string,
};

PaymentBankValue.defaultProps = {
  isActive: false,
  isEditing: false,
  hasDefaultBadge: false,
  isEnablePromisepay: false,
  isEnableMtech: false,
  isSetup: false,
  title: 'Bank account',
};
