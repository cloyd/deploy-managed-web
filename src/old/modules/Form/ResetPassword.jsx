import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { Alert, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import * as Yup from 'yup';

import { FormButtons } from '../Form';

const FormResetPasswordComponent = (props) => {
  const {
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid,
    message,
    touched,
    values,
  } = props;

  return message ? (
    <Alert isOpen={true} color="success">
      {message}
    </Alert>
  ) : (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="email" hidden>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          valid={touched.email && !errors.email}
          invalid={touched.email && !!errors.email}
        />
        {errors.email && <FormFeedback>{errors.email}</FormFeedback>}
      </FormGroup>
      <FormButtons
        btnSubmit={{ text: 'Submit' }}
        className="justify-content-start"
        isValid={isValid}
        isSubmitting={isSubmitting}
      />
    </Form>
  );
};

FormResetPasswordComponent.propTypes = {
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  touched: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
};

const validate = withFormik({
  displayName: 'FormResetPassword',

  mapPropsToValues: () => ({
    email: '',
  }),

  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  }),

  handleSubmit: (values, { props }) => props.onSubmit(values),
});

export const FormResetPassword = validate(FormResetPasswordComponent);
