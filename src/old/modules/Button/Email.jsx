import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

import { ButtonIcon } from '.';

export const ButtonEmail = ({ onClick, ...props }) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleClick = useCallback(() => {
    onClick();
    setHasSubmitted(true);
  }, [onClick, setHasSubmitted]);

  return hasSubmitted ? (
    <ButtonIcon icon={['far', 'check']}>Report on the way</ButtonIcon>
  ) : (
    <ButtonIcon icon={['far', 'paper-plane']} onClick={handleClick}>
      Email report
    </ButtonIcon>
  );
};

ButtonEmail.propTypes = {
  onClick: PropTypes.func,
};
