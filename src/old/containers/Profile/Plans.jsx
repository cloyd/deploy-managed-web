import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import { useFetch } from '@app/hooks';
import { Header } from '@app/modules/Header';
import {
  ProfileNavigation,
  ProfilePlanWithFormik,
  useRolesContext,
} from '@app/modules/Profile';
import { canManagePlans, getProfile } from '@app/redux/profile';
import { getUser } from '@app/redux/users';
import { httpClient } from '@app/utils';

function usePlans() {
  const [key, setKey] = useState(1);

  const endpoint = useSelector((state) => {
    const { agency, managerAgencies } = getUser(
      state.users,
      getProfile(state.profile)
    );

    // Get the first manager agency (handle corporate users)
    let { agencyId } = (managerAgencies || [])[0] || {};

    // Fallback to the agency
    if (!agencyId && agency) {
      agencyId = agency.id;
    }

    if (agencyId) {
      return `agencies/${agencyId}/plans`;
    }
  });

  const action = useCallback(
    async (action, params) => {
      const response = await httpClient[action](endpoint, params);

      // Updating key will trigger useFetch
      if (response.status < 300) {
        setKey((key) => (key += 1));
      }
    },
    [endpoint, setKey]
  );

  const [response] = useFetch(endpoint, null, key);
  const plans = response?.plans || [];

  return [plans, action];
}

export const ProfilePlans = () => {
  const {
    isCorporateUser,
    isManager,
    isOwner,
    isPrincipal,
    isTenant,
    isExternalCreditor,
  } = useRolesContext();

  const [plans, handleSubmit] = usePlans();

  const canViewPlanSettings = useSelector((state) => {
    return canManagePlans(state);
  });

  // This has been copy/pasted and modified from the ProfileComponent to quickly
  // get things out the door. Needs a refactor, move to a selector
  const canViewPaymentSettings =
    (isExternalCreditor || isTenant || isPrincipal) &&
    !isCorporateUser &&
    !isOwner;

  const hasScheduled = useMemo(() => {
    return plans.findIndex((plan) => plan.status === 'scheduled') >= 0;
  }, [plans]);

  return isPrincipal ? (
    <div className="mb-4">
      <ProfileNavigation
        canViewNotificationSettings={!isManager}
        canViewPlanSettings={canViewPlanSettings}
        canViewPaymentSettings={canViewPaymentSettings}
        canViewAgencyProfile={isPrincipal && !isCorporateUser}
      />
      <Header title="Managed Plans" className="ml-3" />
      <Container>
        <Row>
          {plans.map((plan) => (
            <Col key={`plan-${plan.id}`}>
              <ProfilePlanWithFormik
                plan={plan}
                hasScheduled={hasScheduled}
                onSubmit={handleSubmit}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  ) : (
    <Redirect to="/profile" />
  );
};
