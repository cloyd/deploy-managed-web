import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import { useIsMobile } from '../../hooks';
import { NavBar, NavMain } from '../../modules/Nav';
import { getProfile } from '../../redux/profile';
import { canAccessASingleProperty } from '../../redux/property';
import { isSecondaryTenant } from '../../redux/users';

const NavigationComponent = ({
  isNavOpen,
  canAccessASingleProperty,
  isMarketplaceEnabled,
  user,
  handleClickNavIcon,
  isBpayOutEnabled,
  isSecondaryTenant,
  isDataReportsModuleEnabled,
}) => {
  const isMobile = useIsMobile();

  return (
    <NavBar isOpen={isNavOpen}>
      <Container
        id="navigation-main"
        className="px-3 h-100 align-items-start"
        style={{ width: !isMobile && '14.375rem' }}>
        <NavMain
          canAccessASingleProperty={canAccessASingleProperty}
          isMarketplaceEnabled={isMarketplaceEnabled}
          user={user}
          onHandleClickNavIcon={handleClickNavIcon}
          isBpayOutEnabled={isBpayOutEnabled}
          isSecondaryTenant={isSecondaryTenant}
          isDataReportsModuleEnabled={isDataReportsModuleEnabled}
        />
      </Container>
    </NavBar>
  );
};

NavigationComponent.propTypes = {
  canAccessASingleProperty: PropTypes.bool,
  handleClickNavIcon: PropTypes.func,
  isMarketplaceEnabled: PropTypes.bool,
  user: PropTypes.object.isRequired,
  isBpayOutEnabled: PropTypes.bool,
  isNavOpen: PropTypes.bool,
  isSecondaryTenant: PropTypes.bool,
  isDataReportsModuleEnabled: PropTypes.bool,
};

const mapStateToProps = ({ profile, property, users }) => ({
  canAccessASingleProperty: canAccessASingleProperty(property),
  isMarketplaceEnabled: getProfile(profile).isMarketplaceEnabled,
  user: getProfile(profile),
  isBpayOutEnabled: profile.isBpayOutEnabled,
  isSecondaryTenant: isSecondaryTenant(users, profile.id),
  isDataReportsModuleEnabled: profile.data.isDataReportsModuleEnabled,
});

export const Navigation = connect(mapStateToProps)(NavigationComponent);
