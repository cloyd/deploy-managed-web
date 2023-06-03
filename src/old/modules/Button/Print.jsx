import PropTypes from 'prop-types';
import React from 'react';

import { ButtonIcon } from '.';
import { useClassName, usePrint } from '../../hooks';

export const ButtonPrint = ({ children, className, ...props }) => {
  const handleClick = usePrint();
  const classNames = useClassName(['d-print-none'], className);

  return (
    <ButtonIcon
      className={classNames}
      icon={['fas', 'print']}
      onClick={handleClick}
      {...props}>
      {props.children || 'Print'}
    </ButtonIcon>
  );
};

ButtonPrint.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
