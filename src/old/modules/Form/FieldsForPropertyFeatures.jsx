import compose from 'lodash/fp/compose';
import keyBy from 'lodash/fp/keyBy';
import mapValues from 'lodash/fp/mapValues';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, CustomInput, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import { FormLabelInput } from '.';
import {
  PROPERTY_ASPECTS,
  PROPERTY_INCLUSIONS,
  PROPERTY_SPACES,
} from '../../redux/property';

export const defaultPropsForPropertyFeatures = (props) => {
  props = props || {};

  const withDefaultValue =
    (value = '') =>
    (item) => {
      return { ...item, value: props[item.name] || value };
    };

  const keyByNameValue = compose(mapValues('value'), keyBy('name'));

  const defaultProps = keyByNameValue([
    ...PROPERTY_SPACES.map(withDefaultValue(0)),
    ...PROPERTY_INCLUSIONS.map(withDefaultValue(false)),
  ]);

  return {
    ...props,
    ...defaultProps,
    aspect: props.aspect || '',
    typeOf: props.typeOf || '',
    landSize: props.landSize || 0,
    propertyType: '',
  };
};

export const validationSchemaForPropertyFeatures = {
  bedrooms: Yup.number().when('isResidential', {
    is: true,
    then: Yup.number()
      .typeError('Must be a number')
      .required('Bedrooms is required'),
  }),
  bathrooms: Yup.number().when('isResidential', {
    is: true,
    then: Yup.number()
      .typeError('Must be a number')
      .required('Bathrooms is required'),
  }),
  carSpaces: Yup.number().when('isResidential', {
    is: true,
    then: Yup.number()
      .typeError('Must be a number')
      .required('Car spaces is required'),
  }),
  landSize: Yup.number().when('isResidential', {
    is: false,
    then: Yup.number()
      .typeError('Must be a number')
      .required('Floor Size is required'),
  }),
  typeOf: Yup.string().required('Property type is required'),
  propertyType: Yup.string(),
};

export const FormFieldsForPropertyFeatures = ({
  errors,
  touched,
  values,
  handleChange,
  handleBlur,
  isArchived,
  propertyType,
  ...props
}) => {
  return (
    <div {...props}>
      <Row>
        {propertyType === 'commercial' ? (
          <>
            <Col key={`spaces-land-size`} xs={6}>
              <FormGroup>
                <FormLabelInput
                  data-testid="field-spaces-land-size"
                  type="number"
                  label="Land Size (m²)"
                  name="propertyFeature[landSize]"
                  value={values && values.landSize}
                  isRequired
                  isTouched={touched && touched.landSize}
                  error={errors && errors.landSize}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  disabled={isArchived}
                />
              </FormGroup>
            </Col>
            <Col key={`spaces-bathrooms`} xs={6}>
              <FormGroup>
                <FormLabelInput
                  type="tel"
                  label="Bathrooms"
                  name="propertyFeature[bathrooms]"
                  value={values && values.bathrooms}
                  isRequired
                  isTouched={touched && touched.bathrooms}
                  error={errors && errors.bathrooms}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  disabled={isArchived}
                />
              </FormGroup>
            </Col>
          </>
        ) : (
          PROPERTY_SPACES.map(({ label, name, type }) => (
            <Col key={`spaces-${name}`}>
              <FormGroup>
                <FormLabelInput
                  data-testid={`field-spaces-${name}`}
                  type={type}
                  label={label}
                  name={`propertyFeature[${name}]`}
                  value={values && values[name]}
                  isRequired
                  isTouched={touched && touched[name]}
                  error={errors && errors[name]}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  disabled={isArchived}
                />
              </FormGroup>
            </Col>
          ))
        )}
      </Row>
      <Row className="mb-3">
        <Col xs={6}>
          <FormLabelInput
            label="Property category"
            name="propertyFeature[typeOf]"
            data-testid="field-property-category-select"
            type="select"
            value={values.typeOf}
            isRequired
            isTouched={touched.typeOf}
            error={errors.typeOf}
            handleChange={handleChange}
            handleBlur={handleBlur}
            disabled={isArchived}>
            <option value="">-- Select --</option>
            {props.categories.map(({ label, name }) => (
              <option key={`type-${name}`} value={name}>
                {label}
              </option>
            ))}
          </FormLabelInput>
        </Col>
        <Col xs={6}>
          <FormLabelInput
            label="Property aspect"
            name="propertyFeature[aspect]"
            data-testid="field-property-aspect-select"
            type="select"
            value={values.aspect}
            isTouched={touched.aspect}
            error={errors.aspect}
            handleChange={handleChange}
            handleBlur={handleBlur}
            disabled={isArchived}>
            <option value="">-- Select --</option>
            {PROPERTY_ASPECTS.map(({ label, name }) => (
              <option key={`type-${name}`} value={name}>
                {label}
              </option>
            ))}
          </FormLabelInput>
        </Col>
      </Row>
      <Row>
        {propertyType === 'commercial'
          ? null
          : PROPERTY_INCLUSIONS.map(({ label, name }) => (
              <Col key={`inclusion-${name}`} xs={6} sm={4}>
                <CustomInput
                  data-testid={`field-inclusion-[${name}]`}
                  id={`propertyFeature[${name}]`}
                  type="checkbox"
                  label={label}
                  inline={true}
                  onChange={handleChange}
                  checked={values && values[name]}
                  className="custom-control-sm"
                  disabled={isArchived}
                />
              </Col>
            ))}
      </Row>
    </div>
  );
};

FormFieldsForPropertyFeatures.defaultProps = {
  errors: {},
  touched: {},
  values: {},
  categories: [],
};

FormFieldsForPropertyFeatures.propTypes = {
  className: PropTypes.string,
  errors: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  touched: PropTypes.object,
  values: PropTypes.object,
  isArchived: PropTypes.bool,
  categories: PropTypes.array,
  propertyType: PropTypes.string,
};
