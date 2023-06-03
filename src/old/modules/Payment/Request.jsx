import PropTypes from 'prop-types';
import React from 'react';
import { Badge, Card, CardBody, Col, Row } from 'reactstrap';

import {
  PaymentInfo,
  PaymentNumerator,
  PaymentStatus,
  PaymentTransactionButton,
} from '.';
import { isInPast } from '../../utils';
import { PropertyAddressLink } from '../Property';
import './style.scss';

export const PaymentRequest = ({
  className,
  hasLink,
  intention,
  isDebtor,
  isLast,
  property,
  onClick,
  ...props
}) => {
  const {
    dueDate,
    formatted,
    isComplete,
    isRefund,
    isExpiredLease,
    isOverdue,
    paidAt,
  } = intention;
  const data = isDebtor ? formatted.debtor : formatted.creditor;

  return (
    <Card className={`border-0 payments-custom-card ${className}`} {...props}>
      <CardBody className="px-3 py-2">
        <Row className="align-items-center">
          <Col xs={8} lg={9}>
            <Row className="payments-custom-column-info">
              <Col lg={7} className="d-flex align-items-center">
                <PaymentInfo intention={intention} />
              </Col>
              <Col lg={2} className="d-flex align-items-center pt-2">
                {property && (
                  <PropertyAddressLink
                    hasLink={hasLink}
                    isExpiredLease={isExpiredLease}
                    property={property}
                  />
                )}
              </Col>
              <Col lg={2} className="d-flex pt-2 align-items-center">
                <DateColumn
                  paidAt={paidAt}
                  formatted={formatted}
                  dueDate={dueDate}
                  isComplete={isComplete}
                  isOverdue={isOverdue}
                />
              </Col>
              <Col lg={1} className="d-flex pt-2 align-items-center">
                <PaymentStatus intention={intention} />
              </Col>
            </Row>
          </Col>
          <Col xs={4} lg={3} className="d-flex align-items-center px-0">
            <Row className="text-right w-100 payments-custom-column-pay">
              <Col lg={7} className="py-1 text-nowrap px-0">
                <PaymentNumerator numerator={isDebtor ? '-' : '+'} />
                <strong>
                  {isComplete || isDebtor || isRefund
                    ? data.total
                    : data.amount}
                </strong>
              </Col>
              <Col lg={5} className="px-0">
                {property && (
                  <PaymentTransactionButton
                    className="text-right"
                    intention={intention}
                    isLast={false}
                    property={property}
                    onClick={onClick}
                    amount={formatted?.debtor?.totalAmountCents}
                  />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

const DateColumn = ({ paidAt, formatted, dueDate, isComplete, isOverdue }) => {
  if (paidAt) {
    return (
      <div className="text-success">
        <small>Paid date: </small>
        <br className="d-none d-md-block" />
        <small>{formatted.dates.paidAt}</small>
      </div>
    );
  } else if (dueDate) {
    if (!isComplete && isOverdue) {
      return (
        <Badge color="danger" className="p-1 mr-1 normal-line-wrap">
          Overdue
        </Badge>
      );
    } else {
      return (
        <div
          className={
            !isComplete && isInPast(dueDate) ? 'text-danger' : 'text-muted'
          }>
          <small>Due date: </small>
          <br className="d-none d-md-block" />
          <small>{formatted.dates.due}</small>
        </div>
      );
    }
  } else {
    return null;
  }
};

PaymentRequest.propTypes = {
  className: PropTypes.string,
  hasLink: PropTypes.bool,
  intention: PropTypes.object.isRequired,
  isDebtor: PropTypes.bool,
  isLast: PropTypes.bool,
  property: PropTypes.object,
  onClick: PropTypes.func,
};

PaymentRequest.defaultProps = {
  isLast: false,
};
