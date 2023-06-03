import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { Container } from 'reactstrap';

import { useLocationParams } from '../../hooks';
import { NavPlain } from '../../modules/Nav';
import { useRolesContext } from '../../modules/Profile';
import {
  WelcomeStepIndicator,
  WelcomeStepOne,
  WelcomeStepTwo,
} from '../../modules/WelcomeStep';
import { enableAccount, getDisbursementAccount } from '../../redux/assembly';
import { INVALID_ONBOARD_MESSAGE, showWarning } from '../../redux/notifier';
import {
  canCreatePayment,
  confirmPassword,
  isAuthorized as getIsAuthorized,
  isOnboarded as getIsOnboarded,
  getProfile,
  getUserFingerprint,
} from '../../redux/profile';
import {
  createVirtualAccount,
  isSecondaryTenant as getIsSecondaryTenant,
  getUser,
} from '../../redux/users';
import { Alert } from '../Alert';
import { WelcomeStepPaymentSettings } from './PaymentSettings';

const AcceptInviteComponent = (props) => {
  const {
    confirmPassword,
    enableAccount,
    isAgreementComplete,
    isAuthorized,
    isLoading,
    isOnboarded,
    isSecondaryTenant,
    showWarning,
    createVirtualAccount,
    user,
  } = props;

  const [isComplete, setIsComplete] = useState(false);
  const roles = useRolesContext();
  const params = useLocationParams();
  const history = useHistory();

  const step = useMemo(() => (isAuthorized ? 2 : 1), [isAuthorized]);

  const isRedirect = useMemo(
    () =>
      isOnboarded ||
      isAgreementComplete ||
      (isSecondaryTenant && step === 2) ||
      (roles.isManager && !roles.isPrincipal && step === 2) ||
      (roles.isExternalCreditor && step === 2) ||
      (roles.isOwner && step === 2),
    [isAgreementComplete, isOnboarded, isSecondaryTenant, roles, step]
  );

  const handleCheckedAgreement = useCallback(
    () => setIsComplete(!isComplete),
    [isComplete]
  );

  const handleComplete = useCallback(() => {
    if (roles.isTenant) {
      history.push('/confirm-invite');
    } else {
      enableAccount({
        promisepayId: props.disbursementAccount?.promisepayId,
        fingerprint: props.fingerprint,
      });
    }
  }, [
    enableAccount,
    history,
    roles.isTenant,
    props.disbursementAccount,
    props.fingerprint,
  ]);

  const handleConfirmPassword = useCallback(
    (values) => confirmPassword({ ...values }),
    [confirmPassword]
  );

  useEffect(() => {
    if (isOnboarded) {
      showWarning({
        isRedirect: true,
        message: INVALID_ONBOARD_MESSAGE,
      });
    }
  }, [isOnboarded, showWarning]);

  useEffect(() => {
    if (!isLoading && isRedirect) {
      history.replace(isAuthorized && !isOnboarded ? '/confirm-invite' : '/');
    }
  }, [history, isAuthorized, isLoading, isOnboarded, isRedirect]);

  const handleGenerateVirtualAccount = useCallback(() => {
    roles.isTenant && createVirtualAccount({ tenantId: user.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, roles.isTenant]);

  return (
    <>
      <NavPlain>
        <WelcomeStepIndicator step={step} />
      </NavPlain>
      <Alert />
      <Container className="mt-3 mb-4 filter-blur">
        {!isRedirect && step === 1 && params.resetPasswordToken ? (
          <WelcomeStepOne
            resetPasswordToken={params.resetPasswordToken}
            onSubmit={handleConfirmPassword}
          />
        ) : isLoading ? (
          <div className="d-flex py-5">
            <PulseLoader color="#dee2e6" />
          </div>
        ) : !isRedirect && step === 2 ? (
          <WelcomeStepTwo
            isDisabled={!isComplete && !roles.isTenant}
            title={roles.isTenant ? 'Rent Payments' : 'Banking Details'}
            onNext={handleComplete}>
            <WelcomeStepPaymentSettings
              onCheckAgreement={handleCheckedAgreement}
              handleGenerateVirtualAccount={handleGenerateVirtualAccount}
            />
          </WelcomeStepTwo>
        ) : null}
      </Container>
    </>
  );
};

AcceptInviteComponent.propTypes = {
  canCreatePayment: PropTypes.bool.isRequired,
  confirmPassword: PropTypes.func.isRequired,
  disbursementAccount: PropTypes.object,
  enableAccount: PropTypes.func,
  fingerprint: PropTypes.string.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  isAgreementComplete: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  isOnboarded: PropTypes.bool,
  isSecondaryTenant: PropTypes.bool,
  showWarning: PropTypes.func.isRequired,
  createVirtualAccount: PropTypes.func.isRequired,
  user: PropTypes.object,
};

AcceptInviteComponent.defaultProps = {
  isLoading: false,
};

const mapStateToProps = (state) => {
  const userProfile = getProfile(state.profile);

  return {
    canCreatePayment: canCreatePayment(state.profile),
    disbursementAccount: getDisbursementAccount(state.assembly),
    fingerprint: getUserFingerprint(state.profile),
    isAgreementComplete: state.assembly.isAgreementComplete,
    isAuthorized: getIsAuthorized(state.profile),
    isLoading: state.profile.isLoading,
    isOnboarded: getIsOnboarded(state.profile),
    isSecondaryTenant: getIsSecondaryTenant(state.users, userProfile.id),
    user: getUser(state.users, userProfile),
  };
};

const mapDispatchToProps = {
  confirmPassword,
  enableAccount,
  showWarning,
  createVirtualAccount,
};

export const AcceptInvite = connect(
  mapStateToProps,
  mapDispatchToProps
)(AcceptInviteComponent);
