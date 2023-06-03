import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { Form, FormGroup } from 'reactstrap';
import * as Yup from 'yup';

import { usePrevious } from '@app/hooks';
import { ButtonSnooze } from '@app/modules/Button';
import {
  FormButtons,
  FormField,
  FormFieldDate,
  FormFollowers,
  FormLabel,
  FormOptionsList,
} from '@app/modules/Form';
import { withOnComplete } from '@app/modules/Form/withOnComplete';
import { withRouterHash } from '@app/modules/Route';
import { DEFAULT_FOLLOWERS } from '@app/redux/task';
import { isInPast } from '@app/utils';

const FormComponent = (props) => {
  const {
    handleSubmit,
    hasError,
    isLoading,
    isSubmitting,
    isValid,
    dirty,
    onCancel,
    property,
    resetForm,
    setFieldValue,
    setSubmitting,
    task,
    values,
  } = props;
  const wasLoading = usePrevious(isLoading);

  const handleChangeFollowers = useCallback(
    (value, e) => {
      const followersField = e.name;
      if (e.action === 'select-option' || e.action === 'remove-value') {
        setFieldValue(followersField, value);
      } else if (e.action === 'clear') {
        setFieldValue(followersField, DEFAULT_FOLLOWERS);
      }
    },
    [setFieldValue]
  );

  // This is to make Formik validation behave when prefilling a form
  useEffect(() => {
    task.title && setFieldValue('title', task.title);
  }, [setFieldValue, task.title]);

  // Form submission
  useEffect(() => {
    if (isSubmitting && wasLoading && !isLoading) {
      hasError ? setSubmitting(false) : resetForm();
    }
  }, [hasError, isLoading, isSubmitting, resetForm, setSubmitting, wasLoading]);

  return (
    <Form onSubmit={handleSubmit}>
      <fieldset className={!property.id ? 'opacity-50' : null}>
        <FormGroup>
          <FormLabel for="assigneeId" isRequired>
            Assign task to
          </FormLabel>
          <FormField name="assigneeId" type="select" disabled={!property.id}>
            <FormOptionsList
              hasBlank={true}
              options={property.managers}
              name="assigneeId"
            />
          </FormField>
        </FormGroup>
        <FormGroup>
          <FormLabel for="followers" isRequired>
            Task followers
          </FormLabel>
          <FormFollowers
            value={values.followers}
            disabled={!property.id}
            name="followers"
            onChange={handleChangeFollowers}
          />
        </FormGroup>
        <FormGroup>
          <div className="d-flex flex-row justify-content-between">
            <FormLabel for="dueDate">Due date</FormLabel>
            <ButtonSnooze dueDate={values.dueDate} onClick={setFieldValue} />
          </div>
          <FormFieldDate name="dueDate" />
        </FormGroup>
        <FormGroup>
          <FormLabel for="reminderDate">Action date</FormLabel>
          <FormFieldDate name="reminderDate" popperPlacement="auto" />
        </FormGroup>
        <FormButtons
          className="text-left"
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          isValid={isValid && dirty}
        />
      </fieldset>
    </Form>
  );
};

FormComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  dirty: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  property: PropTypes.object,
  resetForm: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setSubmitting: PropTypes.func.isRequired,
  statuses: PropTypes.array,
  task: PropTypes.object,
  taskMeta: PropTypes.object.isRequired,
  tenant: PropTypes.object,
  values: PropTypes.object.isRequired,
};

FormComponent.defaultProps = {
  hasError: false,
  isLoading: true,
  isSubmitting: false,
  isValid: false,
};

const formatValues = (values, props) => {
  // Extract params we dont need for bills
  const { followers, ...params } = values;

  const followedByOwner = !!followers.find(({ value }) => value === 'owners');
  const followedByTenant = !!followers.find(({ value }) => value === 'tenants');

  return {
    ...params,
    followedByOwner,
    followedByTenant,
  };
};

const config = {
  displayName: 'FormTaskPreview',
  enableReinitialize: true,

  mapPropsToValues: (props) => {
    const { task } = props;
    // spread DEFAULT_FOLLOWERS to prevent if from being mutated
    let followers = [...DEFAULT_FOLLOWERS];

    if (task.followedByOwner) {
      followers.push({ label: 'Owners', value: 'owners' });
    }

    if (task.followedByTenant) {
      followers.push({ label: 'Tenants', value: 'tenants' });
    }

    return {
      // Title is handled by setFieldValue in an effect
      assigneeId: task.assigneeId || '',
      status: task.taskStatus.key || '',
      followers,
      dueDate: task.dueDate || '',
      reminderDate: task.reminderDate || '',
    };
  },

  validationSchema: Yup.object().shape({
    assigneeId: Yup.string().required('Task assignee is required'),

    reminderDate: Yup.string().test({
      name: 'reminderDate',
      message: 'Action date must be in the future',
      test: (value) => !isInPast(value),
    }),
  }),

  handleSubmit: (values, { props }) => {
    props.onSubmit({
      ...formatValues(values, props),
      propertyId: props.property.id,
      taskId: props.task.id,
    });
  },
};

export const TaskFormPreview = compose(
  withRouterHash,
  withFormik(config),
  withOnComplete
)(FormComponent);
