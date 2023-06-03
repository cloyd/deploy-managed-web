import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import { centsToDollar, toYearAmountsCents } from '../../utils';
import { ContentDefinition } from '../Content';

export const LeasePaymentValues = ({ value, ...props }) => {
  const { weekly, fortnightly, monthly } = toYearAmountsCents(value);

  return (
    <Row {...props}>
      <Col xs={6} sm={3} className="pr-md-1">
        <ContentDefinition label="Weekly" value={centsToDollar(weekly)} />
      </Col>
      <Col xs={6} sm={3} className="px-md-1">
        <ContentDefinition
          label="Fortnightly"
          value={centsToDollar(fortnightly)}
        />
      </Col>
      <Col xs={6} sm={3} className="px-md-1">
        <ContentDefinition label="Monthly" value={centsToDollar(monthly)} />
      </Col>
      <Col xs={6} sm={3} className="pl-md-1">
        <ContentDefinition label="Yearly" value={centsToDollar(value)} />
      </Col>
    </Row>
  );
};

LeasePaymentValues.propTypes = {
  value: PropTypes.number,
};

LeasePaymentValues.defaultProps = {
  value: 0,
};
