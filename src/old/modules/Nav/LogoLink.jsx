import PropTypes from 'prop-types';
import React from 'react';

import { BrandLogo } from '../Brand';
import { Link } from '../Link';

export const LogoLink = (props) => (
  <Link to="/" className={props.className + ' p-1'}>
    <BrandLogo>Managed</BrandLogo>
  </Link>
);

LogoLink.propTypes = {
  className: PropTypes.string,
};
