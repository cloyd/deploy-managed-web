import PropTypes from 'prop-types';
import React from 'react';
import { Button, FormGroup, FormText } from 'reactstrap';
import * as Yup from 'yup';

import { FormLabelInput } from '.';

export const defaultPropsForAuthyToken = (props = {}) => {
  return {
    authyToken: '',
  };
};

export const validationSchemaForAuthyToken = {
  authyToken: Yup.string().required('Security code is required'),
};

export const FormFieldsForAuthyToken = ({
  className,
  handleChange,
  handleBlur,
  touched,
  errors,
  onRequestAuthySMS,
  ...props
}) => {
  return (
    <>
      <FormGroup>
        <Button
          color="secondary"
          data-testid="request-auth-btn"
          onClick={onRequestAuthySMS}>
          Request Security code
        </Button>
      </FormGroup>
      <FormGroup>
        <FormLabelInput
          label="Enter the six-digit code"
          name="authyToken"
          placeholder="123456"
          data-testid="authy-token-input"
          isRequired
          isTouched={touched.authyToken}
          error={errors.authyToken}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
        <FormText className="ml-1">it may take a minute to arrive.</FormText>
      </FormGroup>
    </>
  );
};

FormFieldsForAuthyToken.defaultProps = {
  errors: {},
  touched: {},
  values: {},
};

FormFieldsForAuthyToken.propTypes = {
  attributeName: PropTypes.string,
  className: PropTypes.string,
  errors: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  onRequestAuthySMS: PropTypes.func.isRequired,
  touched: PropTypes.object,
  values: PropTypes.object,
};
