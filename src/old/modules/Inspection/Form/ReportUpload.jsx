import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React from 'react';
import { Alert, Form } from 'reactstrap';
import * as Yup from 'yup';

import { ATTACHMENT_CATEGORIES } from '../../../utils';
import { ButtonCancel } from '../../Button';
import { withOnComplete } from '../../Form/withOnComplete';
import { UploaderWidget } from '../../Uploader';

const InspectionFormReportUploadComponent = (props) => {
  return (
    <Form onSubmit={props.handleSubmit}>
      <div className="mb-3">
        {props.reportId ? (
          <UploaderWidget
            attachableType="PropertyInspectionReport"
            attachableId={props.reportId}
            attachableCategory={ATTACHMENT_CATEGORIES.propertyInspectionReport}
            maxNumFiles={1}
            onUploaderComplete={props.onUploaderComplete}
          />
        ) : (
          <Alert color="danger">
            Error: Report ID is required for file upload.
          </Alert>
        )}
      </div>
      <ButtonCancel color="primary" onClick={props.onCancel}>
        Cancel
      </ButtonCancel>
    </Form>
  );
};

InspectionFormReportUploadComponent.propTypes = {
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  onCancel: PropTypes.func,
  onUploaderComplete: PropTypes.func,
  reportId: PropTypes.number,
};

InspectionFormReportUploadComponent.defaultProps = {
  isLoading: false,
  isSubmitting: false,
  isValid: false,
};

const config = {
  displayName: 'InspectionFormReportUpload',

  mapPropsToValues: () => ({}),

  validationSchema: () => {
    const schema = {};

    return Yup.object().shape(schema);
  },

  handleSubmit: (values, { props, setSubmitting }) => {
    props.onSubmit(values);
    setSubmitting(false);
  },
};

export const InspectionFormReportUpload = compose(
  withFormik(config),
  withOnComplete
)(InspectionFormReportUploadComponent);
