import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Col, Row } from 'reactstrap';

import { centsToDollar } from '../../utils';
import { CardPlain } from '../Card';

function getStyle({ status }) {
  switch (status) {
    case 'active':
      return 'text-danger';
    case 'completed':
      return 'text-success';
    default:
      return 'text-muted';
  }
}

export const LoanCard = ({ loan }) => {
  const style = useMemo(() => getStyle(loan), [loan]);
  const isDraft = useMemo(() => loan.status === 'draft', [loan]);

  return (
    <CardPlain className={isDraft ? 'bg-lavender border-0' : ''}>
      <Row>
        <Col xs={12} lg={1} className="text-left text-nowrap">
          <strong data-testid="number">{loan.number}</strong>
        </Col>
        <Col xs={4} lg={5} className="text-left">
          {!isDraft && (
            <>
              <span className="font-weight-bold" data-testid="amount">
                {centsToDollar(loan.amountCents)}
              </span>
              <br />
            </>
          )}
          {loan.description}
        </Col>
        <Col xs={4} lg={3} className="text-left">
          {!isDraft && (
            <strong data-testid="balance">
              {centsToDollar(loan.walletBalanceCents)}
            </strong>
          )}
        </Col>
        <Col xs={4} lg={3} className="d-flex justify-content-between text-left">
          <div>
            {!isDraft && (
              <>
                <strong data-testid="owing">
                  {centsToDollar(loan.amountOwingCents)}
                </strong>
                <br />
              </>
            )}
            <span className={style} data-testid="status">
              {loan.statusMessage}
            </span>
          </div>
          <div className="d-flex align-items-center text-muted">
            <FontAwesomeIcon
              size="lg"
              icon={['far', loan.isApproved ? 'chevron-right' : 'clock']}
            />
          </div>
        </Col>
      </Row>
    </CardPlain>
  );
};

LoanCard.propTypes = {
  loan: PropTypes.object.isRequired,
};
