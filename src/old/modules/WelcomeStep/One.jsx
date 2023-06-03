import PropTypes from 'prop-types';
import React from 'react';

import { FormConfirmPassword } from '../Form';

export const WelcomeStepOne = ({ onSubmit, resetPasswordToken }) => (
  <div data-testid="welcome-steps-one">
    <h1 className="h3 mb-4 ml-1 text-primary">1. Enable your account</h1>
    <FormConfirmPassword
      buttonText="Next"
      hasTerms={true}
      isAuthyEnabled={false}
      resetPasswordToken={resetPasswordToken}
      onSubmit={onSubmit}
    />
  </div>
);

WelcomeStepOne.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  resetPasswordToken: PropTypes.string.isRequired,
};
