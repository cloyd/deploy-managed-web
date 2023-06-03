import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { ButtonIcon } from '@app/modules/Button';

export const TaskBackButton = ({ className }) => {
  const history = useHistory();

  const handleClick = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <ButtonIcon
      className="p-0"
      icon={['far', 'chevron-left']}
      onClick={handleClick}>
      Back
    </ButtonIcon>
  );
};

TaskBackButton.defaultProps = {
  className: 'p-0',
};

TaskBackButton.propTypes = {
  className: PropTypes.string,
};
