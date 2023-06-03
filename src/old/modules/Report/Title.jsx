import PropTypes from 'prop-types';
import React from 'react';

export const ReportTitle = ({ children, ...props }) => {
  return <p className="h4-font-size my-4 ml-2">{children}</p>;
};

ReportTitle.propTypes = {
  children: PropTypes.string,
};
