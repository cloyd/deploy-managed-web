import PropTypes from 'prop-types';
import React from 'react';

import './style.scss';

export const Switch = ({
  disabled,
  label,
  value,
  handleChange,
  className,
  isShowLabelFirst,
  id,
}) => {
  const style = disabled ? 'pe-none' : 'pointer';

  return (
    <>
      {isShowLabelFirst && (
        <label className={`${style} m-0`} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={`${className} custom-control custom-switch`}>
        <input
          type="checkbox"
          className={`${style} custom-control-input`}
          id={id}
          disabled={disabled}
          onChange={handleChange}
          checked={value}
        />
        <label className={`${style} custom-control-label`} htmlFor={id}>
          {isShowLabelFirst ? '' : label}
        </label>
      </div>
    </>
  );
};

Switch.propTypes = {
  // eslint-disable-next-line react/boolean-prop-naming
  value: PropTypes.bool,
  isShowLabelFirst: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
};
Switch.defaultProps = {
  disabled: false,
  value: false,
  className: '',
};
