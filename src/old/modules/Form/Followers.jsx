import PropTypes from 'prop-types';
import React from 'react';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Select from 'react-select';

import { DEFAULT_FOLLOWERS } from '../../redux/task';

export const options = [
  ...DEFAULT_FOLLOWERS,
  { label: 'Owners', value: 'owners' },
  { label: 'Tenants', value: 'tenants' },
];

const styles = Object.freeze({
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, backgroundColor: '#6c757d' } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, fontWeight: 'bold', color: 'white', paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: 'none' } : base;
  },
});

export const FormFollowers = ({ value, ...props }) => (
  <Select
    closeMenuOnSelect={false}
    value={value}
    options={options}
    isClearable={value.length > 1}
    isMulti
    styles={styles}
    {...props}
  />
);

FormFollowers.propTypes = {
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.array,
};
