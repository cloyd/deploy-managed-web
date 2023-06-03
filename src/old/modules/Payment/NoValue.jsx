import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Badge, Button, CardBody, CardTitle, Col, Row } from 'reactstrap';

import { CardHeaderLight, CardLight } from '../Card';

export const PaymentNoValue = ({
  children,
  isActive,
  isEditing,
  onSetDefault,
  titleText,
  accountType,
  isDirectPayments,
}) => {
  const handleDefault = useCallback(
    () => onSetDefault(accountType)(),
    [accountType, onSetDefault]
  );

  return (
    <CardLight className={isEditing && isActive ? 'box-shadow-primary' : ''}>
      <CardHeaderLight>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-end w-50">
            <FontAwesomeIcon
              icon={['fas', 'money-check']}
              className="text-primary mr-2"
            />
            <CardTitle className="mb-0" tag="h5">
              {titleText} {isActive}
            </CardTitle>
          </div>
          {isEditing && (
            <div className="d-flex align-items-center">
              {isActive ? (
                <Badge color="success">Active</Badge>
              ) : onSetDefault ? (
                <div className="d-flex align-items-center">
                  <Button className="p-0" color="link" onClick={handleDefault}>
                    Use this option
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </CardHeaderLight>
      <CardBody>
        {isDirectPayments ? (
          children
        ) : (
          <Row>
            <Col xs={12}>{children}</Col>
          </Row>
        )}
      </CardBody>
    </CardLight>
  );
};

PaymentNoValue.defaultProps = {
  isActive: false,
  isEditing: false,
  titleText: '',
  isDirectPayments: false,
};

PaymentNoValue.propTypes = {
  children: PropTypes.node,
  isActive: PropTypes.bool,
  isEditing: PropTypes.bool,
  onSetDefault: PropTypes.func,
  titleText: PropTypes.string,
  accountType: PropTypes.string.isRequired,
  isDirectPayments: PropTypes.bool,
};
