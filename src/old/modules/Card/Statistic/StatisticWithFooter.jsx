import PropTypes from 'prop-types';
import React from 'react';

import { CardPlain, CardStatisticTitle, CardStatisticValue } from '..';

export const CardStatisticWithFooter = ({
  children,
  className,
  statistic,
  title,
}) => {
  return (
    <CardPlain className={className} classNameInner="p-3">
      <CardStatisticTitle title={title} />
      {typeof statistic !== 'undefined' && (
        <CardStatisticValue value={statistic} />
      )}
      {children && <div className="mt-3 pt-3 border-top">{children}</div>}
    </CardPlain>
  );
};

CardStatisticWithFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  statistic: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ]),
  title: PropTypes.string,
};
