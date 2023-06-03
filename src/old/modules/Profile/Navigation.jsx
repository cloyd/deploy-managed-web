import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { selectIsSecondaryTenant } from '@app/redux/users';

import { useIsMobile } from '../../hooks';
import { Link } from '../Link';
import { NavSub } from '../Nav';

export const ProfileNavigation = ({
  canViewNotificationSettings,
  canViewPaymentSettings,
  canViewPlanSettings,
  canViewAgencyProfile,
}) => {
  const isMobile = useIsMobile();
  const isSecondaryTenant = useSelector(selectIsSecondaryTenant);

  const navItems = useMemo(() => {
    const items = [{ title: 'My Profile', to: '/profile', exact: true }];

    if (canViewAgencyProfile) {
      items.push({
        title: 'Agency Profile',
        to: '/profile/agency',
      });
    }

    if (canViewPaymentSettings && !isSecondaryTenant) {
      items.push({ title: 'Payment Settings', to: '/payments/settings' });
    }

    if (canViewPlanSettings) {
      items.push({ title: 'Plans', to: '/profile/plans' });
    }

    if (canViewNotificationSettings) {
      items.push({
        title: 'Notification Settings',
        to: '/profile/notifications',
      });
    }

    return items;
  }, [
    canViewNotificationSettings,
    canViewPaymentSettings,
    canViewPlanSettings,
    canViewAgencyProfile,
    isSecondaryTenant,
  ]);

  return (
    <NavSub
      className="justify-content-start"
      classNameNavItem="pr-4 pr-sm-5"
      items={navItems}>
      {isMobile && (
        <span className="navbar-nav flex-row">
          <Link
            href="https://support.managedapp.com.au"
            className="mr-3"
            target="_blank"
            rel="noopener noreferrer">
            <span className="nav-link text-small">Help</span>
          </Link>
          <Link to="/logout">
            <span className="nav-link text-small">Logout</span>
          </Link>
        </span>
      )}
    </NavSub>
  );
};

ProfileNavigation.propTypes = {
  canViewNotificationSettings: PropTypes.bool.isRequired,
  canViewPlanSettings: PropTypes.bool.isRequired,
  canViewPaymentSettings: PropTypes.bool.isRequired,
  canViewAgencyProfile: PropTypes.bool.isRequired,
};
