import PropTypes from 'prop-types';
import React from 'react';

export const CardStatisticTitle = (props) => (
  <div className={props.className}>
    <h4 className="mb-0" style={{ minHeight: '3.6rem' }}>
      {props.title}
    </h4>
  </div>
);

CardStatisticTitle.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
};

CardStatisticTitle.defaultProps = {
  className: 'd-flex justify-content-center text-center',
  title: '',
};
