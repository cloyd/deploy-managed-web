import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from 'reactstrap';
import * as Yup from 'yup';

import { FormButtons } from './Buttons';
import {
  FormFieldsForAuthyToken,
  defaultPropsForAuthyToken,
  validationSchemaForAuthyToken,
} from './FieldsForAuthyToken';

class FormTwoFactorAuthComponent extends Component {
  static propTypes = {
    className: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    hasError: PropTypes.bool,
    touched: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onDisableAuthy: PropTypes.func,
    onRequestAuthySMS: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    isDisable2FAEnabled: PropTypes.bool,
    isSubmitting: PropTypes.bool,
    isValid: PropTypes.bool,
    dirty: PropTypes.bool,
    resetForm: PropTypes.func,
    setSubmitting: PropTypes.func,
    setFieldTouched: PropTypes.func.isRequired,
    user: PropTypes.object,
    btnText: PropTypes.string,
    disable2FABtnText: PropTypes.string,
  };

  static defaultProps = {
    btnText: 'Verify',
    isDisabled: false,
    isLoading: false,
    isSubmitting: false,
    isValid: false,
    isDisable2FAEnabled: false,
  };

  componentDidUpdate(prevProps) {
    const { hasError, isLoading, isSubmitting, resetForm, setSubmitting } =
      this.props;

    if (isSubmitting && prevProps.isLoading && !isLoading) {
      hasError ? setSubmitting(false) : resetForm();
    }
  }

  render() {
    const {
      className,
      btnText,
      disable2FABtnText,
      handleSubmit,
      values,
      errors,
      touched,
      isDisabled,
      isDisable2FAEnabled,
      isSubmitting,
      isValid,
      dirty,
      handleBlur,
      handleChange,
      onRequestAuthySMS,
      user,
    } = this.props;

    return (
      <div data-testid="form-two-factor-auth">
        <Form onSubmit={handleSubmit} className={className}>
          {
            <>
              <FormFieldsForAuthyToken
                errors={errors}
                handleChange={handleChange}
                handleBlur={handleBlur}
                touched={touched}
                values={values}
                onRequestAuthySMS={onRequestAuthySMS}
              />
              <FormButtons
                btnSubmit={{
                  text:
                    isDisable2FAEnabled && user.isAuthyEnabled
                      ? disable2FABtnText
                      : btnText,
                }}
                isDisabled={isDisabled}
                isSubmitting={isSubmitting}
                isValid={isValid && dirty}
              />
            </>
          }
        </Form>
      </div>
    );
  }
}

const validate = withFormik({
  displayName: 'FormTwoFactorAuth',

  mapPropsToValues: ({ user }) => ({
    ...defaultPropsForAuthyToken(user),
    email: user.email,
  }),
  validationSchema: Yup.object().shape(validationSchemaForAuthyToken),
  handleSubmit: (values, { props }) => {
    const { user, isDisable2FAEnabled, onDisableAuthy, onSubmit } = props;

    if (isDisable2FAEnabled && user.isAuthyEnabled) {
      return onDisableAuthy && onDisableAuthy(values);
    }

    return onSubmit(values);
  },
});

export const FormTwoFactorAuth = validate(FormTwoFactorAuthComponent);
