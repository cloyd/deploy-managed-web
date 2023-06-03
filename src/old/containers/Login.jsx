import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import localStorage from 'store';

import { useLocationParams } from '../hooks';
import { BrandLogo } from '../modules/Brand';
import { CardCentered } from '../modules/Card';
import { FormLogin } from '../modules/Form';
import { OauthAppLogin } from '../modules/Oauth';
import { useRolesContext } from '../modules/Profile';
import { hasError } from '../redux/notifier';
import { fetchOauthApp, getOauthAppInfo } from '../redux/oauth';
import { getProfile, isAuthorized, loginUser } from '../redux/profile';
import { Alert } from './Alert';

const LoginComponent = (props) => {
  const { hasError, isAuthorized, isLoading, oauthAppInfo, user } = props;

  const dispatch = useDispatch();

  const { isCorporateUser, isExternalCreditor, isManager, isPrincipal } =
    useRolesContext();

  const params = useLocationParams();
  const { clientId, redirectUri, responseType, state } = params;

  useEffect(() => {
    const { hasTried } = oauthAppInfo;
    if (clientId && !hasTried) {
      dispatch(fetchOauthApp({ clientId }));
    }
  }, [clientId, dispatch, oauthAppInfo]);

  const oauthAuthorizationPath = useMemo(() => {
    let path = `/authorize?client_id=${clientId}`;
    if (redirectUri)
      path = path.concat(`&redirect_uri=${encodeURIComponent(redirectUri)}`);
    path = responseType
      ? path.concat(`&response_type=${responseType}`)
      : path.concat(`&response_type=code`);
    if (state) {
      path = path.concat(`&state=${state}`);
    }
    return path;
  }, [clientId, redirectUri, responseType, state]);

  const handleLoginUser = useCallback(
    (values) => {
      dispatch(loginUser(values));
    },
    [dispatch]
  );

  if (isAuthorized) {
    const redirectTo = clientId
      ? oauthAuthorizationPath
      : localStorage.get('redirectTo');

    const redirectDefault =
      (isPrincipal || isManager) && !isCorporateUser
        ? '/dashboard'
        : isCorporateUser
        ? '/tasks'
        : isExternalCreditor
        ? '/marketplace'
        : '/property';

    localStorage.set('redirectTo');
    user && localStorage.set('userType', user.role);

    return <Redirect to={redirectTo || redirectDefault} />;
  } else if (user.isAuthyEnabled && !user.isThisDeviceRemembered) {
    return <Redirect to="/two-factor-auth" />;
  } else {
    return (
      <CardCentered>
        <BrandLogo className="mb-3">Managed</BrandLogo>
        {oauthAppInfo.isSuccess && (
          <OauthAppLogin oauthAppInfo={oauthAppInfo} />
        )}
        <Alert containerClassName="p-0" />
        <FormLogin
          onSubmit={handleLoginUser}
          hasError={hasError}
          isLoading={isLoading}
        />
        <p
          style={{ left: 0, bottom: '-45px' }}
          className="text-center text-400 m-0 p-0 w-100 position-absolute">
          {import.meta.env.MANAGED_APP_VERSION}
        </p>
      </CardCentered>
    );
  }
};

LoginComponent.propTypes = {
  getOauthAppInfo: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  oauthAppInfo: PropTypes.object,
};

const mapStateToProps = (state) => {
  const user = getProfile(state.profile);

  return {
    hasError: hasError(state),
    isAuthorized: isAuthorized(state.profile),
    isLoading: state.profile.isLoading,
    oauthAppInfo: getOauthAppInfo(state.oauth),
    user,
  };
};

const mapDispatchToProps = {
  getOauthAppInfo,
};

export const Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);
