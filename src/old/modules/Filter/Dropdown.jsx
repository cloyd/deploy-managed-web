import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

import { useIsOpen } from '../../hooks';

const toSelectedLabel = (value) => (defaultValue, item) =>
  item.value && String(item.value) === String(value)
    ? item.label
    : String(item) === String(value)
    ? value
    : defaultValue;

export const FilterDropdown = ({
  isRightMenu,
  label,
  onChange,
  value,
  values,
}) => {
  const [active, setActive] = useState(label);
  const [isOpen, actions] = useIsOpen();
  const { handleToggle } = actions;

  const handleChange = useCallback(
    (value) => () => onChange(value),
    [onChange]
  );

  useEffect(() => {
    setActive(values.reduce(toSelectedLabel(value), label));
  }, [label, value, values]);

  return (
    <Dropdown isOpen={isOpen} toggle={handleToggle}>
      <DropdownToggle
        disabled={values.length < 1}
        className="d-flex align-items-center justify-content-between page-link bg-white text-dark text-capitalize w-100"
        color="outline"
        caret>
        {startCase(active)}
      </DropdownToggle>
      <DropdownMenu right={isRightMenu}>
        {label !== active && (
          <>
            <DropdownItem onClick={handleChange()}>
              {startCase(label)}
            </DropdownItem>
            <DropdownItem divider />
          </>
        )}
        {values.map((item, index) => (
          <DropdownItem
            key={`filter-${index}`}
            onClick={handleChange(item.value || item)}
            disabled={value === (item.value || item)}>
            {startCase(item.label || item)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

FilterDropdown.propTypes = {
  isRightMenu: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  values: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
      }),
    ])
  ),
  onChange: PropTypes.func.isRequired,
};

FilterDropdown.defaultProps = {
  label: 'Show All',
  value: '',
  values: [],
};
