import startCase from 'lodash/fp/startCase';
import { singular } from 'pluralize';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Alert, Button, CardBody, Container } from 'reactstrap';

import { usePrevious } from '../../hooks';
import { CardLight } from '../../modules/Card';
import {
  formatUserTypeParam,
  useContactRole,
} from '../../modules/Contacts/hooks';
import {
  FormAgencyAccess,
  FormBpay,
  FormUser,
  formatAgencyNoteForSubmit,
  formatUserForSubmit,
} from '../../modules/Form';
import { Header } from '../../modules/Header';
import {
  OwnerFormNotificationSettings,
  OwnerFormPersonalDetails,
} from '../../modules/Owner/Form';
import { useRolesContext } from '../../modules/Profile';
import { UserCardHeader } from '../../modules/User';
import { hasError } from '../../redux/notifier';
import {
  fetchUser,
  getUserByType,
  sendInvite,
  updateUser,
} from '../../redux/users';
import { removeSpaces } from '../../utils';

const ContactsUserEditComponent = (props) => {
  const {
    fetchUser,
    hasError,
    history,
    isLoading,
    params,
    sendInvite,
    type,
    updateUser,
    user,
  } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const prevIsLoading = usePrevious(isLoading);

  const { isPrincipal } = useRolesContext();

  const contactRole = useContactRole(type);

  const showAgencyAccess = contactRole.isManager && isPrincipal;

  const isManagerActive = contactRole.isManager && user.active;

  const disableSendInvitation = useMemo(
    () => contactRole.isTenant && user.leases && user.leases.length === 0,
    [contactRole.isTenant, user.leases]
  );

  const invitationText = useMemo(
    () =>
      user.status === 'draft'
        ? 'Send Invitation'
        : user.status === 'invited'
        ? 'Resend Invitation'
        : null,
    [user.status]
  );

  const handleCancel = useCallback(
    () => history.push(`/contacts/${params.type}/${user.id}`),
    [history, params.type, user.id]
  );

  const handleSendInvite = useCallback(() => {
    sendInvite({ role: type, user });
  }, [sendInvite, type, user]);

  const handleManagerActivate = useCallback(() => {
    setIsSubmitting(true);
    updateUser({ id: user.id, type: type, active: !user.active });
  }, [updateUser, user, type, setIsSubmitting]);

  const handleSubmit = useCallback(
    (values) => {
      setIsSubmitting(true);
      if (type === 'tenant') {
        updateUser({
          ...formatUserForSubmit({
            ...values,
            role: type,
            agencyNoteId: user.agencyNote?.id,
          }),
          id: user.id,
          type: type,
        });
      } else if (type === 'owner') {
        updateUser({
          ...values,
          id: user.id,
          type: type,
          ...(values?.phoneNumber && {
            phoneNumber: removeSpaces(values.phoneNumber),
          }),
          ...(values?.agencyNote && {
            agencyNoteAttributes: formatAgencyNoteForSubmit({
              ...values,
              agencyNoteId: user.agencyNote?.id,
            }),
          }),
        });
      } else {
        updateUser({ ...values, id: user.id, type: type });
      }
    },
    [type, updateUser, user.id, user.agencyNote]
  );

  useEffect(() => {
    if (!isLoading && !user.id) {
      fetchUser(params);
    }
  }, [fetchUser, isLoading, params, user.id]);

  useEffect(() => {
    const isComplete = prevIsLoading && !isLoading;

    if (isSubmitting && isComplete) {
      // Toggle isSubmitting when complete
      setIsSubmitting(false);

      // Redirect after submit
      !hasError && handleCancel();
    }
  }, [handleCancel, hasError, isLoading, isSubmitting, prevIsLoading]);

  return (
    <>
      <Header title={`Edit ${type ? startCase(singular(type)) : ''}`} />
      <Container>
        {isLoading || !user.id ? (
          <div data-testid="user-edit-spinner">
            <PulseLoader color="#dee2e6" />
          </div>
        ) : contactRole.isBpay ? (
          <CardLight
            title="Bpay Details"
            isLoading={isLoading}
            className="mb-3">
            <FormBpay
              user={user}
              hasError={hasError}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </CardLight>
        ) : (
          <>
            <CardLight className="mb-3">
              <UserCardHeader user={user} type={type}>
                {invitationText && (
                  <Button
                    className="ml-2"
                    color="secondary"
                    data-testid="contact-send-invite-btn"
                    disabled={disableSendInvitation}
                    size="sm"
                    onClick={handleSendInvite}>
                    {invitationText}
                  </Button>
                )}
                {type === 'manager' && (
                  <Button
                    className="ml-2"
                    color={isManagerActive ? 'danger' : 'primary'}
                    data-testid="contact-manager-activate-btn"
                    size="sm"
                    onClick={handleManagerActivate}>
                    {isManagerActive ? 'Deactivate' : 'Activate'}
                  </Button>
                )}
              </UserCardHeader>
              <CardBody>
                {disableSendInvitation && (
                  <Alert color="warning">
                    Please add tenant to a lease before sending invitation.
                  </Alert>
                )}
                <FormUser
                  user={user}
                  hasError={hasError}
                  isEditing={true}
                  isLoading={isLoading}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  className="mb-3"
                  tenantType={user?.kind === 'personal' ? 'private' : 'company'}
                  type={type}
                  isAgencyShown
                />
              </CardBody>
            </CardLight>
            {contactRole.isOwner && (
              <>
                <OwnerFormPersonalDetails
                  user={user}
                  onKycSubmit={handleSubmit}
                  onKycCancel={handleCancel}
                  hasError={hasError}
                  isLoading={isLoading}
                />
                <OwnerFormNotificationSettings
                  user={user}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  title="Notification Settings"
                  isInsetButtons={true}
                  hasError={hasError}
                  isLoading={isLoading}
                />
              </>
            )}
            {user.id && showAgencyAccess && (
              <CardLight
                title="Allow this manager access to the following agencies:"
                className="mb-3">
                <FormAgencyAccess
                  hasError={hasError}
                  isLoading={isLoading}
                  onCancel={handleCancel}
                  onSubmit={handleSubmit}
                  manager={user}
                />
              </CardLight>
            )}
          </>
        )}
      </Container>
    </>
  );
};

ContactsUserEditComponent.propTypes = {
  fetchUser: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  history: PropTypes.object,
  isLoading: PropTypes.bool,
  match: PropTypes.object,
  params: PropTypes.object,
  sendInvite: PropTypes.func,
  type: PropTypes.string,
  updateUser: PropTypes.func.isRequired,
  user: PropTypes.object,
};

ContactsUserEditComponent.defaultProps = {
  hasError: false,
  isLoading: false,
  user: {},
};

const mapStateToProps = (state, props) => {
  const { params } = props.match || {};
  const type = formatUserTypeParam(params.type);

  return {
    hasError: hasError(state),
    isLoading: state.users.isLoading,
    params,
    type,
    user: getUserByType(state.users, params.id, type),
  };
};

const mapDispatchToProps = {
  fetchUser,
  updateUser,
  sendInvite,
};

export const ContactsUserEdit = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactsUserEditComponent);
