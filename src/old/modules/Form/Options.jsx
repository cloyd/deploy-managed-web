import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React from 'react';

const taskFormattedOptions = (values) => {
  let advertisingIndex =
    values.length > 0 && values.findIndex((value) => value === 'advertising');
  let customValues = values.length > 0 && values.slice(0, advertisingIndex);
  let defaultValues =
    values.length > 0 && values.slice(advertisingIndex, values.length);
  return customValues.length > 0
    ? ['CUSTOM TASKS', ...customValues, 'DEFAULT TASKS', ...defaultValues]
    : ['DEFAULT TASKS', ...defaultValues];
};

// Grouped form options
export const FormOptionsGroup = ({ label, options }) => (
  <optgroup label={label}>
    {options.map((option, index) => (
      <FormOption key={`${option.value || option}-${index}`} option={option} />
    ))}
  </optgroup>
);

FormOptionsGroup.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.object, PropTypes.string])
  ),
};

FormOptionsGroup.defaultProps = {
  options: [],
};

// List of form options
export const FormOptionsList = ({ blankText, hasBlank, options, name }) => (
  <>
    {hasBlank && <option value="">{blankText}</option>}
    {name === 'type'
      ? taskFormattedOptions(options).map((option, index) => (
          <FormOption
            key={`${option.value || option}-${index}`}
            option={option}
            disabled={option === 'DEFAULT TASKS' || option === 'CUSTOM TASKS'}
          />
        ))
      : options.map((option, index) => (
          <FormOption
            key={`${option.value || option}-${index}`}
            option={option}
          />
        ))}
  </>
);

FormOptionsList.propTypes = {
  blankText: PropTypes.string,
  hasBlank: PropTypes.bool,
  name: PropTypes.string,
  options: PropTypes.array,
};

FormOptionsList.defaultProps = {
  blankText: '-- Select --',
  hasBlank: false,
  options: [],
};

// Single form option
const FormOption = (props) => {
  const { option, disabled = false } = props;
  const { label, value } = option.value
    ? option
    : { label: startCase(option), value: option };

  return (
    <option value={value} disabled={disabled}>
      {label}
    </option>
  );
};

FormOption.propTypes = {
  option: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  disabled: PropTypes.bool,
};
