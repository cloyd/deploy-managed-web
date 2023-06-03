import PropTypes from 'prop-types';
import React from 'react';

import { OauthAppLogo } from './AppLogo';
import './styles.scss';

export const OauthAppLogin = (props) => {
  const { logoUrl, name: oauthAppName } = props.oauthAppInfo;
  return (
    <div>
      <p>Please login to authorize {oauthAppName} to access your data.</p>
      {logoUrl && <OauthAppLogo logoUrl={logoUrl} />}
    </div>
  );
};

OauthAppLogin.propTypes = {
  oauthAppInfo: PropTypes.object,
};
