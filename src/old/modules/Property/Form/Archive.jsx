import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React from 'react';
import { Form, FormGroup } from 'reactstrap';
import * as Yup from 'yup';

import { PROPERTY_LOST_REASON } from '../../../redux/property';
import { FormButtons, FormField, FormLabel } from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';

const PropertyFormArchiveComponent = (props) => {
  return (
    <Form onSubmit={props.handleSubmit}>
      <FormGroup className="mb-5">
        <FormGroup>
          <FormLabel for="lostReasonType" isRequired>
            Management lost reason
          </FormLabel>
          <FormField name="lostReasonType" type="select">
            <option value="">-- Select --</option>
            {Object.keys(PROPERTY_LOST_REASON).map((value) => (
              <option key={`gain-${value}`} value={value}>
                {PROPERTY_LOST_REASON[value] || value}
              </option>
            ))}
          </FormField>
        </FormGroup>
        <FormGroup>
          <FormLabel for="reasonSource">Lost reason source</FormLabel>
          <FormField name="reasonSource" />
        </FormGroup>
        <FormGroup>
          <FormLabel for="preventiveAction">Preventive action</FormLabel>
          <FormField name="preventiveAction" />
        </FormGroup>
        <FormGroup>
          <FormLabel for="comment">Comment</FormLabel>
          <FormField name="comment" />
        </FormGroup>
        {/**
         * TODO: uncomment when BE changes are ready
         * <p className="text-danger">
         * All recurring fees will be removed (admin fees).
         * </p>
         */}
      </FormGroup>
      <FormButtons
        btnSubmit={{ color: 'danger', text: 'Archive' }}
        isSpaced={true}
        isValid={props.isValid}
        onSubmit={props.handleSubmit}
        onCancel={props.onCancel}
      />
    </Form>
  );
};

PropertyFormArchiveComponent.propTypes = {
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

PropertyFormArchiveComponent.defaultProps = {
  isLoading: false,
  isSubmitting: false,
  isValid: false,
};

const config = {
  displayName: 'PropertyFormArchive',

  mapPropsToValues: () => ({
    lostReasonType: '',
    reasonSource: '',
  }),

  validationSchema: () => {
    const schema = {
      lostReasonType: Yup.string().required('Reason is required'),
    };

    return Yup.object().shape(schema);
  },

  handleSubmit: (values, { props, setSubmitting }) => {
    props.onSubmit(values);
    setSubmitting(false);
  },
};

export const PropertyFormArchive = compose(
  withFormik(config),
  withOnComplete
)(PropertyFormArchiveComponent);
