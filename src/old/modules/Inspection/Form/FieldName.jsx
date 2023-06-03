import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Form } from 'reactstrap';
import * as Yup from 'yup';

import { FormField } from '../../Form';

const InspectionFormFieldNameComponent = (props) => (
  <Form
    className="d-flex justify-content-center"
    data-testid="form-inspection-field-name"
    onSubmit={props.handleSubmit}>
    <FormField name="name" placeholder="Name" type="text" />
    <Button
      className="ml-2 py-0"
      color="primary"
      data-testid="form-submit-btn"
      disabled={!!props.errors.name}
      type="submit">
      Save
    </Button>
  </Form>
);

InspectionFormFieldNameComponent.propTypes = {
  btnSubmit: PropTypes.object,
  errors: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  name: PropTypes.string,
  values: PropTypes.object,
};

const config = {
  displayName: 'InspectionFormFieldName',

  mapPropsToValues: (props) => ({
    name: props.name || '',
  }),

  validationSchema: () => {
    const schema = {
      name: Yup.string().required('Name is required'),
    };

    return Yup.object().shape(schema);
  },

  handleSubmit: (values, { props, setSubmitting }) => {
    props.onSubmit(values);
    setSubmitting(false);
  },
};

export const InspectionFormFieldName = compose(withFormik(config))(
  InspectionFormFieldNameComponent
);
