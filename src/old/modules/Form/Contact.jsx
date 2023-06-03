import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React from 'react';
import { Form, FormGroup } from 'reactstrap';
import * as Yup from 'yup';

import { FormButtons, FormLabelInput } from '.';
import { withOnComplete } from './withOnComplete';

const FormContactComponent = (props) => {
  const {
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid,
    onCancel,
    touched,
    values,
  } = props;

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <FormLabelInput
          className="mb-3"
          label="Title"
          name="title"
          isRequired
          value={values.title}
          isTouched={touched.title}
          error={errors.title}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
        <FormLabelInput
          className="mb-3"
          type="textarea"
          label="Description"
          name="description"
          rows={6}
          isRequired
          value={values.description}
          isTouched={touched.description}
          error={errors.description}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
      </FormGroup>
      <FormButtons
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isValid={isValid}
      />
    </Form>
  );
};

FormContactComponent.propTypes = {
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleCreateTask: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  propertyId: PropTypes.number,
  submitForm: PropTypes.func.isRequired,
  task: PropTypes.object,
  touched: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
};

FormContactComponent.defaultProps = {
  task: {},
};

const config = {
  displayName: 'FormContact',

  mapPropsToValues: (props) => {
    const { propertyId } = props;

    return {
      description: '',
      title: '',
      type: 'general',
      priority: 'normal',
      status: 'entered',
      propertyId: propertyId,
      category: 'other',
    };
  },

  validationSchema: Yup.object().shape({
    description: Yup.string().required('Description is required'),
    title: Yup.string().required('Title is required'),
  }),

  handleSubmit: (values, { props }) => props.handleCreateTask(values),
};

export const FormContact = compose(
  withFormik(config),
  withOnComplete
)(FormContactComponent);
