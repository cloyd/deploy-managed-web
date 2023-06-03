import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Button } from 'reactstrap';

export const InspectionAreaItemTenantActions = (props) => {
  const handleClick = useCallback(
    (value) => () => props.onClick(value === props.isActive ? null : value),
    [props]
  );

  return (
    <>
      <Button
        active={props.isActive === true}
        className="text-nowrap px-2 py-1 ml-2"
        color="primary"
        data-testid="button-tenant-check-yes"
        outline
        title="Yes"
        onClick={handleClick(true)}>
        <FontAwesomeIcon icon={['far', 'check']} />
        {!props.isCompactView && <span className="ml-2">Yes</span>}
      </Button>
      <Button
        active={props.isActive === false}
        className="text-nowrap px-2 py-1 ml-2"
        color="primary"
        data-testid="button-tenant-check-no"
        outline
        title="No"
        onClick={handleClick(false)}>
        <FontAwesomeIcon icon={['far', 'times']} className="mx-1" />
        {!props.isCompactView && <span className="ml-2">No</span>}
      </Button>
    </>
  );
};

InspectionAreaItemTenantActions.propTypes = {
  isActive: PropTypes.bool,
  isCompactView: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

InspectionAreaItemTenantActions.defaultProps = {
  isCompactView: false,
};
