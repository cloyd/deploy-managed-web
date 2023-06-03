import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BrandLogo } from '../modules/Brand';
import { CardCentered } from '../modules/Card';
import { useSendSecurityCode } from '../modules/SmsVerification';
import Form from '../modules/SmsVerification/Form';
import { selectProfileData, verifyAuthy } from '../redux/profile';
import { Alert } from './Alert';

export const TwoFactorAuth = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectProfileData);
  const { isLoadingUser, email } = user;

  const { mutate, isLoading, isSuccess } = useSendSecurityCode();

  const requestSecurityCode = useCallback(() => {
    mutate({ email });
  }, [mutate, email]);

  const verify = useCallback(
    ({ securityCode }) => {
      dispatch(verifyAuthy({ authyToken: securityCode, email }));
    },
    [dispatch, email]
  );

  useEffect(() => {
    if (email) {
      requestSecurityCode();
    }
  }, [email, requestSecurityCode]);

  if (user.isAuthyVerified) {
    window.location.assign('/dashboard');
  } else if (user.email === undefined) {
    window.location.assign('/');
  }

  return (
    <>
      <CardCentered cardWidth="380px">
        <BrandLogo className="mb-3">Managed</BrandLogo>
        <Alert containerClassName="p-0" />
        <Form
          onSubmit={verify}
          isRequestingSecurityCode={isLoading || isLoadingUser}
          requestSecurityCode={requestSecurityCode}
          isSecurityCodeSuccess={isSuccess}
        />
      </CardCentered>
    </>
  );
};
