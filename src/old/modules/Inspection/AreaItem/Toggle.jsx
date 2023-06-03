import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

export const InspectionAreaItemToggle = (props) => (
  <Button
    outline
    className={`text-nowrap px-2 py-1 ${props.className}`}
    color="primary"
    data-testid="button-area-item-toggle"
    onClick={props.onClick}>
    <FontAwesomeIcon icon={['far', 'comment']} />
    <FontAwesomeIcon icon={['far', 'camera']} className="ml-1" />
    {!props.isCompactView && <span className="ml-2">Add Condition</span>}
  </Button>
);

InspectionAreaItemToggle.propTypes = {
  className: PropTypes.string,
  isCompactView: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

InspectionAreaItemToggle.defaultProps = {
  className: '',
  isCompactView: false,
};
