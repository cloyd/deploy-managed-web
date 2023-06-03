import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Form, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import { dollarToCents, toDollars } from '../../utils';
import { FormButtons, FormLabelInput } from '../Form';

const FormRefundComponent = (props) => {
  const {
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid,
    onCancel,
    touched,
    values,
  } = props;

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Row>
          <Col xs={4}>
            <FormLabelInput
              label="Bond Id"
              name="bondNumber"
              value={values.bondNumber}
              isTouched={touched.bondNumber}
              error={errors.bondNumber}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          </Col>
          <Col xs={4}>
            <FormLabelInput
              type="number"
              label="Amount Payable To Owner"
              name="bondDollars"
              prepend="$"
              min="0"
              step="any"
              value={values.bondDollars}
              isTouched={touched.bondDollars}
              error={errors.bondDollars}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          </Col>
        </Row>
      </FormGroup>
      <FormButtons
        className="justify-content-start"
        isValid={isValid}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </Form>
  );
};

FormRefundComponent.propTypes = {
  errors: PropTypes.object.isRequired,
  className: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  lease: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
};

const formikEnhancer = withFormik({
  displayName: 'FormRefund',

  mapPropsToValues: ({ lease }) => ({
    bondDollars: toDollars(lease.bondCents) || 0,
    bondNumber: lease.bondNumber || '',
  }),

  isInitialValid({ initialValues, validationSchema, lease }) {
    const schema = validationSchema({ lease });
    return schema.isValidSync(initialValues);
  },

  validationSchema: ({ lease }) => {
    const bondDollars = toDollars(lease.bondCents);

    return Yup.object().shape({
      bondNumber: Yup.string().required('Bond Id is required'),
      bondDollars: Yup.number()
        .required('Bond amount is required')
        .max(bondDollars, `Bond amount must be less than $${bondDollars}`),
    });
  },

  handleSubmit: (values, { props }) => {
    const { bondDollars, ...params } = values;

    props.onSubmit({
      ...props.lease,
      ...params,
      bondReturnedCents: dollarToCents(bondDollars),
    });
  },
});

export const FormRefund = formikEnhancer(FormRefundComponent);
