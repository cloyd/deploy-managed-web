import values from 'object.values';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import { FormField, FormLabel } from '.';
import { AUSTRALIA_STATES_TERRITORIES } from '../../redux/property';
import { AddressAutoComplete } from './AddressAutoComplete';

export const defaultPropsForAddress = (props = {}) => ({
  postcode: '',
  state: '',
  street: '',
  suburb: '',
  ...props,
  country: 'AUS',
});

export const validationSchemaForAddress = {
  postcode: Yup.number()
    .required('Postcode is required')
    .typeError('Must be a number'),
  state: Yup.string().required('State is required'),
  street: Yup.string().required('Street is required'),
  suburb: Yup.string().required('Suburb is required'),
};

export const validationSchemaForPropertyAddress = {
  ...validationSchemaForAddress,
  state: Yup.string().oneOf(Object.keys(AUSTRALIA_STATES_TERRITORIES), () => {
    const statesString = values(AUSTRALIA_STATES_TERRITORIES).join(', ');
    return `State must be one of the following values: ${statesString}`;
  }),
};

export const FormFieldsForAddress = ({
  isAustralianAddress,
  isArchived,
  prefix,
  setFieldValue,
  ...otherProps
}) => {
  return (
    <div {...otherProps}>
      <FormGroup disabled={isArchived}>
        <FormLabel for={`${prefix}.search`}>Search</FormLabel>
        <AddressAutoComplete
          data-testid="field-address-search"
          prefix={prefix}
          disabled={isArchived}
          setFieldValue={setFieldValue}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel for={`${prefix}.street`} isRequired>
          Street
        </FormLabel>
        <FormField
          data-testid="field-address-street"
          name={`${prefix}.street`}
          disabled={isArchived}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel for={`${prefix}.suburb`} isRequired>
          Suburb
        </FormLabel>
        <FormField
          data-testid="field-address-suburb"
          name={`${prefix}.suburb`}
          disabled={isArchived}
        />
      </FormGroup>
      <Row>
        <Col md={6}>
          <FormGroup>
            <FormLabel for={`${prefix}.state`} isRequired>
              State
            </FormLabel>
            {isAustralianAddress ? (
              <FormField
                data-testid="field-address-state-select"
                name={`${prefix}.state`}
                type="select"
                disabled={isArchived}>
                <option value="">-- Select --</option>
                {Object.keys(AUSTRALIA_STATES_TERRITORIES).map((state) => (
                  <option key={`${prefix}.state-${state}`} value={state}>
                    {AUSTRALIA_STATES_TERRITORIES[state]}
                  </option>
                ))}
              </FormField>
            ) : (
              <FormField
                data-testid="field-address-state-input"
                name={`${prefix}.state`}
                disabled={isArchived}
              />
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <FormLabel for={`${prefix}.postcode`} isRequired>
              Postcode
            </FormLabel>
            <FormField
              data-testid="field-address-postcode"
              name={`${prefix}.postcode`}
              disabled={isArchived}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};

FormFieldsForAddress.propTypes = {
  isAustralianAddress: PropTypes.bool, // Property addresses use Australian states & territories
  prefix: PropTypes.string,
  isArchived: PropTypes.bool,
  setFieldValue: PropTypes.func,
};

FormFieldsForAddress.defaultProps = {
  isAustralianAddress: true,
  prefix: 'address',
};
