import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Card, Col, Container, Row } from 'reactstrap';

import { useLocationParams } from '../hooks';
import { BrandLogo } from '../modules/Brand';
import { ButtonApprove, ButtonCancel, ButtonIcon } from '../modules/Button';
import { AuthorizationError, OauthAppLogo } from '../modules/Oauth';
import {
  authorizeOauthApp,
  fetchOauthApp,
  getAppAuthorization,
  getOauthAppInfo,
} from '../redux/oauth';
import { isAuthorized } from '../redux/profile';
import { Alert } from './Alert';

const AuthorizeOauthAppComponent = (props) => {
  const {
    authorizeOauthApp,
    fetchOauthApp,
    isAuthorized,
    oauthAppInfo,
    oauthAuthorization,
  } = props;

  const { logoUrl, name: oauthAppName } = oauthAppInfo;

  const params = useLocationParams();
  const { clientId, redirectUri, responseType = 'code', state } = params;

  const [invalidClientId, setInvalidClientId] = useState(false);
  const [invalidRedirtectUri, setInvalidRedirtectUri] = useState(false);
  const [rejectedAuthorization, setRejectedAuthorization] = useState(false);

  const oauthParams = useMemo(() => {
    return { clientId, redirectUri, responseType };
  }, [clientId, redirectUri, responseType]);

  const oauthLoginPath = useMemo(() => {
    let path = `/?client_id=${clientId}`;
    if (redirectUri) path = path.concat(`&redirect_uri=${redirectUri}`);
    if (responseType) path = path.concat(`&response_type=${responseType}`);
    if (state) path = path.concat(`&state=${state}`);
    return path;
  }, [clientId, redirectUri, responseType, state]);

  useEffect(() => {
    const { hasTried, isSuccess } = oauthAppInfo;

    if (clientId) {
      if (!hasTried) {
        fetchOauthApp({ clientId });
      } else if (hasTried && !isSuccess) {
        setInvalidClientId(true);
      } else if (
        hasTried &&
        isSuccess &&
        !oauthAppInfo.redirectUri.split('\r\n').includes(redirectUri)
      ) {
        setInvalidRedirtectUri(true);
      }
    }
  }, [clientId, fetchOauthApp, oauthAppInfo, redirectUri]);

  useEffect(() => {
    if (oauthAuthorization.redirectUri) {
      let authorizedRedirectUri = oauthAuthorization.redirectUri;
      if (state)
        authorizedRedirectUri = authorizedRedirectUri.concat(`&state=${state}`);

      setTimeout(() => window.location.assign(authorizedRedirectUri), 5000);
    }
  }, [oauthAuthorization.redirectUri, state]);

  const authMessage = useMemo(() => {
    return oauthAuthorization.redirectUri
      ? `You have authorised ${oauthAppName} to access your data on ManagedApp. You will be redirected back to ${oauthAppName} shortly.`
      : invalidClientId
      ? 'The client ID provided does not match our records.'
      : invalidRedirtectUri
      ? `The redirect_uri provided for ${oauthAppName} to access your data on ManagedApp, does not match our records.`
      : rejectedAuthorization
      ? `You have decided not to allow ${oauthAppName} to access your data on ManagedApp. You will be redirected to your dashboard shortly.`
      : undefined;
  }, [
    invalidClientId,
    invalidRedirtectUri,
    oauthAppName,
    oauthAuthorization.redirectUri,
    rejectedAuthorization,
  ]);

  const handleAuthorize = useCallback(() => {
    authorizeOauthApp({ oauthParams });
  }, [authorizeOauthApp, oauthParams]);

  const handeReject = useCallback(() => {
    setRejectedAuthorization(true);
    setTimeout(() => window.location.assign('/'), 5000);
  }, [setRejectedAuthorization]);

  if (isAuthorized) {
    return (
      <Container fluid className={`h-100`}>
        <Row className="justify-content-center h-100">
          <Col xs="auto" className="d-flex align-items-center">
            <Card className="p-4 shadow-sm" style={{ width: '400px' }}>
              <div className="d-flex flex-row justify-content-between">
                <BrandLogo className="oauth-brand-logo">Managed</BrandLogo>

                <ButtonIcon
                  className="oauth-integration-arrow"
                  icon={['far', 'long-arrow-right']}
                  size={'2x'}
                  color="gray-900"
                  buttonColor="default"
                />
                <ButtonIcon
                  className="oauth-integration-cogs"
                  icon={['far', 'cogs']}
                  size={'2x'}
                  color={'gray-900'}
                  buttonColor="default"
                />

                <OauthAppLogo logoUrl={logoUrl} style={{ width: '90%' }} />
              </div>
              {authMessage ? (
                <AuthorizationError message={authMessage} />
              ) : (
                <div>
                  <Alert containerClassName="p-0" />
                  <p>
                    Do you wish to allow {oauthAppName} to access your data on
                    ManagedApp?
                  </p>
                  <div className="d-flex flex-row justify-content-between">
                    <ButtonCancel onClick={handeReject}>No</ButtonCancel>
                    <ButtonApprove onClick={handleAuthorize}>
                      Yes!
                    </ButtonApprove>
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
        <Row />
      </Container>
    );
  } else if (clientId) {
    return <Redirect to={oauthLoginPath} />;
  } else {
    return <Redirect to={`/`} />;
  }
};

AuthorizeOauthAppComponent.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  oauthAppInfo: PropTypes.object.isRequired,
  oauthAuthorization: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    isAuthorized: isAuthorized(state.profile),
    oauthAppInfo: getOauthAppInfo(state.oauth),
    oauthAuthorization: getAppAuthorization(state.oauth),
  };
};

const mapDispatchToProps = {
  authorizeOauthApp,
  fetchOauthApp,
  getAppAuthorization,
};

export const AuthorizeOauthApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorizeOauthAppComponent);
