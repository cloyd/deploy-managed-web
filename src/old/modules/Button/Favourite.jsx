import PropTypes from 'prop-types';
import React from 'react';

import { ButtonIcon } from '.';

export const ButtonFavourite = (props) => (
  <ButtonIcon
    className={props.className}
    color="warning"
    icon={[props.isActive ? 'fas' : 'far', 'star']}
    onClick={props.onClick}
  />
);

ButtonFavourite.propTypes = {
  className: PropTypes.string,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};
