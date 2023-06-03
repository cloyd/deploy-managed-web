import PropTypes from 'prop-types';
import React from 'react';

import { CardPlain, CardStatisticTitle, CardStatisticValue } from '..';

export const CardStatistic = ({ children, className, statistic, title }) => {
  return (
    <CardPlain className={className} classNameInner="p-3">
      <CardStatisticTitle title={title} />
      {typeof statistic !== 'undefined' && (
        <CardStatisticValue value={statistic} />
      )}
      {children && <div className="text-center">{children}</div>}
    </CardPlain>
  );
};

CardStatistic.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  statistic: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ]),
  title: PropTypes.string,
};
