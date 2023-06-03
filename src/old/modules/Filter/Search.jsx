import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  UncontrolledDropdown,
} from 'reactstrap';

import { findItemByValue } from '.';

export const FilterSearch = (props) => {
  const { isRightDropdown, label, onClick, onChange, options, value } = props;
  const hasOptions = options && options.length > 0;

  const [inputFieldText, setInputFieldText] = useState('');
  const innerRef = useRef(null);

  const handleChange = useCallback(() => {
    const { value } = innerRef.current;
    setInputFieldText(value);
    onChange(value);
  }, [onChange]);

  const handleClick = useCallback(
    ({ label, value }) =>
      () => {
        setInputFieldText(label);
        onClick(value);
      },
    [onClick]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (hasOptions && value) {
      const optionsItem = findItemByValue(options, value);
      setInputFieldText(optionsItem ? optionsItem.label : value);
    } else {
      setInputFieldText(value || '');
    }
  }, [options, value]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <UncontrolledDropdown data-testid={props['data-testid']}>
      <DropdownToggle className="w-100 p-0" color="link">
        <InputGroup>
          <Input
            data-testid={`${props['data-testid']}-input`}
            disabled={props.disabled}
            innerRef={innerRef}
            placeholder={label}
            type="text"
            value={inputFieldText}
            onChange={handleChange}
          />
          <InputGroupAddon addonType="append">
            <InputGroupText className="py-1">
              <FontAwesomeIcon icon={['far', 'search']} />
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </DropdownToggle>
      {hasOptions && (
        <DropdownMenu className="m-0" right={isRightDropdown} flip={false}>
          {options.map((item) => (
            <DropdownItem key={item.value} onClick={handleClick(item)}>
              {item.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </UncontrolledDropdown>
  );
};

FilterSearch.propTypes = {
  'data-testid': PropTypes.string,
  disabled: PropTypes.bool,
  isRightDropdown: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

FilterSearch.defaultProps = {
  disabled: false,
  isRightDropdown: false,
  label: 'Search',
  options: [],
};
