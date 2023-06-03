import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardBody, CardHeader, CardTitle, Container } from 'reactstrap';

import { usePrevious } from '../../hooks';
import { CardLight } from '../../modules/Card';
import {
  formatUserTypeParam,
  useContactRole,
} from '../../modules/Contacts/hooks';
import { FormBpay, FormUser } from '../../modules/Form';
import { Header } from '../../modules/Header';
import { useRolesContext } from '../../modules/Profile';
import { hasError as hasErrorSelector } from '../../redux/notifier';
import { USER_TYPES, createUser } from '../../redux/users';

export const UserCreate = ({ history, user, match }) => {
  const { params } = match;

  const dispatch = useDispatch();
  const type = formatUserTypeParam(params.type);
  const hasError = useSelector(hasErrorSelector);
  const isLoading = useSelector((state) => state.users.isLoading);

  const { isCorporateUser } = useRolesContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const prevIsLoading = usePrevious(isLoading);

  const contactRole = useContactRole(type);

  const handleCancel = useCallback(() => {
    history.push(`/contacts/${params.type}`);
  }, [history, params.type]);

  const handleSubmit = useCallback(
    (values) => {
      setIsSubmitting(true);
      dispatch(createUser({ ...values, type }));
    },
    [dispatch, type]
  );

  useEffect(() => {
    // Only managers should be created via UserCreate
    if (type !== USER_TYPES.manager) {
      history.replace('/contacts');
    }
  }, [history, type]);

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
      <Header title={`Invite a ${type}`} />
      <Container>
        {contactRole.isBpay ? (
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
              <CardHeader className="d-flex justify-content-between bg-white border-400">
                <CardTitle className="mb-0" tag="h5">
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardBody>
                <FormUser
                  user={user}
                  hasError={hasError}
                  isEditing={true}
                  isLoading={isLoading}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  isCorporateUser={isCorporateUser}
                  className="mb-3"
                  isCreate
                  isAgencyShown
                />
              </CardBody>
            </CardLight>
          </>
        )}
      </Container>
    </>
  );
};

UserCreate.propTypes = {
  history: PropTypes.object,
  isCreate: PropTypes.bool,
  match: PropTypes.object,
  user: PropTypes.object,
};

UserCreate.defaultProps = {
  user: {},
};

export default UserCreate;
