import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { Alert } from '@app/containers';
import { hideAlert } from '@app/redux/notifier';

import {
  enableAuthy,
  logoutUser,
  selectProfileData,
  selectProfileEmail,
  selectProfilePhoneNumber,
} from '../../redux/profile';
import { BrandLogo } from '../Brand';
import { CardCentered } from '../Card';
import Form from '../SmsVerification/Form';
import useSendSecurityCode from '../SmsVerification/use-send-security-code';
import { Enable2FAConfirmation } from './Enable2FAConfirmation';
import { Enable2FAOverview } from './Enable2FAOverview';
import './styles.scss';

export const Enable2FA = () => {
  const dispatch = useDispatch();
  const userEmail = useSelector(selectProfileEmail);
  const phoneNumber = useSelector(selectProfilePhoneNumber);
  const isForcedLogout = useSelector((state) => state.profile?.isForced);
  const { isEnable2faOnLoginEnabled } = useSelector(selectProfileData);
  const [step, setStep] = useState('OVERVIEW');

  const { mutate, isLoading, isSuccess } = useSendSecurityCode();

  useEffect(() => {
    if (isForcedLogout) {
      setStep('CONFIRMATION');
    }
  }, [isForcedLogout]);

  const requestSecurityCode = useCallback(() => {
    mutate({ email: userEmail });
  }, [mutate, userEmail]);

  const verify = useCallback(
    ({ securityCode }) => {
      dispatch(hideAlert());
      dispatch(
        enableAuthy({
          authyToken: securityCode,
          isForced: true,
        })
      );
    },
    [dispatch]
  );

  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);

  const verifyPhoneNumber = useCallback(() => {
    setStep('VERIFICATION');
    requestSecurityCode();
  }, [requestSecurityCode]);

  const renderModalContent = () => {
    switch (step) {
      case 'VERIFICATION':
        return (
          <Form
            onSubmit={verify}
            isRequestingSecurityCode={isLoading}
            requestSecurityCode={requestSecurityCode}
            isSecurityCodeSuccess={isSuccess}
            useDefaultTheme
          />
        );
      case 'CONFIRMATION':
        return <Enable2FAConfirmation />;
      case 'OVERVIEW':
      default:
        return (
          <Enable2FAOverview
            verifyPhoneNumber={verifyPhoneNumber}
            phoneNumber={phoneNumber}
            logout={logout}
          />
        );
    }
  };

  if (!isEnable2faOnLoginEnabled) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <CardCentered cardWidth="380px" className="enable-2fa-container">
        <BrandLogo className="mb-3 default-managed-brand-logo">
          Managed
        </BrandLogo>
        <Alert containerClassName="p-0" />
        {renderModalContent()}
      </CardCentered>
    </>
  );
};

Enable2FA.propTypes = {
  modalState: PropTypes.object,
  toggle: PropTypes.func,
};
