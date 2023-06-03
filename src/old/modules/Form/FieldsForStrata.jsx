import PropTypes from 'prop-types';
import React from 'react';
import { FormGroup } from 'reactstrap';

import { FormLabelInput } from '.';

const fields = [
  { label: 'Company name', name: 'strataCompanyName', type: 'text' },
  { label: 'Plan number', name: 'strataPlanNumber', type: 'text' },
  { label: 'Lot number', name: 'strataLotNumber', type: 'text' },
  { label: 'Email', name: 'strataEmail', type: 'email' },
  { label: 'Phone', name: 'strataPhoneNumber', type: 'tel' },
];

export const defaultPropsForStrata = (props = {}) => {
  return {
    ...props,
    strataCompanyName: props.strataCompanyName || '',
    strataPlanNumber: props.strataPlanNumber || '',
    strataLotNumber: props.strataLotNumber || '',
    strataEmail: props.strataEmail || '',
    strataPhoneNumber: props.strataPhoneNumber || '',
  };
};

export const FormFieldsForStrata = ({
  errors,
  touched,
  values,
  handleChange,
  handleBlur,
  isArchived,
  ...props
}) => (
  <div {...props}>
    {fields.map(({ label, name, type }) => (
      <FormGroup key={name}>
        <FormLabelInput
          type={type}
          label={label}
          name={`propertyFeature[${name}]`}
          value={values && values[name]}
          isTouched={touched && touched[name]}
          error={errors && errors[name]}
          handleChange={handleChange}
          handleBlur={handleBlur}
          disabled={isArchived}
        />
      </FormGroup>
    ))}
  </div>
);

FormFieldsForStrata.defaultProps = {
  errors: {},
  touched: {},
  values: {},
};

FormFieldsForStrata.propTypes = {
  className: PropTypes.string,
  errors: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  touched: PropTypes.object,
  values: PropTypes.object,
  isArchived: PropTypes.bool,
};
