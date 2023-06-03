import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Form, Row } from 'reactstrap';
import * as Yup from 'yup';

import {
  daysBetween,
  formatDate,
  nextEffectiveDate,
  toCents,
  toDollars,
  toFrequencyAmountsCents,
  toYearAmountsCents,
} from '../../../utils';
import { ContentDefinition } from '../../Content';
import {
  FormButtons,
  FormFieldDate,
  FormLabel,
  FormLabelInput,
} from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';
import { ModalConfirm } from '../../Modal';
import { LeasePaymentValues } from '../PaymentValues';

const LeaseFormAdjustComponent = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    isSubmitting,
    isValid,
    onCancel,
    touched,
    values,
  } = props;

  const onChangeRentDollars = () => (e) => {
    const { payFrequency } = props.lease;
    const amountsCents = toFrequencyAmountsCents(toCents(e.target.value));
    const annualRentCents = Math.round(amountsCents[payFrequency]);

    props.setFieldValue('annualRentCents', annualRentCents);
    props.handleChange(e);
  };

  const handleChangeEffectiveFrom = () => (value) => {
    const { payFrequency, startDate } = props.lease;

    // Calculates the next effective date based on the rental frequency and
    // effective date chosen.
    const effectiveDate = nextEffectiveDate(
      new Date(value),
      new Date(startDate),
      payFrequency
    );

    props.setFieldValue('effectiveDate', formatDate(effectiveDate));
  };

  // Use formiks state so we dont have to use our own.
  const handleModal = (bool) => () => {
    props.setFieldValue('requiresConfirmation', bool);
  };

  const handleSubmit = () => (e) => {
    e.preventDefault();

    daysBetween(new Date(values.effectiveDate), new Date()) < 60
      ? handleModal(true)()
      : props.handleSubmit(e);
  };

  return (
    <Form onSubmit={handleSubmit()}>
      <Row className="mb-4">
        <Col xs={12} sm={9} className="pr-sm-1">
          <LeasePaymentValues value={values.annualRentCents} />
        </Col>
        <Col xs={12} sm={3} className="pl-sm-1">
          <ContentDefinition
            label="Adjustment Applies From"
            value={values.effectiveDate}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={4} lg={3} className="mb-3 mb-lg-0">
          <FormLabelInput
            label={`${startCase(props.lease.payFrequency)} Rent`}
            name="rentDollars"
            type="number"
            step="any"
            min="10"
            prepend="$"
            isRequired
            value={values.rentDollars}
            isTouched={touched.rentDollars}
            error={errors.rentDollars}
            handleChange={onChangeRentDollars()}
            handleBlur={handleBlur}
          />
        </Col>
        <Col xs={12} sm={4} lg={3} className="mb-3 mb-lg-0">
          <FormLabel for="effectiveFrom" isRequired>
            Effective From
          </FormLabel>
          <FormFieldDate
            name="effectiveFrom"
            onChange={handleChangeEffectiveFrom()}
          />
        </Col>
        <Col xs={12} sm={4} lg={3} className="mb-3 mb-lg-0">
          <FormLabelInput
            label="Reason for Change"
            name="reason"
            type="select"
            isRequired
            value={values.reason}
            isTouched={touched.reason}
            error={errors.reason}
            handleChange={handleChange}
            handleBlur={handleBlur}>
            <option value="">-- Select --</option>
            <option value="review">Rent Review</option>
            <option value="prescheduled">Pre-scheduled Change</option>
          </FormLabelInput>
        </Col>
        <Col xs={12} lg={3} className="align-self-sm-end mb-sm-1">
          <FormButtons
            isValid={isValid}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
          />
        </Col>
      </Row>
      <ModalConfirm
        isOpen={values.requiresConfirmation}
        size="md"
        title="Warning"
        body="Please confirm you have issued the required 60 days notice before actioning the rental adjustment."
        btnCancel={{ text: 'Cancel' }}
        btnSubmit={{ text: 'Continue' }}
        onCancel={handleModal(false)}
        onSubmit={props.handleSubmit}
      />
    </Form>
  );
};

LeaseFormAdjustComponent.propTypes = {
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
  setFieldTouched: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
};

const config = {
  displayName: 'LeaseFormAdjust',

  mapPropsToValues: (props) => {
    const { id, payFrequency, annualRentCents } = props.lease;
    const amountCents = toYearAmountsCents(annualRentCents);

    return {
      annualRentCents,
      effectiveDate: '',
      effectiveFrom: '',
      id,
      rentDollars: toDollars(amountCents[payFrequency]),
    };
  },

  validationSchema: () => {
    // 1 minute before midnight, so we can choose today.
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, -1);

    return Yup.object().shape({
      effectiveFrom: Yup.date()
        .required('Effective date is required')
        .min(startOfDay, 'Effective from must be after today'),

      reason: Yup.string().required('A reason for change is required'),

      rentDollars: Yup.number()
        .required('Rent is required')
        .positive('Must be a positive number')
        .minAmount('Rent must be greater than $10'),
    });
  },

  handleSubmit: (values, { props }) => {
    const { effectiveFrom, rentDollars, requiresConfirmation, ...params } =
      values;

    props.onSubmit(params);
  },
};

export const LeaseFormAdjust = compose(
  withFormik(config),
  withOnComplete
)(LeaseFormAdjustComponent);
