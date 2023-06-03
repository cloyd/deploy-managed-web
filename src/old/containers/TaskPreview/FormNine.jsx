import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { TaskFormFormNine } from '../../modules/Task';
import { hasError } from '../../redux/notifier';
import { createSignature, getProfile } from '../../redux/profile';
import { sendEntryForm } from '../../redux/task';

const TaskPreviewFormNineComponent = (props) => {
  const { createSignature, onToggleForm, property, sendEntryForm, task, user } =
    props;

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

      if (onToggleForm) {
        onToggleForm();
      }
    },
    [onToggleForm, property.id, sendEntryForm, task.id]
  );

  return (
    <div className="border-top p-3 bg-white">
      <h5>Entry notice (Form 9)</h5>
      <p>
        <small>
          Residential Tenancies and Rooming Accommodation Act 2008 (Sections
          192–199)
        </small>
      </p>
      {property && (
        <TaskFormFormNine
          hasError={props.hasError}
          isCompactView={true}
          isLoading={props.isLoading}
          isLoadingUser={props.isLoadingUser}
          property={property}
          task={task}
          user={user}
          onCancel={onToggleForm}
          onSubmit={handleSubmit}
          onSubmitSignature={handleCreateSignature}
        />
      )}
    </div>
  );
};

TaskPreviewFormNineComponent.propTypes = {
  createSignature: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLoadingUser: PropTypes.bool.isRequired,
  onToggleForm: PropTypes.func,
  params: PropTypes.object,
  property: PropTypes.object.isRequired,
  sendEntryForm: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    hasError: hasError(state),
    isLoading: state.task.isLoading,
    isLoadingUser: state.profile.isLoading,
    user: getProfile(state.profile),
  };
};

const mapDispatchToProps = {
  createSignature,
  sendEntryForm,
};

export const TaskPreviewFormNine = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskPreviewFormNineComponent);
