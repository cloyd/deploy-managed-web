import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { CardBody, CardHeader, CardTitle } from 'reactstrap';

import { useToggle } from '../../hooks';
import {
  CardDisbursementFrequency,
  CardLight,
  CardWalletBalance,
} from '../../modules/Card';
import { ChangePassword } from '../../modules/ChangePassword';
import { FormTwoFactorAuth, FormUser } from '../../modules/Form';
import { useRolesContext } from '../../modules/Profile';
import {
  UserFormCompany,
  UserFormPersonal,
  UserStatus,
} from '../../modules/User';
import { TwoFactorAuthStatusBadge } from '../../modules/User/TwoFactorAuthStatusBadge';
import { fetchCompany, getCompany, updateCompany } from '../../redux/company';
import { hasError } from '../../redux/notifier';
import {
  disableAuthy,
  enableAuthy,
  getProfile,
  requestAuthySMS,
} from '../../redux/profile';
import {
  fetchUser,
  getUser,
  isSecondaryTenant,
  updateUser,
} from '../../redux/users';

const ProfileFormComponent = (props) => {
  const {
    company,
    disableAuthy,
    enableAuthy,
    fetchCompany,
    fetchUser,
    hasError,
    isLoadingCompany,
    isLoadingUser,
    isTwoFactorFeatureEnabled,
    ownerId,
    ownerType,
    profile,
    requestAuthySMS,
    updateCompany,
    updateUser,
    user,
  } = props;

  const { isCorporateUser, isOwner, isPrincipal } = useRolesContext();

  const [modalState, toggleModal] = useToggle();

  const showCompany = useMemo(
    () => isOwner && company.legalName,
    [company.legalName, isOwner]
  );

  const toggleChangePassword = useCallback(() => {
    toggleModal({ isOpen: !modalState.isOpen, callback: null });
  }, [modalState.isOpen, toggleModal]);

  const handleSubmit = useCallback(
    (values) => {
      updateUser({ ...values, id: user.id, role: profile.role });
    },
    [updateUser, user.id, profile.role]
  );

  const handleEnableAuthy = useCallback(
    (values) => {
      enableAuthy(values);
    },
    [enableAuthy]
  );

  const handleRequestAuthySMS = useCallback(() => {
    requestAuthySMS(user.email);
  }, [requestAuthySMS, user.email]);

  const handleDisableAuthy = useCallback(
    (values) => {
      disableAuthy(values);
    },
    [disableAuthy]
  );

  useEffect(() => {
    fetchUser({ id: profile.id, type: profile.role });
  }, [fetchUser, profile]);

  useEffect(() => {
    if (isOwner && !isCorporateUser && ownerId && ownerType) {
      fetchCompany({ ownerId, ownerType });
    }
  }, [fetchCompany, ownerId, ownerType, isCorporateUser, isOwner, isPrincipal]);

  return (
    <div data-testid="profile-form">
      {(isOwner || isPrincipal) && (
        <CardWalletBalance
          amountCents={
            isOwner
              ? user.walletBalanceAmountCents
              : user.agency?.walletBalanceAmountCents
          }
          isOwner={isOwner}
          isPrincipal={isPrincipal}
        />
      )}
      {isOwner && (
        <CardDisbursementFrequency
          frequency={user.withdrawalFrequency}
          ownerId={ownerId}
        />
      )}
      <CardLight className="mb-3">
        <CardHeader className="d-flex justify-content-between bg-white border-400">
          <div className="d-flex">
            <CardTitle className="mb-0 mr-2" tag="h5">
              Account Details
            </CardTitle>
            {profile?.status && <UserStatus status={profile.status} />}
          </div>
        </CardHeader>
        <CardBody>
          <FormUser
            hasError={hasError}
            isLoading={isLoadingUser}
            user={user}
            onChangePassword={toggleChangePassword}
            onSubmit={handleSubmit}
          />
          <ChangePassword
            isOpen={modalState.isOpen}
            toggle={toggleChangePassword}
          />
        </CardBody>
      </CardLight>
      {isTwoFactorFeatureEnabled && (
        <CardLight className="mb-3">
          <CardHeader className="d-flex bg-white border-400">
            <div className="d-flex">
              <CardTitle className="mb-0 mr-2" tag="h5">
                Two-factor Authentication
              </CardTitle>
              <TwoFactorAuthStatusBadge
                isAuthyEnabled={user.isAuthyEnabled || false}
                isLoading={isLoadingUser}
              />
            </div>
          </CardHeader>
          <CardBody>
            <FormTwoFactorAuth
              user={user}
              hasError={hasError}
              btnText="Enable two-factor authentication"
              disable2FABtnText="Disable two-factor authentication"
              isLoading={isLoadingUser}
              isDisable2FAEnabled
              onSubmit={handleEnableAuthy}
              onDisableAuthy={handleDisableAuthy}
              onRequestAuthySMS={handleRequestAuthySMS}
            />
          </CardBody>
        </CardLight>
      )}
      {isOwner && (
        <CardLight title="Personal Details" className="mb-3">
          <UserFormPersonal
            hasError={hasError}
            isLoading={isLoadingUser}
            user={user}
            onSubmit={handleSubmit}
          />
        </CardLight>
      )}
      {showCompany && (
        <CardLight title="Company Details" className="mb-3">
          <UserFormCompany
            company={company}
            hasError={hasError}
            isLoading={isLoadingCompany}
            onSubmit={updateCompany}
          />
        </CardLight>
      )}
    </div>
  );
};

ProfileFormComponent.propTypes = {
  company: PropTypes.object,
  disableAuthy: PropTypes.func.isRequired,
  enableAuthy: PropTypes.func,
  fetchCompany: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
  isLoadingCompany: PropTypes.bool.isRequired,
  isLoadingUser: PropTypes.bool.isRequired,
  isSecondaryTenant: PropTypes.bool.isRequired,
  isTwoFactorFeatureEnabled: PropTypes.bool,
  ownerId: PropTypes.number,
  ownerType: PropTypes.string,
  profile: PropTypes.object.isRequired,
  requestAuthySMS: PropTypes.func.isRequired,
  updateCompany: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const profile = getProfile(state.profile);
  const user = getUser(state.users, profile);
  const agencyId = user.agency && user.agency.id;
  const ownerId = agencyId || user.id;
  const ownerType = agencyId ? 'Agency' : profile.role;

  return {
    ownerId,
    ownerType,
    profile,
    user,
    company: getCompany(state.company, ownerType, ownerId),
    hasError: hasError(state),
    isLoadingCompany: state.company.isLoading,
    isLoadingUser: state.users.isLoading,
    isSecondaryTenant: isSecondaryTenant(state.users, profile.id),
    isTwoFactorFeatureEnabled: state.settings.authyEnabled,
  };
};

const mapDispatchToProps = {
  disableAuthy,
  enableAuthy,
  fetchCompany,
  fetchUser,
  requestAuthySMS,
  updateCompany,
  updateUser,
};

export const ProfileForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileFormComponent);
