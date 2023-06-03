import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Form, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import { FormButtons, FormLabelInput } from '.';
import { dollarToCents } from '../../utils';

const FormDdaPromisepayComponent = (props) => {
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

  // <PaymentAcceptAssembly
  //   isChecked={values.ddaPromispay}
  //   onChange={handleChange}
  // />

  return (
    <Form>
      <FormGroup>
        <Row className="mt-2">
          <Col md={6} lg={4}>
            <FormLabelInput
              label="Set the maximum amount debitable"
              name="amountCents"
              prepend="$"
              type="number"
              step="any"
              isRequired
              value={values.amountCents}
              isTouched={touched.amountCents}
              error={errors.amountCents}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          </Col>
        </Row>
      </FormGroup>
      <FormButtons
        className="justify-content-start"
        isDisabled={!isValid}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </Form>
  );
};

FormDdaPromisepayComponent.propTypes = {
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
};

FormDdaPromisepayComponent.defaultProps = {
  isSubmitting: false,
  isValid: false,
};

const formikEnhancer = withFormik({
  displayName: 'DdaPromisepay',

  mapPropsToValues: () => ({
    amountCents: '100000',
    // ddaPromispay: false,
  }),

  validationSchema: Yup.object().shape({
    amountCents: Yup.number()
      .required('Direct debit amount is required')
      .moreThan(0, 'Direct debit amount must be greater than 0')
      .typeError('Direct debit amount must be a number'),
  }),

  // ddaPromispay: Yup.boolean().oneOf(
  //   [true],
  //   'You must accept the terms & conditions'
  // ),
  // }),

  handleSubmit: (values, { props }) => {
    props.onSubmit({ amountCents: dollarToCents(values.amountCents) });
  },
});

export const FormDdaPromisepay = formikEnhancer(FormDdaPromisepayComponent);
