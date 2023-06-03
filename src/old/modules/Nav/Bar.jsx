import PropTypes from 'prop-types';
import React from 'react';
import { Navbar } from 'reactstrap';

import { useIsMobile } from '../../hooks';

export const NavBar = ({ children, isOpen }) => {
  const isMobile = useIsMobile();

  return (
    <Navbar
      light
      className={`shadow-sm px-0 bg-light align-items-start ${
        isMobile
          ? `${isOpen ? 'fadeIn' : 'fadeOut'} position-absolute w-100`
          : 'sticky-top'
      }`}
      style={{
        zIndex: 1040,
      }}>
      {children}
    </Navbar>
  );
};

NavBar.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool,
};
