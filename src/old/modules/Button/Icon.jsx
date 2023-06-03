import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Button } from 'reactstrap';

import { useClassName } from '@app/hooks';

export const ButtonIcon = ({
  buttonColor,
  children,
  className,
  direction,
  icon,
  iconStyle,
  isReverse,
  color,
  size,
  ...props
}) => {
  const textColor = useMemo(() => {
    return `text-${color}`;
  }, [color]);

  const buttonClassNames = useMemo(() => {
    const classNames = [textColor, 'd-flex', 'align-items-center'];
    const append = isReverse ? '-reverse' : '';

    if (direction === 'column') {
      classNames.push(`flex-column${append}`);
    } else {
      classNames.push(`flex-row${append}`);
    }

    return classNames;
  }, [textColor, direction, isReverse]);

  const iconClassNames = useMemo(() => {
    const classNames = [];

    if (direction === 'column') {
      classNames.push(isReverse ? 'mt-1' : 'mb-1');
    } else {
      classNames.push(isReverse ? 'ml-1' : 'mr-1');
    }

    return classNames;
  }, [direction, isReverse]);

  const classNameButton = useClassName(buttonClassNames, className);
  const classNameIcon = useClassName(iconClassNames, textColor);

  return (
    <Button className={classNameButton} color={buttonColor} {...props}>
      <FontAwesomeIcon
        className={classNameIcon}
        icon={icon}
        size={size}
        style={iconStyle}
      />
      {children}
    </Button>
  );
};

ButtonIcon.propTypes = {
  buttonColor: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  direction: PropTypes.oneOf(['row', 'column']),
  icon: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]).isRequired,
  iconStyle: PropTypes.object,
  isReverse: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.string,
};

ButtonIcon.defaultProps = {
  buttonColor: 'link',
  color: 'task-title',
  direction: 'row',
  size: '1x',
  isReverse: false,
};
