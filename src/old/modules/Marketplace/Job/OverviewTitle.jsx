import PropTypes from 'prop-types';
import React from 'react';

export const JobOverviewTitle = ({ address, isEmergency, title }) => {
  return (
    <div className="d-flex flex-column">
      <div className="d-flex align-items-start justify-content-between">
        <h5 className="font-weight-bold text-primary mb-0">{title}</h5>
        {isEmergency && (
          <span className="d-flex badge badge-danger mt-1 ml-2">Emergency</span>
        )}
      </div>
      <small className="opacity-50">{address}</small>
    </div>
  );
};

JobOverviewTitle.propTypes = {
  address: PropTypes.string,
  isEmergency: PropTypes.bool,
  title: PropTypes.string,
};
