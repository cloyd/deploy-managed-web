import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import { centsToDollar, formatDate } from '../../utils';

export const LoanTransaction = ({
  balance,
  credit,
  date,
  description,
  debit,
  style,
}) => {
  return style === 'header' ? (
    <Row className="m-0">
      <Col xs="2" className="py-3 border-top font-weight-bold">
        Date
      </Col>
      <Col className="py-3 border-top font-weight-bold">Description</Col>
      <Col xs="1" className="py-3 border-top font-weight-bold">
        Debit
      </Col>
      <Col xs="1" className="py-3 border-top font-weight-bold">
        Credit
      </Col>
      <Col xs="1" className="py-3 border-top font-weight-bold">
        Balance
      </Col>
    </Row>
  ) : (
    <Row className="m-0">
      <Col xs="2" className="py-3 border-top">
        {formatDate(date)}
      </Col>
      <Col className="py-3 border-top">{description}</Col>
      <Col xs="1" className="py-3 border-top">
        {centsToDollar(debit)}
      </Col>
      <Col xs="1" className="py-3 border-top">
        {credit && centsToDollar(credit)}
      </Col>
      <Col xs="1" className="py-3 border-top">
        {centsToDollar(balance)}
      </Col>
    </Row>
  );
};

LoanTransaction.propTypes = {
  balance: PropTypes.number,
  date: PropTypes.number,
  description: PropTypes.string,
  credit: PropTypes.number,
  debit: PropTypes.number,
  style: PropTypes.string,
};
