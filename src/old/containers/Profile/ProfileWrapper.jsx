import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';

import { Header } from '../../modules/Header';
import { ProfileNavigation, useRolesContext } from '../../modules/Profile';
import { canManagePlans as checkIfCanManagePlans } from '../../redux/profile';

export const ProfileWrapper = ({ children, title }) => {
  const canManagePlans = checkIfCanManagePlans(useSelector((state) => state));
  const {
    isCorporateUser,
    isExternalCreditor,
    isOwner,
    isPrincipal,
    isTenant,
    isManager,
  } = useRolesContext();

  const canViewPaymentSettings = useMemo(
    () =>
      (isExternalCreditor || isTenant || isPrincipal) &&
      !isCorporateUser &&
      !isOwner,
    [isCorporateUser, isExternalCreditor, isOwner, isPrincipal, isTenant]
  );

  return (
    <>
      <ProfileNavigation
        canViewNotificationSettings={!isManager}
        canViewPaymentSettings={canViewPaymentSettings}
        canViewAgencyProfile={isPrincipal && !isCorporateUser}
        canViewPlanSettings={canManagePlans}
      />
      <Header title={title} />
      <Container className="mt-3 wrapper filter-blur">{children}</Container>
    </>
  );
};

ProfileWrapper.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};
