import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { ButtonIcon } from '.';
import { datePlusOneWeek, formatDate, isInPast } from '../../utils';

export const ButtonSnooze = (props) => {
  const handleClick = useCallback(() => {
    props.onClick && props.onClick('dueDate', formatDate(datePlusOneWeek()));
  }, [props]);

  return (
    isInPast(props.dueDate) && (
      <ButtonIcon
        className="p-0 text-right d-flex"
        color="muted"
        icon={['far', 'snooze']}
        onClick={handleClick}>
        <div className="small">Snooze</div>
      </ButtonIcon>
    )
  );
};

ButtonSnooze.propTypes = {
  className: PropTypes.string,
  dueDate: PropTypes.string,
  onClick: PropTypes.func,
};
