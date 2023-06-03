import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Button } from 'reactstrap';

import { useClassName } from '@app/hooks';

export const TaskStatusBarButton = ({
  isSelected,
  isCurrent,
  isDisabled,
  onClick,
  status,
}) => {
  const icon = useMemo(() => {
    if (isSelected) {
      return ['fas', 'check-circle'];
    } else {
      return ['far', 'circle'];
    }
  }, [isSelected]);

  const color = useMemo(() => {
    if (isCurrent) {
      return 'text-success active';
    } else if (isSelected) {
      return 'text-success';
    } else {
      return 'text-white';
    }
  }, [isSelected, isCurrent]);

  const className = useClassName(['status-icon', 'text-center'], color);

  return (
    <Button color="link" disabled={isDisabled} onClick={onClick}>
      <span className={className}>
        <FontAwesomeIcon
          size="lg"
          icon={icon}
          className="mb-1 rounded-circle"
        />
      </span>
      <h6 className="text-center text-dark small">{startCase(status)}</h6>
    </Button>
  );
};

TaskStatusBarButton.propTypes = {
  isCurrent: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  status: PropTypes.string,
};
