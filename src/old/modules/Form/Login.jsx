import { Form, withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React from 'react';
import { FormGroup } from 'reactstrap';
import * as Yup from 'yup';

import { FormButtons, FormField, FormLabel } from '.';
import { Link } from '../Link';
import { withOnComplete } from './withOnComplete';

const FormLoginComponent = ({ handleSubmit, isValid, isSubmitting }) => {
  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <FormLabel for="email" hidden>
          Email
        </FormLabel>
        <FormField name="email" placeholder="Email" />
      </FormGroup>
      <FormGroup>
        <FormLabel for="password" hidden>
          Password
        </FormLabel>
        <FormField name="password" placeholder="Password" type="password" />
      </FormGroup>
      <Link to="/reset-password">
        <small className="d-block">Forgot Password</small>
      </Link>
      <FormButtons
        btnSubmit={{ text: 'Login' }}
        className="justify-content-start mt-3"
        isValid={isValid}
        isSubmitting={isSubmitting}
      />
    </Form>
  );
};

FormLoginComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
};

const config = {
  displayName: 'FormLogin',

  mapPropsToValues: () => ({
    email: '',
    password: '',
  }),

  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),

    password: Yup.string().required('Password is required'),
  }),

  handleSubmit: (values, { props }) => props.onSubmit(values),
};

export const FormLogin = compose(
  withFormik(config),
  withOnComplete
)(FormLoginComponent);
