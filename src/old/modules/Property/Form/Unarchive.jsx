import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React from 'react';
import { Form, FormGroup } from 'reactstrap';
import * as Yup from 'yup';

import { PROPERTY_GAIN_REASON } from '../../../redux/property';
import { FormButtons, FormField, FormLabel } from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';

const PropertyFormUnarchiveComponent = (props) => {
  return (
    <Form onSubmit={props.handleSubmit}>
      <FormGroup className="mb-5">
        <FormGroup>
          <FormLabel for="gainReasonType" isRequired>
            Management gain reason
          </FormLabel>
          <FormField name="gainReasonType" type="select">
            <option value="">-- Select --</option>
            {Object.keys(PROPERTY_GAIN_REASON).map(
              (
                value // PROPERTY_GAIN_REASON --> check this list with Ro.
              ) => (
                <option key={`gain-${value}`} value={value}>
                  {PROPERTY_GAIN_REASON[value] || value}
                </option>
              )
            )}
          </FormField>
        </FormGroup>
        <FormGroup>
          <FormLabel for="gainReasonSource">Gain reason source</FormLabel>
          <FormField name="gainReasonSource" />
        </FormGroup>
      </FormGroup>
      <FormButtons
        btnSubmit={{ color: 'danger', text: 'Unarchive' }} // check color with Ro
        isSpaced={true}
        isValid={props.isValid}
        onSubmit={props.handleSubmit}
        onCancel={props.onCancel}
      />
    </Form>
  );
};

PropertyFormUnarchiveComponent.propTypes = {
  btnSubmit: PropTypes.object,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object,
};

PropertyFormUnarchiveComponent.defaultProps = {
  isLoading: false,
  isSubmitting: false,
  isValid: false,
};

const config = {
  displayName: 'PropertyFormUnarchive',

  mapPropsToValues: () => ({
    gainReasonType: '',
    gainReasonSource: '',
  }),

  validationSchema: () => {
    const schema = {
      gainReasonType: Yup.string().required('Reason is required'),
    };

    return Yup.object().shape(schema);
  },

  handleSubmit: (values, { props, setSubmitting }) => {
    props.onSubmit(values);
    setSubmitting(false);
  },
};

export const PropertyFormUnarchive = compose(
  withFormik(config),
  withOnComplete
)(PropertyFormUnarchiveComponent);
