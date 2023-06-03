import PropTypes from 'prop-types';
import React from 'react';

export const DividerDouble = (props) => (
  <div className={props.className}>
    <hr className="my-0" />
    <hr style={{ marginTop: '1px' }} />
  </div>
);

DividerDouble.propTypes = {
  className: PropTypes.string,
};
