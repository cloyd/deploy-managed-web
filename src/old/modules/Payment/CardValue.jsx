import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Badge, Button, CardBody, CardTitle, Col, Row } from 'reactstrap';

import { PaymentCardIcon } from '.';
import { ButtonDestroy } from '../Button';
import { CardHeaderLight, CardLight } from '../Card';
import { useShowDestroy } from './hooks';

export const PaymentCardValue = ({
  account,
  isActive,
  isEditing,
  hasDefaultBadge,
  onSetDefault,
  onDestroy,
  onRemoveHash,
}) => {
  const showDestroy = useShowDestroy({ account, onDestroy });

  const handleDefault = useCallback(() => {
    onSetDefault && onSetDefault(account);
    onRemoveHash();
  }, [account, onRemoveHash, onSetDefault]);

  const handleDestroy = useCallback(() => {
    onDestroy && onDestroy(account);
  }, [account, onDestroy]);

  return (
    <CardLight
      className={isEditing && isActive ? 'box-shadow-primary' : ''}
      data-testid="payment-card-value">
      <CardHeaderLight>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-end w-50">
            <PaymentCardIcon cardType={account.type} className="mr-2" />
            <CardTitle className="mb-0" tag="h5">
              Credit card
            </CardTitle>
          </div>
          <div className="d-flex align-items-center">
            {(hasDefaultBadge || (isEditing && isActive)) && (
              <Badge color="success" style={{ paddingBottom: '0.3rem' }}>
                Active
              </Badge>
            )}
            {isEditing && !isActive && (
              <div className="d-flex align-items-center">
                <Button
                  data-testid="card-use-account-btn"
                  className="p-0"
                  color="link"
                  onClick={handleDefault}>
                  Use this card
                </Button>
                {showDestroy && (
                  <ButtonDestroy
                    data-testid="card-destroy-account-btn"
                    className="ml-2"
                    onClick={handleDestroy}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeaderLight>
      <CardBody>
        <Row>
          <Col xs={4} sm={2} className="pr-2">
            <strong>Number:</strong>
          </Col>
          <Col xs={8} sm={10} className="pl-2">
            {account.number}
          </Col>
        </Row>
      </CardBody>
    </CardLight>
  );
};

PaymentCardValue.defaultProps = {
  isActive: false,
  isEditing: false,
  hasDefaultBadge: false,
};

PaymentCardValue.propTypes = {
  account: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  isEditing: PropTypes.bool,
  hasDefaultBadge: PropTypes.bool,
  onSetDefault: PropTypes.func,
  onDestroy: PropTypes.func,
  onRemoveHash: PropTypes.func,
};
