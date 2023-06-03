import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from 'reactstrap';

import { useClassName } from '../../hooks';

export const Link = ({ children, className, ...props }) => {
  const linkClassName = useClassName(
    props.color === 'link' ? ['p-0', 'align-baseline'] : [],
    className
  );

  return (
    <Button
      tag={props.href ? 'a' : RouterLink}
      className={linkClassName}
      {...props}>
      {children}
    </Button>
  );
};

Link.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.node,
  color: PropTypes.string,
  href: PropTypes.string,
  to: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

Link.defaultProps = {
  className: '',
  color: 'link',
  to: '#',
};
