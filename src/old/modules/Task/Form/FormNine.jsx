import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'reactstrap';
import * as Yup from 'yup';

import { FormButtons } from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';
import { withRouterHash } from '../../Route/withRouterHash';
import {
  TaskFieldsFormNine,
  mapFormNineFieldsProps,
  validationSchemaForFormNineFields,
} from '../Fields';

const FormComponent = (props) => {
  const { handleChange, handleSubmit, isSubmitting, isValid } = props;

  return (
    <Form onSubmit={handleSubmit}>
      <TaskFieldsFormNine
        handleChange={handleChange}
        isCompactView={props.isCompactView}
        values={props.values}
      />
      <FormButtons
        btnSubmit={{
          color: 'success',
          text: 'Send Entry Notice',
        }}
        isLoadingUser={props.isLoadingUser}
        isSubmitting={isSubmitting}
        isValid={isValid}
        isOverlayed={props.isOverlayed}
        user={props.user}
        onCancel={props.onCancel}
        onSubmitSignature={props.onSubmitSignature}
      />
    </Form>
  );
};

FormComponent.propTypes = {
  agency: PropTypes.object,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  isCompactView: PropTypes.bool,
  isLoadingUser: PropTypes.bool,
  isOverlayed: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  onCancel: PropTypes.func,
  onComplete: PropTypes.func,
  onSubmit: PropTypes.func,
  onSubmitSignature: PropTypes.func,
  setFieldValue: PropTypes.func.isRequired,
  task: PropTypes.object,
  user: PropTypes.object,
  values: PropTypes.object.isRequired,
};

FormComponent.defaultProps = {
  hasError: false,
  isLoadingUser: true,
  isOverlayed: false,
  isSubmitting: false,
  isValid: false,
  task: {},
  user: {},
};

const config = {
  displayName: 'FormTask',
  enableReinitialize: true,

  mapPropsToValues: (props) => {
    const { agency, task, user } = props;
    const formNine = task.extraInfo ? task.extraInfo.formNine : {};

    return mapFormNineFieldsProps(formNine, user, agency);
  },

  validationSchema: Yup.object().shape(validationSchemaForFormNineFields),

  handleSubmit: (values, { props }) => props.onSubmit(values),
};

export const TaskFormFormNine = compose(
  withRouterHash,
  withFormik(config),
  withOnComplete
)(FormComponent);
