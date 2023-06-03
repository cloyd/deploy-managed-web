import PropTypes from 'prop-types';
import React from 'react';

import { useClassName } from '../../hooks';
import './styles.scss';

export const BrandLogo = (props) => {
  const className = useClassName(['brand-logo'], props.className);

  return (
    <div className={className}>
      <h1 className="sr-only">{props.children}</h1>
    </div>
  );
};

BrandLogo.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
