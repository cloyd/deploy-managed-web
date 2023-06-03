import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useMemo } from 'react';
import Select from 'react-select';

import { FilterContext } from './Filter';

export const TypeaheadSelect = ({
  clearKeysOnChange,
  disabled,
  isRequired,
  label,
  name,
  onKeyDown,
  onSelect,
  values,
}) => {
  const { params, actions } = useContext(FilterContext);

  const optionValues = useMemo(() => {
    let options;
    if (label === 'Type') {
      // Assuming that the first Default task TYPE is always Advertising, we split the default tasks and custom tasks to display grouped options.
      // This logic needs to be reviewed if advertising is no more the first default task
      const advertisingIndex =
        (values.length &&
          values.findIndex((value) => value === 'advertising')) ||
        0;
      const customValues = values.length
        ? values.slice(0, advertisingIndex)
        : [];
      const defaultValues = values.length
        ? values.slice(advertisingIndex, values.length)
        : [];

      const defaultOptions = defaultValues.length
        ? defaultValues.map((entry) => ({
            label: entry.label || startCase(entry),
            value: entry.value !== undefined ? entry.value : entry,
          }))
        : [];

      const customOptions = customValues.length
        ? customValues.map((entry) => ({
            label: entry.label || startCase(entry),
            value: entry.value !== undefined ? entry.value : entry,
          }))
        : [];

      options = [
        ...(customValues
          ? [{ label: 'Custom Tasks', options: customOptions }]
          : []),
        { label: 'Default Tasks', options: defaultOptions },
      ];
    } else {
      options = values.map((entry) => ({
        label: entry.label || startCase(entry),
        value: entry.value !== undefined ? entry.value : entry,
      }));
    }

    // If filter has an option selected, add option to clear
    return !isRequired && params[name]
      ? [
          {
            label: '-- Clear Filter --',
            value: '',
          },
          ...options,
        ]
      : options;
  }, [isRequired, label, name, params, values]);

  const selectedValue = useMemo(() => {
    // Check if options are grouped (example: Task Type)
    const options = optionValues.find((option) => option.options?.length)
      ? optionValues.reduce((acc, option) => {
          if (option.options?.length) return acc.concat(option.options);
          else return acc;
        }, [])
      : optionValues;

    return params[name]
      ? options.find((item) => String(item.value) === String(params[name]))
      : null;
  }, [params, name, optionValues]);

  const handleChange = useCallback(
    ({ value }) => {
      let values = { [name]: value };

      if (clearKeysOnChange) {
        values = clearKeysOnChange.reduce(
          (acc, name) => ({ ...acc, [name]: undefined }),
          values
        );
      }

      actions.onChange(values);

      if (onSelect) {
        onSelect(values, actions.onChange);
      }
    },
    [actions, clearKeysOnChange, name, onSelect]
  );

  const handleKeyDown = useCallback(
    (event) => {
      event.stopPropagation();

      if (event.target && event.target.value.length > 1) {
        onKeyDown(event.target.value);
      }
    },
    [onKeyDown]
  );

  return (
    <Select
      name={name}
      onChange={handleChange}
      onKeyDown={onKeyDown && handleKeyDown}
      options={optionValues}
      placeholder={label}
      value={selectedValue}
      isDisabled={disabled}
    />
  );
};

TypeaheadSelect.propTypes = {
  clearKeysOnChange: PropTypes.array,
  disabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onKeyDown: PropTypes.func,
  onSelect: PropTypes.func,
  values: PropTypes.array.isRequired,
  value: PropTypes.string,
};
