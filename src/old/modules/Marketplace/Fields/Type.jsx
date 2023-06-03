import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Col, Row } from 'reactstrap';

import { ButtonToggle } from '@app/modules/Button';
import { JOB_TYPE } from '@app/redux/marketplace';

export const MarketplaceFieldsType = ({ isWorkOrder, onChange, values }) => {
  const handleChange = useCallback(
    (value) => () => {
      onChange('jobType')(value);
    },
    [onChange]
  );

  return (
    <Row>
      <Col md={5} className="offset-md-1">
        <div data-testid="button-work-order">
          <ButtonToggle
            icon="hammer"
            isActive={!!values.jobType && isWorkOrder}
            className="w-100 mb-3"
            onClick={handleChange(JOB_TYPE.workOrder)}>
            Send a Work Order
          </ButtonToggle>
        </div>
        <p>
          Tradie will be asked to do the job if total cost is under the
          nominated max spend.
        </p>
      </Col>
      <Col md={5}>
        <ButtonToggle
          data-testid="button-quote"
          icon="file-invoice-dollar"
          isActive={!!values.jobType && !isWorkOrder}
          className="w-100 mb-3"
          onClick={handleChange(JOB_TYPE.quote)}>
          Collect Some Quotes
        </ButtonToggle>
        <p>
          Tradies will be asked to estimate the job, and you will need to
          approve the quote before they can start work.
        </p>
      </Col>
    </Row>
  );
};

MarketplaceFieldsType.propTypes = {
  isWorkOrder: PropTypes.bool,
  onChange: PropTypes.func,
  values: PropTypes.object,
};
