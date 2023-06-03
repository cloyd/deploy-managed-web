import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Collapse, Nav } from 'reactstrap';

import { selectIsSecondaryTenant } from '@app/redux/users';

import { LogoLink, NavItemLink } from '.';
import { toClassName } from '../../utils';
import { Link } from '../Link';
import { usePaymentsNav } from '../Payment/hooks';
import { useRolesContext } from '../Profile';
import { UserAvatar } from '../User';
import { useContactsLinks, useReportsLinks } from './hooks';

export const NavMain = ({
  canAccessASingleProperty,
  isMarketplaceEnabled,
  user,
  isDataReportsModuleEnabled,
  onHandleClickNavIcon,
}) => {
  const location = useLocation();
  const isSecondaryTenant = useSelector(selectIsSecondaryTenant);
  const { isCorporateUser, isExternalCreditor, isManager, isPrincipal } =
    useRolesContext();

  const contactsSubNavItems = useContactsLinks(isMarketplaceEnabled);
  const reportsSubNavItems = useReportsLinks(isDataReportsModuleEnabled);
  const { paymentsSubNavItems } = usePaymentsNav();

  const currentNav = location.pathname.split('/')[1];
  const isPropertyManager = isManager && !isCorporateUser;

  const hasLgBreakpoint = isManager; // Large breakpoint for users with more nav items

  const marketplace = useMemo(() => {
    return isExternalCreditor
      ? { title: 'Jobs', icon: 'screwdriver-wrench' }
      : { title: 'Marketplace', icon: 'store-alt' };
  }, [isExternalCreditor]);

  const [isOpenMap, setIsOpenMap] = useState({
    [currentNav]: true,
  });

  const handleClickLink = useCallback(
    (link) => (e) => {
      if (link && !isOpenMap[link]) {
        setIsOpenMap({
          [link]: true,
        });
      }
      onHandleClickNavIcon();
      e.stopPropagation();
    },
    [isOpenMap, onHandleClickNavIcon]
  );

  const handleToggleSubNav = useCallback(
    (link) => () => {
      setIsOpenMap({
        [link]: !isOpenMap[link],
      });
    },
    [isOpenMap]
  );

  const isActive = useCallback(
    (link) => (currentNav === link ? 'active' : ''),
    [currentNav]
  );

  return (
    <div className="w-100 h-100">
      <LogoLink
        className={toClassName(
          ['d-none mb-3 pt-2'],
          hasLgBreakpoint ? 'd-lg-block' : 'd-md-block'
        )}
      />
      <Nav
        className="align-items-start"
        data-testid="nav-main"
        style={{ height: 'calc(100% - 9.065rem)', overflow: 'auto' }}
        navbar
        vertical>
        {(isManager || isPrincipal) && !isCorporateUser && (
          <NavItemLink
            className={`my-1 w-100 ${isActive('dashboard')}`}
            data-testid="main-link-dashboard"
            icon={['far', 'chart-pie']}
            name="Dashboard"
            path={'/dashboard'}
            onClickLink={handleClickLink()}
          />
        )}
        {isManager && (
          <NavItemLink
            className={`my-1 w-100 ${isActive('tasks')}`}
            data-testid="main-link-action-centre"
            icon={['far', 'wrench']}
            name="Action Centre"
            path="/tasks"
            onClickLink={handleClickLink()}
          />
        )}
        {!isExternalCreditor && (
          <NavItemLink
            className={`my-1 w-100 ${isActive('property')}`}
            data-testid="main-link-properties"
            icon={['far', 'home']}
            name={canAccessASingleProperty ? 'Property' : 'Properties'}
            path={`/property${
              isPropertyManager ? `?with_archived=${false}` : ''
            }`}
            onClickLink={handleClickLink()}
          />
        )}
        {isManager && (
          <>
            <NavItemLink
              className={`my-1 w-100 pointer ${isActive('contacts')}`}
              data-testid="main-link-contacts"
              icon={['far', 'address-book']}
              name="Contacts"
              path="/contacts"
              hasSubNav
              onClickLink={handleClickLink('contacts')}
              onToggleSubNav={handleToggleSubNav('contacts')}
              isOpen={isOpenMap['contacts']}
            />
            <Collapse isOpen={isOpenMap['contacts']}>
              <Nav className="align-items-start" navbar vertical>
                {contactsSubNavItems.map(({ title, to }) => (
                  <NavItemLink
                    className="mb-1 ml-4"
                    isExact
                    key={title}
                    name={title}
                    path={to}
                    onClickLink={handleClickLink()}
                  />
                ))}
              </Nav>
            </Collapse>
          </>
        )}
        {/** KAN-128: temporarily remove communications link until feature is ready */}
        {/* {isAgencyUser && (
          <NavItemLink
            className={`my-1 w-100 ${isActive('communications')}`}
            data-testid="main-link-communications"
            icon={['far', 'comment']}
            name="Communications"
            path={'/communications'}
            onClickLink={handleClickLink()}
          />
        )} */}
        {isExternalCreditor && (
          <NavItemLink
            className={`my-1 w-100 ${isActive('marketplace')}`}
            data-testid="main-link-marketplace"
            icon={['far', marketplace.icon]}
            name={marketplace.title}
            path="/marketplace"
            onClickLink={handleClickLink()}
          />
        )}
        {isPrincipal && (
          <NavItemLink
            className={`my-1 w-100 pointer ${
              currentNav === 'reports' ? 'active' : ''
            }`}
            data-testid="main-link-reports"
            icon={['far', 'chart-bar']}
            name="Reports"
            path="/reports"
            hasSubNav
            onClickLink={handleClickLink('reports')}
            onToggleSubNav={handleToggleSubNav('reports')}
            isOpen={isOpenMap['reports']}
          />
        )}
        <Collapse isOpen={isOpenMap['reports']}>
          <Nav className="align-items-start" navbar vertical>
            {reportsSubNavItems.map(({ title, to }) => (
              <NavItemLink
                className="mb-1 ml-4"
                isExact
                key={title}
                name={title}
                path={to}
                onClickLink={handleClickLink()}
              />
            ))}
          </Nav>
        </Collapse>
        {isManager && !isCorporateUser && (
          <NavItemLink
            className={`my-1 w-100 ${isActive('billie')}`}
            data-testid="main-link-billie"
            icon={['far', 'file-invoice-dollar']}
            name="Billie"
            path={'/billie'}
            onClickLink={handleClickLink()}
          />
        )}
        {!isSecondaryTenant && (
          <NavItemLink
            className={`my-1 w-100 pointer ${isActive('payments')}`}
            data-testid="main-link-payments"
            icon={['far', 'usd-circle']}
            name="Payments"
            path={`/payments?is_complete=false${
              isPropertyManager ? `&manager_id=${user.id}&type=task` : ''
            }`}
            hasSubNav
            onClickLink={handleClickLink('payments')}
            onToggleSubNav={handleToggleSubNav('payments')}
            isOpen={isOpenMap['payments']}
          />
        )}
        <Collapse isOpen={isOpenMap['payments']}>
          <Nav className="align-items-start" navbar vertical>
            {paymentsSubNavItems.map(({ title, to }) => (
              <NavItemLink
                className="mb-1 ml-4"
                isExact
                key={title}
                name={title}
                path={to}
                onClickLink={handleClickLink()}
              />
            ))}
          </Nav>
        </Collapse>
      </Nav>
      <div className={'d-none d-lg-flex flex-row sticky-bottom mt-3'}>
        <Link to="/profile" className="d-flex align-items-center">
          <UserAvatar className="mr-1" user={user} />
        </Link>
        <div className="d-flex flex-column justify-content-center">
          <small>{`${user.firstName} ${user.lastName}`}</small>
          <div className="d-flex flex-row">
            <Link
              href="https://support.managedapp.com.au"
              className="mr-1 d-inline-flex"
              target="_blank"
              rel="noopener noreferrer">
              <small>Help</small>
            </Link>
            <Link className="d-inline-flex" to="/logout">
              <small>Logout</small>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

NavMain.propTypes = {
  canAccessASingleProperty: PropTypes.bool,
  isMarketplaceEnabled: PropTypes.bool,
  user: PropTypes.object,
  isDataReportsModuleEnabled: PropTypes.bool,
  onHandleClickNavIcon: PropTypes.func,
};

NavMain.defaultProps = {
  canAccessASingleProperty: false,
  user: {},
};
