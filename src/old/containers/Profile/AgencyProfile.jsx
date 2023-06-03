import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'reactstrap';

import { CardLight } from '../../modules/Card';
import { useRolesContext } from '../../modules/Profile';
import { UserFormCompany, UserFormPrimaryContact } from '../../modules/User';
import {
  fetchAgency,
  selectAgency,
  selectIsLoadingAgency,
  updateAgency,
} from '../../redux/agency';
import {
  fetchCompany,
  getCompany,
  selectCompanyIsLoading,
  updateCompany,
} from '../../redux/company';
import { hasError as checkIfHasError } from '../../redux/notifier';
import { getProfile } from '../../redux/profile';
import { fetchUser, getUser } from '../../redux/users';
import { ProfileWrapper } from './ProfileWrapper';

export const AgencyProfile = () => {
  const dispatch = useDispatch();

  const companyState = useSelector((state) => state.company);
  const isLoadingAgency = useSelector(selectIsLoadingAgency);
  const agency = useSelector(selectAgency);
  const profile = getProfile(useSelector((state) => state.profile));
  const user = getUser(
    useSelector((state) => state.users),
    profile
  );
  const agencyId = user.agency && user.agency.id;
  const ownerId = agencyId || user.id;
  const ownerType = agencyId ? 'Agency' : profile.role;
  const hasError = checkIfHasError(useSelector((state) => state));
  const company = getCompany(companyState, ownerType, ownerId);
  const isLoadingCompany = useSelector(selectCompanyIsLoading);

  const { isCorporateUser, isPrincipal } = useRolesContext();

  const showCompany = useMemo(
    () => isPrincipal && company.legalName,
    [company.legalName, isPrincipal]
  );

  useEffect(() => {
    dispatch(fetchUser({ id: profile.id, type: profile.role }));
  }, [dispatch, profile.id, profile.role]);

  useEffect(() => {
    if (isPrincipal && agencyId) {
      dispatch(fetchAgency({ agencyId }));
    }
  }, [agencyId, dispatch, isPrincipal]);

  useEffect(() => {
    if (isPrincipal && !isCorporateUser && ownerId && ownerType) {
      dispatch(fetchCompany({ ownerId, ownerType }));
    }
  }, [dispatch, ownerId, ownerType, isCorporateUser, isPrincipal]);

  const handleUpdateAgency = useCallback(
    (values) => {
      dispatch(updateAgency(values));
    },
    [dispatch]
  );

  const handleUpdateCompany = useCallback(
    (values) => {
      dispatch(updateCompany(values));
    },
    [dispatch]
  );

  return (
    <ProfileWrapper title="Agency Profile">
      <Container className="mt-3 wrapper filter-blur">
        <div data-testid="agency-profile-form">
          {isPrincipal && !isCorporateUser && (
            <CardLight title="Primary Contact" className="mb-3">
              <UserFormPrimaryContact
                agency={agency}
                hasError={hasError}
                isLoading={isLoadingAgency}
                onSubmit={handleUpdateAgency}
              />
            </CardLight>
          )}
          {showCompany && (
            <CardLight title="Company Details" className="mb-3">
              <UserFormCompany
                company={company}
                hasError={hasError}
                isLoading={isLoadingCompany}
                onSubmit={handleUpdateCompany}
              />
            </CardLight>
          )}
        </div>
      </Container>
    </ProfileWrapper>
  );
};

AgencyProfile.propTypes = {};
AgencyProfile.defaultProps = {};
