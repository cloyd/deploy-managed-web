import PropTypes from 'prop-types';
import React from 'react';
import { Progress } from 'reactstrap';

export const ContentProgressBar = (props) => (
  <div
    className={`rounded-pill overflow-hidden ${props.wrapperClassName}`}
    data-testid="content-progress-bar"
    style={props.wrapperStyle}>
    <Progress
      value={props.value}
      color={props.color}
      className={props.className}
      barClassName={!props.color ? 'bg-primary' : ''}
    />
  </div>
);

ContentProgressBar.propTypes = {
  barClassName: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wrapperClassName: PropTypes.string,
  wrapperStyle: PropTypes.object,
};

ContentProgressBar.defaultProps = {
  className: 'bg-white',
  wrapperClassName: '',
  wrapperStyle: {},
};
