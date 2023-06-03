import { withFormik } from 'formik';
import toNumber from 'lodash/fp/toNumber';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Col, Form, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import { FormButtons, FormLabelInput } from '.';
import { centsToDollar, toCents, toDollarAmount } from '../../utils';
import { DividerTitle } from '../Divider';

class FormApplyCreditComponent extends Component {
  static propTypes = {
    errors: PropTypes.object.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    hasError: PropTypes.bool,
    intention: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    isSubmitting: PropTypes.bool,
    isValid: PropTypes.bool,
    dirty: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    setSubmitting: PropTypes.func.isRequired,
    setValues: PropTypes.func.isRequired,
    touched: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
  };

  static defaultProps = {
    hasError: false,
    isLoading: true,
    isSubmitting: false,
    isValid: false,
  };

  componentDidUpdate(prevProps) {
    const {
      hasError,
      isLoading,
      isSubmitting,
      onCancel,
      resetForm,
      setSubmitting,
    } = this.props;

    if (isSubmitting && prevProps.isLoading && !isLoading) {
      hasError ? setSubmitting(false) : resetForm();
      onCancel();
    }
  }

  onChangeCreditAmount = (e) => {
    const { intention, handleChange, setFieldValue } = this.props;
    const creditAmount = toCents(toNumber(e.target.value));
    const adjustedAmountCents = intention.amountCents + creditAmount;
    const cappedAmountCents = adjustedAmountCents > 0 ? 0 : adjustedAmountCents;

    setFieldValue('adjustedAmountCents', cappedAmountCents);
    handleChange(e);
  };

  render() {
    const {
      errors,
      handleBlur,
      handleChange,
      handleSubmit,
      intention,
      isSubmitting,
      isValid,
      dirty,
      onCancel,
      touched,
      values,
    } = this.props;

    const { end, start } = intention.formatted.dates;

    return (
      <Form onSubmit={handleSubmit}>
        <strong className="d-block text-capitalize">{intention.title}</strong>
        <small className="d-block">
          {start} - {end}
        </small>
        <DividerTitle />
        <Row>
          <Col xs={6}>
            <FormGroup>
              <FormLabelInput
                type="number"
                label="Credit amount"
                name="amountDollars"
                step="any"
                prepend="$"
                isTouched={touched.amountDollars}
                error={errors.amountDollars}
                handleChange={this.onChangeCreditAmount}
                handleBlur={handleBlur}
              />
            </FormGroup>
          </Col>
          <Col xs={6}>
            <FormLabelInput
              label="Adjusted rent"
              name="adjustedAmountCents"
              isTouched={touched.adjustedAmountDollars}
              error={errors.adjustedAmountDollars}
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={centsToDollar(values.adjustedAmountCents, true)}
              readOnly
            />
          </Col>
        </Row>
        <FormGroup>
          <FormLabelInput
            type="textarea"
            label="Reason for adjustment"
            name="rentAdjustmentReason"
            rows="6"
            isTouched={touched.rentAdjustmentReason}
            error={errors.rentAdjustmentReason}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
        </FormGroup>
        <FormButtons
          isValid={isValid && dirty}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </Form>
    );
  }
}

const formikEnhancer = withFormik({
  displayName: 'FormApplyCredit',

  enableReinitialize: true,

  validationSchema: () => {
    return Yup.object().shape({
      amountDollars: Yup.number()
        .required('Credit amount is required')
        .max(Yup.ref('originalAmountDollars'), 'Must be less than rent amount'),

      originalAmountDollars: Yup.number(),

      rentAdjustmentReason: Yup.string().required(
        'Reason for adjustment is required'
      ),
    });
  },

  handleSubmit: (values, { props }) => {
    const { rentAdjustmentReason } = values;

    props.onSubmit({
      rentAdjustmentReason,
      intentionId: props.intention.id,
      amountCents: toCents(values.amountDollars),
    });
  },

  mapPropsToValues: (props) => {
    const originalAmountCents = props.intention.amountCents;

    return {
      adjustedAmountCents: originalAmountCents,
      originalAmountDollars: toDollarAmount(originalAmountCents),
      rentAdjustmentReason: '',
    };
  },
});

export const FormApplyCredit = formikEnhancer(FormApplyCreditComponent);
