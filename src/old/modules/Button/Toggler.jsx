import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { useClassName } from '@app/hooks';
import { ButtonIcon } from '@app/modules/Button';

export const ButtonToggler = ({ children, className, isActive, ...props }) => {
  const icon = useMemo(() => {
    return ['far', `chevron-${isActive ? 'up' : 'down'}`];
  }, [isActive]);

  const classNames = useClassName(['p-0'], className);

  return (
    <ButtonIcon icon={icon} className={classNames} {...props}>
      {children}
    </ButtonIcon>
  );
};

ButtonToggler.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
};
