import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { ButtonIcon } from '.';
import { useClassName } from '../../hooks';

export const ButtonDownload = ({
  className,
  onClick,
  options,
  title,
  ...props
}) => {
  const handleClick = useCallback(() => onClick(options), [options, onClick]);

  return (
    <ButtonIcon
      className={useClassName(['d-print-none'], className)}
      icon={['far', 'file-download']}
      onClick={onClick && handleClick}
      {...props}>
      Download <span className="text-uppercase">{title}</span> file
    </ButtonIcon>
  );
};

ButtonDownload.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  options: PropTypes.object,
  title: PropTypes.string,
};
