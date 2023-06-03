import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import {
  TaskBillSummary,
  TaskCreatorRow,
  TaskFormFormNine,
} from '../../modules/Task';
import { useTaskPermissions } from '../../modules/Task/hooks';
import { hasError } from '../../redux/notifier';
import { createSignature, getProfile } from '../../redux/profile';
import { sendEntryForm } from '../../redux/task';
import { getManagerPrimaryAgency } from '../../redux/users';

const PropertyTaskFormNineComponent = (props) => {
  const {
    createSignature,
    isLoading,
    isLoadingUser,
    property,
    sendEntryForm,
    task,
    user,
  } = props;

  const { canSendFormNine } = useTaskPermissions(task, { property });

  const handleBack = useCallback(() => props.history.goBack(), [props.history]);

  const handleCreateSignature = useCallback(
    (signature) => createSignature({ signature }),
    [createSignature]
  );

  const handleSubmit = useCallback(
    (values) => {
      sendEntryForm({
        params: values,
        propertyId: property.id,
        taskId: task.id,
      });
    },
    [property.id, sendEntryForm, task.id]
  );

  useEffect(() => {
    // Redirect if property is not in Queensland or has no active lease
    if (!isLoading && !isLoadingUser && !canSendFormNine) {
      handleBack();
    }
  }, [canSendFormNine, handleBack, isLoading, isLoadingUser]);

  return (
    canSendFormNine && (
      <div className="wrapper">
        <Container>
          <TaskCreatorRow task={task} />
          {task.isBillable && (
            <TaskBillSummary className="ml-2 my-4" task={task} />
          )}
          {property && (
            <TaskFormFormNine
              agency={props.agency}
              hasError={props.hasError}
              isLoading={isLoading}
              isLoadingUser={isLoadingUser}
              isOverlayed={true}
              property={property}
              task={task}
              user={user}
              onCancel={handleBack}
              onSubmit={handleSubmit}
              onSubmitSignature={handleCreateSignature}
            />
          )}
        </Container>
      </div>
    )
  );
};

PropertyTaskFormNineComponent.propTypes = {
  agency: PropTypes.object,
  createSignature: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLoadingUser: PropTypes.bool.isRequired,
  params: PropTypes.object,
  property: PropTypes.object.isRequired,
  sendEntryForm: PropTypes.func.isRequired,
  task: PropTypes.object,
  user: PropTypes.object,
};

const mapStateToProps = (state) => {
  const user = getProfile(state.profile);

  return {
    agency: getManagerPrimaryAgency(state.users, user.id),
    hasError: hasError(state),
    isLoading: state.task.isLoading,
    isLoadingUser: state.profile.isLoading,
    user,
  };
};

const mapDispatchToProps = {
  createSignature,
  sendEntryForm,
};

export const PropertyTaskFormNine = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyTaskFormNineComponent);
