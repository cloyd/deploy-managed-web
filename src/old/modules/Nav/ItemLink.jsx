import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavItem } from 'reactstrap';

import { ButtonIcon } from '../Button';

export const NavItemLink = ({
  hasSubNav,
  icon,
  isExact,
  isOpen,
  name,
  onClickLink,
  onToggleSubNav,
  path,
  ...props
}) => (
  <NavItem {...props} onClick={onToggleSubNav}>
    <span className="d-flex justify-content-between align-items-center">
      <NavLink
        activeClassName="active"
        className="nav-link text-center p-0"
        data-testid="nav-item-link"
        exact={isExact}
        onClick={onClickLink}
        to={path}>
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className="text-primary"
            style={{ width: '20px' }} // Set standard width for Icon container to align Nav Item text
          />
        )}
        <span className="ml-2">{name}</span>
      </NavLink>
      {hasSubNav && (
        <ButtonIcon
          className="p-0"
          icon={['far', isOpen ? 'chevron-up' : 'chevron-down']}
        />
      )}
    </span>
  </NavItem>
);

NavItemLink.defaultProps = {
  onClickLink: () => {},
};

NavItemLink.propTypes = {
  className: PropTypes.string,
  isExact: PropTypes.bool,
  hasSubNav: PropTypes.bool,
  icon: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.object.isRequired,
    PropTypes.array.isRequired,
  ]),
  isOpen: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onClickLink: PropTypes.func,
  onToggleSubNav: PropTypes.func,
  path: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};
