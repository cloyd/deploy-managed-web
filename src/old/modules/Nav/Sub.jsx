import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Badge, Container, Nav, NavItem, Navbar } from 'reactstrap';

import { toClassName } from '../../utils';

export const NavSub = ({ children, classNameNavItem, items, ...props }) => {
  const className = toClassName(
    ['flex-row', 'flex-fill', 'mx-1'],
    props.className
  );

  return (
    <Navbar className="navbar-sub" data-testid="nav-sub">
      <Container className="p-0 px-sm-3 overflow-auto">
        <Nav navbar className={className}>
          {items.map(({ exact, title, to, isNew }) => (
            <NavItem key={title} className={classNameNavItem}>
              <NavLink
                className="nav-link text-small"
                data-testid="nav-sub-link"
                exact={exact}
                to={to}>
                {isNew && (
                  <Badge className="bg-pink mr-1 d-none d-md-inline">NEW</Badge>
                )}
                {title}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        {children}
      </Container>
    </Navbar>
  );
};

NavSub.defaultProps = {
  className: 'justify-content-between justify-content-sm-start',
  classNameNavItem: 'pr-3 pr-sm-4 text-nowrap',
};

NavSub.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classNameNavItem: PropTypes.string,
  items: PropTypes.array.isRequired,
};
