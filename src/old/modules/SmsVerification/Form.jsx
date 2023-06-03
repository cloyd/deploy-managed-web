import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormikProvider, useFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, FormGroup, FormText, Label } from 'reactstrap';
import * as Yup from 'yup';

import { selectProfilePhoneNumber } from '../../redux/profile';
import { obfuscatePhoneNumber } from '../../utils/obfuscateParams';
import InputField from '../Form/Field/InputField';
import Counter from './Counter';

const SmsVerificationSchema = Yup.object().shape({
  securityCode: Yup.string()
    .required('Security code is required')
    .length(6, 'Must be exactly 6 characters'),
});

const Form = ({
  onSubmit,
  requestSecurityCode,
  isRequestingSecurityCode,
  isSecurityCodeSuccess,
  isSubmitting,
  useDefaultTheme,
}) => {
  const phoneNumber = useSelector(selectProfilePhoneNumber);
  const maskedNumber = obfuscatePhoneNumber(phoneNumber || '');

  const [requestTimer, setRequestTimer] = useState(false);

  const formik = useFormik({
    initialValues: {
      securityCode: '',
    },
    validationSchema: SmsVerificationSchema,
    onSubmit: (values) => onSubmit(values),
  });

  const toggleTimer = useCallback(() => {
    setRequestTimer(false);
  }, []);

  useEffect(() => {
    if (isSecurityCodeSuccess) {
      setRequestTimer(true);
    }
  }, [isSecurityCodeSuccess]);

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="px-2">
        <FormGroup>
          <Label for="securityCode">
            Please enter the verification code we sent to
            <br />
            <b>{maskedNumber}</b>.
          </Label>
          <InputField
            type="text"
            name="securityCode"
            id="securityCode"
            placeholder="123456"
            data-testid="authy-token-input"
            value={formik.values.securityCode}
          />
          <FormText>it may take a minute to arrive.</FormText>
        </FormGroup>
        <div className="resend-wrapper d-flex justify-content-between">
          <FormText className="d-flex align-items-center gap-2">
            Didnt receive the code?
            <Button
              onClick={requestSecurityCode}
              className="p-0 resend-button"
              color="link"
              disabled={isRequestingSecurityCode || requestTimer}>
              Re-send
            </Button>
            {requestTimer && (
              <div className="d-flex align-items-center gap-3">
                <Counter toggleTimer={toggleTimer} />
                <FontAwesomeIcon
                  className="mr-1"
                  icon={['far', 'spinner']}
                  spin
                />
              </div>
            )}
          </FormText>
          <Button
            {...(useDefaultTheme
              ? { id: 'verify-authy-btn' }
              : { color: 'primary' })}
            type="submit"
            disabled={
              isRequestingSecurityCode || isSubmitting || !formik.isValid
            }>
            {isSubmitting && (
              <FontAwesomeIcon
                className="text-white mr-1"
                icon={['far', 'spinner']}
                spin
              />
            )}
            {isSubmitting ? 'Verifying' : 'Verify'}
          </Button>
        </div>
      </form>
    </FormikProvider>
  );
};

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  requestSecurityCode: PropTypes.func.isRequired,
  isRequestingSecurityCode: PropTypes.bool,
  isSecurityCodeSuccess: PropTypes.bool,
  // eslint-disable-next-line react/boolean-prop-naming
  useDefaultTheme: PropTypes.bool,
};

Form.defaultProps = {
  isSubmitting: false,
  isRequestingSecurityCode: false,
  isSecurityCodeSuccess: false,
  useDefaultTheme: false,
};

export default Form;
