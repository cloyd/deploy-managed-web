import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'reactstrap';
import * as Yup from 'yup';

import {
  FormButtons,
  FormFieldsForMultipleUsers,
  defaultPropsForUser,
  formatUserForSubmit,
  validationSchemaForUser,
} from '.';

const FormPropertyTenantsComponent = ({
  isSubmitting,
  isValid,
  handleSubmit,
  onSubmit,
  values,
  setFieldValue,
}) => (
  <Form onSubmit={handleSubmit}>
    <FormFieldsForMultipleUsers
      canSubmit={!!onSubmit}
      type="tenant"
      values={values.secondaryTenants}
      setFieldValue={setFieldValue}
    />
    {isValid && <FormButtons isSubmitting={isSubmitting} isValid={isValid} />}
  </Form>
);

FormPropertyTenantsComponent.propTypes = {
  errors: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  setSubmitting: PropTypes.func.isRequired,
  secondaryTenants: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

const formikEnhancer = withFormik({
  displayName: 'FormPropertyTenants',
  enableReinitialize: true,

  mapPropsToValues: (props) => {
    const { secondaryTenants } = props;

    return {
      secondaryTenants: secondaryTenants.map((tenant) =>
        defaultPropsForUser(tenant || {})
      ),
    };
  },

  validationSchema: () => {
    return Yup.object().shape({
      secondaryTenants: Yup.array().of(
        Yup.object().shape({
          ...validationSchemaForUser,
          phoneNumber: Yup.string()
            .transform((value) => value.replace(/\s/g, ''))
            .when('id', {
              is: '',
              then: (schema) =>
                schema.matches(
                  /^$|^(\+?[0-9]{2})?[0-9]{10}$/,
                  'Valid mobile number is required'
                ),
            }),
        })
      ),
    });
  },

  handleSubmit: (values, { props }) => {
    props.onSubmit(
      values.secondaryTenants.map((tenant) => formatUserForSubmit(tenant))
    );
  },
});

export const FormPropertyTenants = formikEnhancer(FormPropertyTenantsComponent);

export default FormPropertyTenants;
