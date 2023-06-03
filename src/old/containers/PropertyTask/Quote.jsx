import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import { DividerDouble } from '../../modules/Divider';
import { useRolesContext } from '../../modules/Profile';
import { TaskFormQuote, TaskSummary } from '../../modules/Task';
import { hasError } from '../../redux/notifier';
import { createTaskQuote } from '../../redux/task';

const PropertyTaskQuoteComponent = (props) => {
  const { createTaskQuote, hasError, isLoading, task } = props;

  const { isManager } = useRolesContext();

  const handleCancel = useCallback(() => {
    if (task.id && task.propertyId) {
      props.history.push(`/property/${task.propertyId}/tasks/${task.id}`);
    }
  }, [props.history, task.id, task.propertyId]);

  return isManager && task.id ? (
    <Container>
      <TaskFormQuote
        className="mb-4"
        hasError={hasError}
        isLoading={isLoading}
        task={task}
        onCancel={handleCancel}
        onComplete={handleCancel}
        onSubmit={createTaskQuote}
      />
      <DividerDouble />
      <TaskSummary hasDescription={true} task={task} className="mt-1 ml-1" />
    </Container>
  ) : null;
};

PropertyTaskQuoteComponent.propTypes = {
  createTaskQuote: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  task: PropTypes.object,
};

const mapStateToProps = (state, props) => {
  const { task } = props;

  return {
    task,
    hasError: hasError(state),
    isLoading: state.task.isLoading,
  };
};

const mapDispatchToProps = {
  createTaskQuote,
};

export const PropertyTaskQuote = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyTaskQuoteComponent);
