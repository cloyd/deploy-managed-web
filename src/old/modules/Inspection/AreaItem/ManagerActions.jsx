import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Button } from 'reactstrap';

export const InspectionAreaItemManagerActions = (props) => {
  const handleClick = useCallback(
    () => props.onClick(!props.isActive),
    [props]
  );

  return (
    <Button
      active={props.isActive === true}
      className="text-nowrap ml-2 px-2 py-1"
      color="primary"
      data-testid="button-manager-check"
      outline
      onClick={handleClick}>
      <FontAwesomeIcon icon={['far', 'check']} />
    </Button>
  );
};

InspectionAreaItemManagerActions.propTypes = {
  isActive: PropTypes.bool,
  isCompactView: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

InspectionAreaItemManagerActions.defaultProps = {
  isCompactView: false,
};
