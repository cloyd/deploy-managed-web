import kebabCase from 'lodash/fp/kebabCase';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { useClassName } from '@app/hooks';

export const TaskOverviewDetail = ({ title, value, ...props }) => {
  const className = useClassName(['w-100'], props.className);

  const values = useMemo(() => {
    if (typeof value === 'boolean') {
      return [value ? 'Yes' : 'No'];
    } else if (typeof value === 'string') {
      return [value];
    } else if (!value?.length) {
      return ['-'];
    } else {
      return value;
    }
  }, [value]);

  return (
    <p className={className}>
      <strong>{title}</strong>
      {values.map((value, index) => {
        return (
          <span className="d-block" key={`${kebabCase(title)}-${index}`}>
            {value}
          </span>
        );
      })}
    </p>
  );
};

TaskOverviewDetail.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.bool,
  ]),
  className: PropTypes.string,
};
