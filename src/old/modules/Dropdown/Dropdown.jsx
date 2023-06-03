import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Dropdown as DropdownElement,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

import { useIsOpen } from '../../hooks';

export const Dropdown = (props) => {
  const { children, isDisabled, items, toggleColor, ...otherProps } = props;
  const [isOpen, actions] = useIsOpen();
  const { handleToggle } = actions;

  return (
    <DropdownElement isOpen={isOpen} toggle={handleToggle}>
      <DropdownToggle
        color={toggleColor}
        data-testid="dropdown-toggle"
        disabled={isDisabled}>
        {children || (
          <FontAwesomeIcon icon={['far', 'ellipsis-h']} className="my-2" />
        )}
      </DropdownToggle>
      <DropdownMenu right={true} {...otherProps}>
        {items.map(({ title, onClick }, index) => (
          <DropdownItem
            data-testid={`dropdown-item-${index}`}
            key={`dropdown-${index}`}
            onClick={onClick}>
            {title}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownElement>
  );
};

Dropdown.propTypes = {
  children: PropTypes.node,
  isDisabled: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      onClick: PropTypes.func,
    })
  ),
  toggleColor: PropTypes.string,
};

Dropdown.defaultProps = {
  isDisabled: false,
  toggleColor: 'link',
};
