import PropTypes from 'prop-types';
import React from 'react';

import { Link } from '../../Link';

export const ReportCardsLinkValue = ({ title, to, value, className }) =>
  typeof value === 'string' || value > 0 ? (
    <Link to={to} title={title} className={`h1-font-size ${className}`}>
      {value}
    </Link>
  ) : (
    <span className={`text-dark h1-font-size ${className}`}>{value}</span>
  );

ReportCardsLinkValue.propTypes = {
  title: PropTypes.string,
  to: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  className: PropTypes.string,
};

ReportCardsLinkValue.defaultProps = {
  className: '',
};
