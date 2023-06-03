import PropTypes from 'prop-types';
import React from 'react';

import './styles.scss';

export const OauthAppLogo = (props) => {
  const { logoUrl } = props;
  return (
    <div
      className="oauth-app-logo"
      style={{
        backgroundImage: `url(${logoUrl})`,
      }}
    />
  );
};

OauthAppLogo.propTypes = {
  logoUrl: PropTypes.string,
};
