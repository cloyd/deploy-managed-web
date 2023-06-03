import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import Select from 'react-select';

export const FormFieldSelect = (props) => {
  const { error, onChange, value, isMulti = true, isDisabled } = props;
  const options = props.options || [];

  const handleChange = useCallback(
    (values) => {
      if (onChange) {
        if (isMulti) {
          onChange(values ? values.map((item) => item.value) : []);
        } else {
          onChange(values);
        }
      }
    },
    [isMulti, onChange]
  );

  const formattedValue = useMemo(() => {
    if (!value) return undefined;

    if (isMulti) {
      return value.length > 0
        ? value[0].label
          ? // Return if value items are in the format { label, value }
            value
          : // Else find value items in the list of options
            value.map((item) => options.find((option) => option.value === item))
        : undefined;
    }

    return options.find((option) => option.value === value);
  }, [isMulti, options, value]);

  return (
    <div className={props.className} data-testid={props['data-testid']}>
      <Select
        classNamePrefix="react-select"
        isDisabled={isDisabled || options.length === 0}
        isLoading={props.isLoading}
        isMulti={isMulti}
        onChange={handleChange}
        options={options}
        value={formattedValue}
        aria-label={props['aria-label']}
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            borderColor: error ? '#dc3545' : '#dee2e6',
          }),
        }}
      />
      {error && (
        <p className="text-danger">
          <small>{error}</small>
        </p>
      )}
    </div>
  );
};

FormFieldSelect.propTypes = {
  className: PropTypes.string,
  'data-testid': PropTypes.string,
  'aria-label': PropTypes.string,
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  ariaLabel: PropTypes.string,
  isMulti: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

FormFieldSelect.defaultProps = {
  isMulti: true,
  isDisabled: false,
};
