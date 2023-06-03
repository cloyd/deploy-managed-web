import PropTypes from 'prop-types';
import React from 'react';
import { Container } from 'reactstrap';

import { NavBar } from '.';
import { BrandLogo } from '../Brand';
import { Link } from '../Link';

export const NavPlain = ({ children }) => (
  <NavBar>
    <Container className="position-relative">
      <Link to="/" className="d-flex">
        <BrandLogo>Managed</BrandLogo>
      </Link>
      {children}
    </Container>
  </NavBar>
);

NavPlain.propTypes = {
  children: PropTypes.node,
};
