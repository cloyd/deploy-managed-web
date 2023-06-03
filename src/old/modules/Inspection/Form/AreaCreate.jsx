import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React from 'react';
import { Form, Input, InputGroup } from 'reactstrap';
import * as Yup from 'yup';

import { FormButtons } from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';

const InspectionFormAreaCreateComponent = (props) => (
  <Form onSubmit={props.handleSubmit}>
    <InputGroup className="mb-3">
      <Input
        data-testid="form-field-name"
        type="text"
        name="name"
        placeholder="Area item name"
        onChange={props.handleChange}
      />
    </InputGroup>
    <FormButtons
      isValid={props.isValid}
      onSubmit={props.handleSubmit}
      onCancel={props.onCancel}
    />
  </Form>
);

InspectionFormAreaCreateComponent.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  item: PropTypes.object,
  onCancel: PropTypes.func,
};

InspectionFormAreaCreateComponent.defaultProps = {
  isLoading: false,
  isSubmitting: false,
  isValid: false,
  item: {},
};

const config = {
  displayName: 'InspectionFormAreaCreate',

  mapPropsToValues: () => ({
    name: '',
  }),

  validationSchema: () => {
    const schema = {
      name: Yup.string()
        .required('Enter an area item name')
        .min(1, 'Enter at least 1 character'),
    };

    return Yup.object().shape(schema);
  },

  handleSubmit: (values, { props, setSubmitting }) => {
    props.onSubmit(values);
    setSubmitting(false);
  },
};

export const InspectionFormAreaCreate = compose(
  withFormik(config),
  withOnComplete
)(InspectionFormAreaCreateComponent);
