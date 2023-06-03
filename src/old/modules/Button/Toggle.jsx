import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { useClassName } from '@app/hooks';

const STYLES = [
  'border-300',
  'btn',
  'p-3 p-lg-5',
  'position-relative',
  'rounded-lg',
  'shadow-sm',
];

const ACTIVE_STYLES = [
  'bg-lavender',
  'border',
  'border-primary',
  'text-primary',
];

export const ButtonToggle = ({
  children,
  className,
  icon,
  isActive,
  onClick,
}) => {
  const defaultClassNames = useMemo(() => {
    if (isActive) {
      return [...STYLES, ...ACTIVE_STYLES];
    } else {
      return [...STYLES];
    }
  }, [isActive]);

  const classNames = useClassName(defaultClassNames, className);

  return (
    <button type="button" className={classNames} onClick={onClick}>
      {isActive && (
        <FontAwesomeIcon
          className="fa-lg ml-2 mt-2 position-absolute position-top position-left"
          icon={['far', 'circle-check']}
        />
      )}
      <FontAwesomeIcon className="fa-4x mb-3" icon={['fal', icon]} />
      <strong className="h5 d-block mb-0">{children}</strong>
    </button>
  );
};

ButtonToggle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.string,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};
