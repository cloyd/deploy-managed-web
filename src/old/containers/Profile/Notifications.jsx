import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import { ExternalCreditorFormNotificationSettings } from '../../modules/ExternalCreditor/Form';
import { Header } from '../../modules/Header';
import { OwnerFormNotificationSettings } from '../../modules/Owner/Form';
import { ProfileNavigation, useRolesContext } from '../../modules/Profile';
import { TenantFormNotificationSettings } from '../../modules/Tenant/Form';
import {
  canCreatePayment,
  canManagePlans,
  getProfile,
} from '../../redux/profile';
import { getUser, isSecondaryTenant, updateUser } from '../../redux/users';

const ProfileNotificationsComponent = ({
  canManagePlans,
  history,
  profile,
  updateUser,
  user,
}) => {
  const {
    isCorporateUser,
    isExternalCreditor,
    isManager,
    isOwner,
    isPrincipal,
    isTenant,
  } = useRolesContext();

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleSubmit = useCallback(
    (values) => {
      updateUser({ ...values, id: profile.id, role: profile.role });
    },
    [updateUser, profile.id, profile.role]
  );

  return (
    <>
      <ProfileNavigation
        canViewNotificationSettings={!isManager}
        canViewPlanSettings={canManagePlans}
        canViewPaymentSettings={
          (isExternalCreditor || isTenant || isPrincipal) &&
          !isCorporateUser &&
          !isOwner
        }
        canViewAgencyProfile={isPrincipal && !isCorporateUser}
      />
      <Header title="Your Notification Settings" />
      <Container className="mt-3 wrapper filter-blur">
        {profile.id && isOwner && (
          <OwnerFormNotificationSettings
            user={user}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={false}
            hasError={false}
          />
        )}
        {profile.id && isTenant && (
          <TenantFormNotificationSettings
            user={user}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={false}
            hasError={false}
          />
        )}
        {profile.id && isExternalCreditor && (
          <ExternalCreditorFormNotificationSettings
            user={user}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={false}
            hasError={false}
          />
        )}
      </Container>
    </>
  );
};

ProfileNotificationsComponent.propTypes = {
  canCreatePayment: PropTypes.bool.isRequired,
  canManagePlans: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  isBpayOutEnabled: PropTypes.bool,
  isSecondaryTenant: PropTypes.bool,
  profile: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const profile = getProfile(state.profile);

  return {
    canCreatePayment: canCreatePayment(state.profile),
    isSecondaryTenant: isSecondaryTenant(state.users, profile.id),
    canManagePlans: canManagePlans(state, profile.id),
    profile,
    user: getUser(state.users, profile),
  };
};

const mapDispatchToProps = {
  updateUser,
};

export const ProfileNotifications = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileNotificationsComponent);
