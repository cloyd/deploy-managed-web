import PropTypes from 'prop-types';
import React from 'react';

export const CardStatisticValue = (props) => (
  <div className="d-flex justify-content-center">
    <div className="h1-font-size">
      {props.children ? props.children : <span>{props.value}</span>}
    </div>
  </div>
);

CardStatisticValue.propTypes = {
  children: PropTypes.node,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ]),
};

CardStatisticValue.defaultProps = {
  value: '',
};
