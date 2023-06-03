import PropTypes from 'prop-types';
import React from 'react';
import { Button, FormText, Label } from 'reactstrap';

import { validatePhoneNumber } from '@app/utils';

import { obfuscatePhoneNumber } from '../../utils/obfuscateParams';

export const Enable2FAOverview = ({
  phoneNumber,
  logout,
  verifyPhoneNumber,
}) => {
  const { isValid, value } = validatePhoneNumber({ mobileNumber: phoneNumber });
  const maskedNumber = obfuscatePhoneNumber(value);

  return (
    <>
      <Label>
        We need to confirm the mobile number associated with your account and
        you must enable two factor authentication (2FA) thereafter as a
        mandatory security upgrade.
        <br />
        Your number is:
        <br />
        {isValid ? (
          <>
            <p className="mt-3 mb-0 font-weight-bold">{maskedNumber}</p>
          </>
        ) : (
          <p className="mt-3 mb-0 text-danger">
            At the moment, we cannot find a valid mobile number for your
            account.
          </p>
        )}
      </Label>
      <FormText className="pt-3">
        (If your mobile number is incorrect, please contact your property
        manager or managed Customer Support to update it.)
      </FormText>
      <div className="mt-4 d-flex justify-content-end">
        <Button
          id="logout-user"
          data-testid="logout-user"
          className="mr-2"
          onClick={logout}>
          Logout
        </Button>
        <Button
          className="default-primary-btn"
          id="request-auth-btn"
          disabled={!isValid}
          onClick={verifyPhoneNumber}>
          Enable 2FA
        </Button>
      </div>
    </>
  );
};

Enable2FAOverview.propTypes = {
  phoneNumber: PropTypes.string,
  logout: PropTypes.func.isRequired,
  verifyPhoneNumber: PropTypes.func.isRequired,
};

Enable2FAOverview.defaultProps = {
  phoneNumber: '',
};
