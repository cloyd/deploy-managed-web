import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, CustomInput, Form, FormFeedback, FormGroup } from 'reactstrap';
import * as Yup from 'yup';

import { Alert } from '../../containers';
import { FormField } from './Field';
import {
  FormFieldsForAuthyToken,
  defaultPropsForAuthyToken,
  validationSchemaForAuthyToken,
} from './FieldsForAuthyToken';
import { FormLabel } from './Label';

const FormConfirmPasswordComponent = (props) => {
  const {
    buttonText,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    onRequestAuthySMS,
    isAuthyEnabled,
    isValid,
    message,
    hasTerms,
    touched,
  } = props;

  return message ? (
    <Alert isOpen={true} color="success">
      {message}
    </Alert>
  ) : (
    <Form data-testid="form-confirm-password" onSubmit={handleSubmit}>
      <FormGroup>
        <FormLabel for="password">Password</FormLabel>
        <FormField
          data-testid="form-field-password"
          type="password"
          name="password"
        />
        {errors.password && <FormFeedback>{errors.password}</FormFeedback>}
      </FormGroup>
      <FormGroup>
        <FormLabel for="passwordConfirmation">Re-type password</FormLabel>
        <FormField
          data-testid="form-field-passwordConfirmation"
          type="password"
          name="passwordConfirmation"
        />
        {errors.passwordConfirmation && (
          <FormFeedback>{errors.passwordConfirmation}</FormFeedback>
        )}
      </FormGroup>
      {isAuthyEnabled && (
        <FormFieldsForAuthyToken
          errors={errors}
          handleChange={handleChange}
          handleBlur={handleBlur}
          touched={touched}
          onRequestAuthySMS={onRequestAuthySMS}
        />
      )}
      {hasTerms && (
        <FormGroup>
          <CustomInput
            data-testid="form-field-terms"
            type="checkbox"
            id="terms"
            name="terms"
            label="I agree to the Managed"
            onChange={handleChange}>
            <a
              className="btn-link ml-1"
              href="https://www.managedapp.com.au/terms-conditions"
              rel="noopener noreferrer"
              target="_blank">
              Terms &amp; Conditions
            </a>
          </CustomInput>
        </FormGroup>
      )}
      <Button
        data-testid="form-submit-btn"
        block
        size="lg"
        type="submit"
        color="primary"
        disabled={!isValid}
        className="mt-4">
        {buttonText || 'Submit'}
      </Button>
    </Form>
  );
};

FormConfirmPasswordComponent.propTypes = {
  buttonText: PropTypes.string,
  dirty: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onComplete: PropTypes.func,
  onRequestAuthySMS: PropTypes.func,
  isAuthyEnabled: PropTypes.bool,
  isValid: PropTypes.bool.isRequired,
  message: PropTypes.string,
  hasTerms: PropTypes.bool.isRequired,
  touched: PropTypes.object.isRequired,
};

const config = {
  displayName: 'FormConfirmPassword',

  mapPropsToValues: ({ resetPasswordToken }) => ({
    ...defaultPropsForAuthyToken(),
    password: '',
    passwordConfirmation: '',
    resetPasswordToken,
    terms: false,
  }),

  validationSchema: (props) => {
    let schema = {
      password: Yup.string()
        .min(12, 'Password must have a minimum 12 characters')
        .required('Password is required'),

      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Password is required'),
    };

    if (props.hasTerms) {
      schema.terms = Yup.boolean().test(
        'is-checked',
        'You must accept the Terms & Conditions',
        (value) => value === true
      );
    }

    if (props.isAuthyEnabled) {
      schema = {
        ...validationSchemaForAuthyToken,
        ...schema,
      };
    }

    return Yup.object().shape(schema);
  },

  handleSubmit: (values, { props }) => props.onSubmit(values),
};

export const FormConfirmPassword = compose(withFormik(config))(
  FormConfirmPasswordComponent
);
