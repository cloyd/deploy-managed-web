import PropTypes from 'prop-types';
import React from 'react';

import { useClassName } from '../../hooks';

export const HeaderTitle = (props) => {
  const className = useClassName(
    ['m-0', 'text-capitalize', 'text-primary'],
    props.className
  );

  return (
    <h3 className={className} data-testid="header-title">
      {props.children || props.title}
    </h3>
  );
};

HeaderTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string,
};

HeaderTitle.defaultProps = {
  className: '',
};
