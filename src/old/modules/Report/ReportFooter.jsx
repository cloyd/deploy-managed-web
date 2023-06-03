import PropTypes from 'prop-types';
import React from 'react';

export const ReportFooter = ({ information }) => (
  <div className="report-footer">
    {information.map(({ label, value }) => (
      <div key={`footer-info-${label}`}>
        <span>{label}&nbsp;</span>
        <span>{value}</span>
      </div>
    ))}
  </div>
);

ReportFooter.propTypes = {
  information: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};
ReportFooter.defaultProps = {
  information: [],
};
