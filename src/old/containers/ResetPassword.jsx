import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { useLocationParams, usePrevious } from '../hooks';
import { BrandLogo } from '../modules/Brand';
import { CardCentered } from '../modules/Card';
import { FormConfirmPassword, FormResetPassword } from '../modules/Form';
import { Link } from '../modules/Link';
import { hideAlert } from '../redux/notifier';
import {
  confirmPassword,
  getMessage,
  getProfile,
  isAuthorized,
  requestAuthySMS,
  resetPassword,
} from '../redux/profile';
import { Alert } from './Alert';

const ResetPasswordComponent = (props) => {
  const {
    confirmPassword,
    isAuthorized,
    message,
    requestAuthySMS,
    resetPassword,
  } = props;

  const prevIsAuthorized = usePrevious(isAuthorized);
  const params = useLocationParams();

  const handleRequestAuthySMS = useCallback(() => {
    requestAuthySMS(params.email);
  }, [params.email, requestAuthySMS]);

  useEffect(() => {
    if (!prevIsAuthorized && isAuthorized) {
      hideAlert();
    }
  }, [isAuthorized, prevIsAuthorized]);

  return isAuthorized ? (
    <Redirect to="/" />
  ) : (
    <CardCentered>
      <Link to="/" className="mb-3">
        <BrandLogo>Managed</BrandLogo>
      </Link>
      {params.resetPasswordToken ? (
        <div>
          <Alert containerClassName="p-0" />
          <p>Create a new password to login.</p>
          <FormConfirmPassword
            hasTerms={false}
            resetPasswordToken={params.resetPasswordToken}
            isAuthyEnabled={params.isAuthyEnabled === 'true'}
            onSubmit={confirmPassword}
            onRequestAuthySMS={handleRequestAuthySMS}
          />
        </div>
      ) : (
        <div>
          <p>Enter your email to retrieve your password.</p>
          <FormResetPassword message={message} onSubmit={resetPassword} />
        </div>
      )}
    </CardCentered>
  );
};

ResetPasswordComponent.propTypes = {
  confirmPassword: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  hideAlert: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  resetPassword: PropTypes.func.isRequired,
  requestAuthySMS: PropTypes.func.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = (state) => {
  const user = getProfile(state.profile);

  return {
    isAuthorized: isAuthorized(state.profile),
    message: getMessage(state.profile),
    user,
  };
};

const mapDispatchToProps = {
  confirmPassword,
  hideAlert,
  requestAuthySMS,
  resetPassword,
};

export const ResetPassword = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordComponent);
