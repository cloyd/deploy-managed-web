import PropTypes from 'prop-types';
import React from 'react';
import { FormGroup } from 'reactstrap';
import * as Yup from 'yup';

import { PROPERTY_GAIN_REASON } from '../../../redux/property';
import { FormField, FormLabel, FormLabelInput } from '../../Form';

export const defaultPropsForManagementGain = (props = {}) => ({
  gainReasonType: props.gainReasonType || '',
  reasonSource: props.reasonSource || '',
});

export const validationSchemaForManagementGain = {
  gainReasonType: Yup.string().required(
    'Reason for management gain is required'
  ),
};

export const PropertyFormFieldsManagementGain = (props) => {
  const {
    errors,
    handleChange,
    handleBlur,
    name,
    touched,
    values,
    isArchived,
  } = props;
  const namePrefix = name ? `${name}.` : '';

  return (
    <>
      <FormGroup>
        <FormLabel for={`${namePrefix}gainReasonType`} isRequired>
          Management gained reason
        </FormLabel>
        <FormField
          name={`${namePrefix}gainReasonType`}
          type="select"
          disabled={isArchived}>
          <option value="">-- Select --</option>
          {Object.keys(PROPERTY_GAIN_REASON).map((value) => (
            <option key={`gain-${value}`} value={value}>
              {PROPERTY_GAIN_REASON[value] || value}
            </option>
          ))}
        </FormField>
      </FormGroup>
      <FormLabelInput
        label="Gained Reason Source"
        type="input"
        name={`${namePrefix}reasonSource`}
        value={values.reasonSource}
        isTouched={touched.reasonSource}
        error={errors.reasonSource}
        handleChange={handleChange}
        handleBlur={handleBlur}
        disabled={isArchived}
      />
    </>
  );
};

PropertyFormFieldsManagementGain.defaultProps = {
  errors: {},
  touched: {},
  values: {},
};

PropertyFormFieldsManagementGain.propTypes = {
  className: PropTypes.string,
  errors: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  name: PropTypes.string,
  touched: PropTypes.object,
  values: PropTypes.object,
  isArchived: PropTypes.bool,
};
