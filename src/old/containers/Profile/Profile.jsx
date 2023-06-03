import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'reactstrap';

import { useRolesContext } from '../../modules/Profile';
import { UserAvatarModule } from '../../modules/User';
import { createAvatar, deleteAvatar, getProfile } from '../../redux/profile';
import { ProfileExternalCreditorForm } from './ExternalCreditorForm';
import { ProfileForm } from './Form';
import { ProfileWrapper } from './ProfileWrapper';

export const Profile = () => {
  const dispatch = useDispatch();
  const profile = getProfile(useSelector((state) => state.profile));
  const { isExternalCreditor } = useRolesContext();

  const handleOnDelete = useCallback(
    (values) => {
      dispatch(deleteAvatar(values));
    },
    [dispatch]
  );

  const handleCreateAvatar = useCallback(
    (values) => {
      dispatch(createAvatar(values));
    },
    [dispatch]
  );

  return (
    <ProfileWrapper title="Your Profile">
      <Container className="mt-3 wrapper filter-blur">
        {isExternalCreditor ? <ProfileExternalCreditorForm /> : <ProfileForm />}
        {profile.id && (
          <UserAvatarModule
            className="my-4"
            defaultImage={profile.avatarUrl}
            onDelete={handleOnDelete}
            onSubmit={handleCreateAvatar}
          />
        )}
      </Container>
    </ProfileWrapper>
  );
};
