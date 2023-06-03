import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupButtonDropdown,
} from 'reactstrap';

import { FormLabel } from '.';
import { useIsOpen } from '../../hooks';
import { disableScroll } from '../../utils';

export const FormDropdownInput = ({
  className,
  dropdownOptions,
  dropdownName,
  dropdownValue,
  error,
  name,
  label,
  handleChange,
  handleDropdownChange,
  handleBlur,
  isRequired,
  isTouched,
  type,
  value,
  ...props
}) => {
  const [isOpen, actions] = useIsOpen();
  const { handleToggle } = actions;

  const onDropdownChange = useCallback(
    (e) => {
      handleDropdownChange(dropdownName, e.currentTarget.textContent);
    },
    [dropdownName, handleDropdownChange]
  );

  const renderDropdownItem = (key, index, item) => (
    <DropdownItem key={`${key}-${index}`} onClick={onDropdownChange}>
      {item}
    </DropdownItem>
  );

  const renderDropdown = (key) => (item, index) =>
    renderDropdownItem(key, index, item);

  return (
    <div className={className}>
      <FormLabel for="name" className="ml-1" isRequired={isRequired}>
        {label}
      </FormLabel>
      <InputGroup>
        <InputGroupButtonDropdown
          data-testid={`field-${name}-select`}
          addonType="prepend"
          isOpen={isOpen}
          toggle={handleToggle}>
          <DropdownToggle color="primary" caret>
            {dropdownValue || 'Select'}
          </DropdownToggle>
          <DropdownMenu>
            {dropdownOptions.map(renderDropdown(name))}
          </DropdownMenu>
        </InputGroupButtonDropdown>
        <Input
          id={name}
          type={type || 'text'}
          value={value}
          invalid={isTouched && !!error}
          valid={isTouched && !error}
          onChange={handleChange}
          onBlur={handleBlur}
          onWheel={disableScroll}
          {...props}
        />
        {error && <FormFeedback>{error}</FormFeedback>}
      </InputGroup>
    </div>
  );
};

FormDropdownInput.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  dropdownOptions: PropTypes.array.isRequired,
  dropdownValue: PropTypes.any,
  dropdownName: PropTypes.string.isRequired,
  error: PropTypes.string,
  handleDropdownChange: PropTypes.func.isRequired,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  id: PropTypes.string,
  isRequired: PropTypes.bool,
  isTouched: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.any,
};
