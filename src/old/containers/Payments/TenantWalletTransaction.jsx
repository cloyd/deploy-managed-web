import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React from 'react';
import { Badge, Card, CardBody, Col, Row } from 'reactstrap';

import { PaymentNumerator } from '../../modules/Payment';
import { centsToDollar, formatDate } from '../../utils';

const WITHDRAWAL_STATUS = {
  draft: {
    text: 'Processing',
    color: 'primary',
  },
  pending: {
    text: 'Processing',
    color: 'primary',
  },
  completed: {
    text: 'Completed',
    color: 'success',
  },
  successful: {
    text: 'Completed',
    color: 'success',
  },
  rejected: {
    text: 'Rejected',
    color: 'danger',
  },
};

export const TenantWalletTransaction = ({
  amountCents,
  status,
  createdAt,
  completedAt,
  title,
  descriptions,
}) => {
  const [type, ...description] = descriptions;

  return (
    <Card className="border-0 pb-2 mb2">
      <CardBody className="px-3 py-2">
        <Row className="align-items-center pl-3">
          <Col lg={4} className="d-flex align-items-left flex-column">
            <strong>{`${startCase(title || 'Wallet Withdrawal')} ${
              type !== 'rent' && descriptions.length
                ? `(${startCase(type)})`
                : ''
            }`}</strong>
            <small>{`Transaction created at: ${formatDate(
              createdAt,
              'short'
            )}`}</small>
            {completedAt && (
              <small>{`Completed at: ${formatDate(
                completedAt,
                'short'
              )}`}</small>
            )}
          </Col>
          <Col lg={4} className="d-flex align-items-left flex-column">
            {description.length
              ? description.map((item, index) => (
                  <small key={`description-${index}`}>{startCase(item)}</small>
                ))
              : '-'}
          </Col>
          <Col
            lg={2}
            className="d-flex align-items-end justify-content-between px-0">
            <Row className="text-right w-100">
              <Col lg={6} className="d-flex px-0 justify-content-end">
                <PaymentNumerator numerator={amountCents > 0 ? '+' : '-'} />
                <strong>{centsToDollar(amountCents)}</strong>
              </Col>
            </Row>
          </Col>
          <Col lg={2} className="px-0">
            <Badge
              color={WITHDRAWAL_STATUS?.[status]?.color}
              className={`text-right`}>
              {startCase(WITHDRAWAL_STATUS?.[status]?.text)}
            </Badge>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

TenantWalletTransaction.propTypes = {
  amountCents: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
  completedAt: PropTypes.string,
  title: PropTypes.string,
  descriptions: PropTypes.arrayOf(PropTypes.string),
};

TenantWalletTransaction.defaultProps = {
  descriptions: [],
};
