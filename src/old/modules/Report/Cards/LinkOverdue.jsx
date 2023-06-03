import PropTypes from 'prop-types';
import React from 'react';

import { toClassName } from '../../../utils';
import { Link } from '../../Link';

const classOverdue = (value) => {
  return value > 10
    ? 'text-danger'
    : value > 0
    ? 'text-warning'
    : 'text-success';
};

export const ReportCardsLinkOverdue = ({ className, title, to, value }) => {
  const classColor = classOverdue(value);

  return (
    <p className={toClassName(['text-center mb-0'], className)}>
      {value > 0 ? (
        <Link to={to} title={title}>
          <span className={classColor}>Overdue: {value}</span>
        </Link>
      ) : (
        <span className={classColor}>Overdue: {value}</span>
      )}
    </p>
  );
};

ReportCardsLinkOverdue.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  to: PropTypes.string,
  value: PropTypes.number,
};
