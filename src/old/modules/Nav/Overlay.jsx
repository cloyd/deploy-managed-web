import PropTypes from 'prop-types';
import React from 'react';
import { Container } from 'reactstrap';

import { useIsMobile } from '@app/hooks';

export const NavOverlay = ({ children, ...props }) => {
  const isMobile = useIsMobile();

  return (
    <div
      className="d-flex align-items-center fixed-bottom w-100 bg-white border-top"
      style={{ minHeight: '80px', paddingLeft: !isMobile && '14.375rem' }}
      {...props}>
      <Container>{children}</Container>
    </div>
  );
};

NavOverlay.propTypes = {
  children: PropTypes.node,
};
