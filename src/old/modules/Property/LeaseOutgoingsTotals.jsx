import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import { centsToDollar } from '../../utils';

export const PropertyLeaseOutgoingsTotals = ({
  totalAnnualEstimateCents,
  totalMonthlyTenantAmountCents,
  classNames,
}) => {
  return (
    <div className={classNames}>
      <Row className="no-gutters">
        <Col className="text-right">
          <span className="font-weight-bold">{'Total Outgoings: '}</span>
          {centsToDollar(totalAnnualEstimateCents)}
        </Col>
      </Row>
      <Row className="no-gutters">
        <Col className="text-right">
          <span className="font-weight-bold">{'Monthly Bill: '}</span>
          {centsToDollar(totalMonthlyTenantAmountCents)}
        </Col>
      </Row>
    </div>
  );
};

PropertyLeaseOutgoingsTotals.propTypes = {
  totalAnnualEstimateCents: PropTypes.number.isRequired,
  totalMonthlyTenantAmountCents: PropTypes.number.isRequired,
  classNames: PropTypes.string,
};

PropertyLeaseOutgoingsTotals.defaultProps = {
  classNames: 'mb-3',
};
