import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React from 'react';
import { Form, FormGroup } from 'reactstrap';
import * as Yup from 'yup';

import { FormButtons, FormFieldDate, FormLabel } from '../../Form';
import {
  FormFieldsForAddress,
  defaultPropsForAddress,
  validationSchemaForAddress,
} from '../../Form/FieldsForAddress';
import { withOnComplete } from '../../Form/withOnComplete';

const UserFormPersonalComponent = (props) => {
  const { handleSubmit, isSubmitting, isValid, dirty, setFieldValue } = props;
  return (
    <Form onSubmit={handleSubmit} data-testid="user-form-personal">
      <FormGroup>
        <FormLabel for="dob">Date of Birth</FormLabel>
        <FormFieldDate name="dob" />
      </FormGroup>
      <FormFieldsForAddress setFieldValue={setFieldValue} />
      <FormButtons
        isSubmitting={isSubmitting}
        isValid={isValid && dirty}
        isRequired
      />
    </Form>
  );
};

UserFormPersonalComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

const config = {
  displayName: 'UserFormPersonal',
  enableReinitialize: true,

  mapPropsToValues: ({ user = {} }) => ({
    address: defaultPropsForAddress(user.address),
    dob: user.dob || '',
  }),

  validationSchema: () =>
    Yup.object().shape({
      address: Yup.object().shape(validationSchemaForAddress),
      dob: Yup.date(),
    }),

  handleSubmit: (values, { props }) => {
    const { address, ...params } = values;
    props.onSubmit({ ...params, addressAttributes: address });
  },
};

export const UserFormPersonal = compose(
  withFormik(config),
  withOnComplete
)(UserFormPersonalComponent);
