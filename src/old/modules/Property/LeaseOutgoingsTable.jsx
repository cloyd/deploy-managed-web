import PropTypes from 'prop-types';
import React from 'react';
import { Col, FormGroup, Row, UncontrolledTooltip } from 'reactstrap';

import { toDollars } from '../../utils';
import { PropertyLeaseOutgoingsTotals } from './LeaseOutgoingsTotals';
import './styles.scss';

export const PropertyLeaseOutgoingsTable = (props) => {
  const { items, totalAnnualEstimateCents, totalMonthlyTenantAmountCents } =
    props.outgoingsEstimate;

  return (
    <>
      <Row className="align-items-center text-center no-gutters">
        <Col className="outgoings-header-height text-left" md={6}>
          {' '}
          <strong>Bill Name</strong>{' '}
        </Col>
        <Col md={2} className="outgoings-header-height outgoings-border-left">
          <strong>Annual Amount</strong>
        </Col>
        <Col md={2} className="outgoings-header-height outgoings-border-left">
          <strong>Tenant Split %</strong>
        </Col>
        <Col md={2} className="outgoings-header-height outgoings-border-left">
          <strong>Tenant Amount</strong>
        </Col>
      </Row>
      <FormGroup className="outgoings-form-height">
        {items &&
          items.map(
            ({
              id,
              title,
              annualEstimateCents,
              tenantAmountCents,
              percentageTenantSplit,
            }) => (
              <Row
                key={`outgoingBill-${id}`}
                className="align-items-center mt-2 mb-2 no-gutters">
                <>
                  <Col md={6}>
                    <span id={'tooltipTitleName-' + id}>
                      {title.length > 40 ? title.slice(0, 37) + '...' : title}
                    </span>
                  </Col>
                  {title.length > 37 ? (
                    <UncontrolledTooltip
                      target={'tooltipTitleName-' + id}
                      placement="bottom">
                      {title}
                    </UncontrolledTooltip>
                  ) : null}
                </>
                <Col md={2} className="text-right px-3">
                  {toDollars(annualEstimateCents)}
                </Col>
                <Col md={2} className="text-center px-3">
                  {percentageTenantSplit}
                </Col>
                <Col md={2} className="text-right px-3">
                  {toDollars(tenantAmountCents)}
                </Col>
              </Row>
            )
          )}
      </FormGroup>
      <PropertyLeaseOutgoingsTotals
        totalAnnualEstimateCents={totalAnnualEstimateCents}
        totalMonthlyTenantAmountCents={totalMonthlyTenantAmountCents}
        classNames="mb-3 px-3"
      />
    </>
  );
};

PropertyLeaseOutgoingsTable.propTypes = {
  outgoingsEstimate: PropTypes.object.isRequired,
};
