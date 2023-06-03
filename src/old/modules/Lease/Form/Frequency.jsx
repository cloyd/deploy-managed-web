import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Form, Row } from 'reactstrap';

import { toFrequencyAmountsCents } from '../../../utils';
import { FormButtons, FormLabelInput } from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';
import { LeasePaymentValues } from '../PaymentValues';

const LeaseFormFrequencyComponent = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    isValid,
    lease,
    onCancel,
    setFieldValue,
    touched,
    values,
  } = props;

  const onChangePayFrequency = () => (e) => {
    const payFrequency = e.target.value;
    const currentRentCents = lease.amountCents[lease.payFrequency];
    const amountsCents = toFrequencyAmountsCents(currentRentCents);
    const annualRentCents = Math.round(amountsCents[payFrequency]);

    setFieldValue('annualRentCents', annualRentCents);
    handleChange(e);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col
          xs={12}
          lg={{ size: 6, order: 2 }}
          className="mb-3 mb-lg-0 align-self-lg-end">
          <LeasePaymentValues value={values.annualRentCents} />
        </Col>
        <Col xs={12} md={6} lg={{ size: 3, order: 1 }} className="mb-3 mb-md-0">
          <FormLabelInput
            label="Pay Frequency"
            name="payFrequency"
            type="select"
            isRequired
            value={values.payFrequency}
            isTouched={touched.payFrequency}
            error={errors.payFrequency}
            handleChange={onChangePayFrequency()}
            handleBlur={handleBlur}>
            <option value="weekly">Weekly</option>
            <option value="fortnightly">Fortnightly</option>
            <option value="monthly">Monthly</option>
          </FormLabelInput>
        </Col>
        <Col
          xs={12}
          md={{ size: 4, offset: 2 }}
          lg={{ size: 2, order: 3, offset: 1 }}
          className="align-self-sm-end mb-sm-1">
          <FormButtons
            className="align-self-start justify-content-sm-end"
            isValid={isValid}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
          />
        </Col>
      </Row>
    </Form>
  );
};

LeaseFormFrequencyComponent.propTypes = {
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  lease: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
};

const config = {
  displayName: 'LeaseFormFrequency',

  mapPropsToValues: (props) => {
    const { annualRentCents, id, payFrequency } = props.lease;
    return { annualRentCents, id, payFrequency };
  },

  handleSubmit: (values, { props }) => props.onSubmit(values),
};

export const LeaseFormFrequency = compose(
  withFormik(config),
  withOnComplete
)(LeaseFormFrequencyComponent);
