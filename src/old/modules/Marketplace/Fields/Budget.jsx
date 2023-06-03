import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Card, Col, FormGroup, Row } from 'reactstrap';

import { FormField, FormLabel } from '@app/modules/Form';
import { centsToDollar } from '@app/utils';

export const MarketplaceFieldsBudget = ({ isWorkOrder, limitCents }) => {
  const budget = useMemo(() => {
    if (isWorkOrder) {
      return {
        label: 'Max spend',
        text: `The tradie will be asked to contact the agency for approval if the works are likely to exceed the max spend.`,
      };
    }

    return {
      label: 'Job Budget (Optional)',
      text: `If you would like to give tradies a budget for this job, please enter it here. If you'd prefer to have no budget, leave this blank.`,
    };
  }, [isWorkOrder]);

  const limit = useMemo(() => {
    if (limitCents) {
      const amount = centsToDollar(limitCents);
      return `You have authority to spend up to ${amount} for this property without approval.`;
    }

    return 'Confirm with property owner on spend authority.';
  }, [limitCents]);

  return (
    <Card className="bg-lavender text-left p-4 mb-3">
      <FormGroup className="m-0">
        <Row>
          <Col>
            <FormLabel
              for="budgetDollars"
              className="text-normal font-weight-bold"
              isRequired={isWorkOrder}>
              {budget.label}
            </FormLabel>
            <p className="form-text m-0">{budget.text}</p>
          </Col>
          <Col>
            <FormField
              min="1"
              name="budgetDollars"
              prepend="$"
              step="any"
              type="number"
              bsSize="lg"
            />
            <small className="form-text text-muted mt-2 ml-1">{limit}</small>
          </Col>
        </Row>
      </FormGroup>
    </Card>
  );
};

MarketplaceFieldsBudget.propTypes = {
  isWorkOrder: PropTypes.bool,
  limitCents: PropTypes.number,
};
