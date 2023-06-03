import { FormikProvider, useFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FormGroup, FormText, Label } from 'reactstrap';
import * as Yup from 'yup';

import { selectProfileEmail } from '../../redux/profile';
import { ButtonSubmit } from '../Button';
import InputField from '../Form/Field/InputField';
import { useChangePassword } from './useChangePassword';

const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current Password is required'),
  password: Yup.string()
    .min(12, 'New Password must have a minimum 12 characters')
    .required('New Password is required'),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'New Passwords must match')
    .required('Confirm Password is required'),
});

export const ChangePasswordForm = ({ isOpen, toggle }) => {
  const userEmail = useSelector(selectProfileEmail);

  const { mutate, isLoading, isSuccess, isError, isIdle } = useChangePassword();

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: ChangePasswordSchema,
    onSubmit: (values) => mutate({ email: userEmail, ...values }),
  });

  useEffect(() => {
    if (isError && !isLoading && isOpen) {
      toggle();
    }
  }, [isError, toggle, isLoading, isOpen]);

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="px-2">
        <FormText className="mb-3">
          Your new password must be different from previous used passwords.
        </FormText>
        <FormGroup>
          <Label for="currentPassword">Current Password</Label>
          <InputField
            data-testid="form-field-current-password"
            type="password"
            name="currentPassword"
            id="currentPassword"
            placeholder="************"
            value={formik.values.currentPassword}
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">New Password</Label>
          <InputField
            data-testid="form-field-new-password"
            type="password"
            name="password"
            id="password"
            placeholder="************"
            value={formik.values.password}
          />
        </FormGroup>
        <FormGroup>
          <Label for="passwordConfirmation">Confirm New Password</Label>
          <InputField
            data-testid="form-field-confirm-new-password"
            type="password"
            name="passwordConfirmation"
            id="passwordConfirmation"
            placeholder="************"
            value={formik.values.passwordConfirmation}
          />
        </FormGroup>
        <div className="d-flex justify-content-end mt-3">
          <ButtonSubmit
            data-testid="change-password-button"
            color="primary"
            disabled={
              !formik?.isValid ||
              !Object.keys(formik?.touched).length ||
              isLoading ||
              !isIdle
            }
            // the logic here is to show loading once mutate is triggered.
            isSubmitting={(isLoading && !isSuccess) || !isIdle}>
            Confirm
          </ButtonSubmit>
        </div>
      </form>
    </FormikProvider>
  );
};

ChangePasswordForm.propTypes = {
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
};

ChangePasswordForm.defaultProps = {
  isOpen: false,
};

export default ChangePasswordForm;
