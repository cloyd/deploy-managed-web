import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Col, Form, FormGroup, Row, UncontrolledTooltip } from 'reactstrap';

import { toDollars } from '../../../utils';
import { FormButtons } from '../../Form';

export const LeaseScheduleConfirm = ({
  onCancel,
  onSubmit,
  scheduledLeaseItems,
}) => {
  const calculateTotalScheduledAmount = useMemo(
    () => scheduledLeaseItems.reduce((acc, item) => acc + item.amountCents, 0),
    [scheduledLeaseItems]
  );

  return (
    <Form onSubmit={onSubmit}>
      <FormGroup>
        <Row className="text-primary justify-content-center">
          <Col className="text-left" xs={4} sm={4}>
            <strong>Bill Task</strong>
          </Col>
          <Col className="text-right" xs={4} sm={4}>
            <strong>Amount</strong>
          </Col>
        </Row>
        {scheduledLeaseItems.map(({ id, title, amountCents }) => (
          <Row className="mt-2 justify-content-center" key={title}>
            <Col xs={4} sm={4}>
              <span
                id={'tooltipConfirmTitleName-' + id}
                className="text-left mt-1">
                {title.length > 15 ? title.slice(0, 13) + '...' : title}
              </span>
            </Col>
            {title.length > 15 ? (
              <UncontrolledTooltip
                target={'tooltipConfirmTitleName-' + id}
                placement="top">
                {title}
              </UncontrolledTooltip>
            ) : null}
            <Col className="text-right text-muted" xs={4} sm={4}>
              $ {toDollars(amountCents)}
            </Col>
          </Row>
        ))}
      </FormGroup>
      <Row className="justify-content-center mb-3">
        <Col
          className="text-right text-primary px-0 font-weight-bold"
          xs={4}
          sm={4}>
          Total Amount
        </Col>
        <Col className="text-right text-muted" xs={4} sm={4}>
          $ {toDollars(calculateTotalScheduledAmount)}
        </Col>
      </Row>
      <FormButtons
        btnSubmit={{ text: 'Activate' }}
        btnCancel={{ text: 'Go Back' }}
        onCancel={onCancel}
        isFormButtonsJustifyBetween={true}
      />
    </Form>
  );
};

LeaseScheduleConfirm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  scheduledLeaseItems: PropTypes.array.isRequired,
};
