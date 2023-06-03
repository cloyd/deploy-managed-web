import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Input } from 'reactstrap';

export const ReportOverviewInputMultiple = (props) => {
  const { className, defaultValue, onChange, title } = props;

  const handleChange = useCallback(
    (e) => {
      if (e.target) {
        onChange(Number(e.target.value));
      }
    },
    [onChange]
  );

  return (
    <div className={className}>
      <span className="text-nowrap mr-3">{title}</span>
      <Input
        step="any"
        type="number"
        style={{ minWidth: 0 }}
        defaultValue={defaultValue}
        onChange={handleChange}
      />
    </div>
  );
};

ReportOverviewInputMultiple.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  title: PropTypes.string,
};

ReportOverviewInputMultiple.defaultProps = {
  className: '',
  defaultValue: 1,
  title: 'Enter multiple',
};
