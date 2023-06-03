import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Col, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import { FormField, FormLabel } from '.';
import { COUNTRY_CODES } from '../../redux/profile/constants';

export const defaultPropsForEntities = (props) => {
  if (props === null || props === undefined) {
    props = {};
  }

  return {
    addressLine1: props.addressLine1 || '',
    city: props.city || '',
    country: props.country || 'AUS',
    legalName: props.legalName || '',
    phone: props.phone || '',
    state: props.state || '',
    taxNumber: props.taxNumber || '',
    zip: props.zip || '',
  };
};

export const validationSchemaForEntities = {
  legalName: Yup.string().required('Trading name is required'),
  taxNumber: Yup.string().required('ABN/ACN is required'),
  country: Yup.string().required('Country is required'),
  zip: Yup.number()
    .required('Postcode is required')
    .typeError('Must be a number'),
  state: Yup.string().required('State is required'),
  addressLine1: Yup.string().required('Street is required'),
  city: Yup.string().required('Suburb is required'),
};

export const FormFieldsForEntity = ({ attributeName, values, ...props }) => {
  const fieldName = useCallback(
    (key) => {
      return attributeName ? `${attributeName}.${key}` : key;
    },
    [attributeName]
  );

  return (
    <>
      <FormGroup>
        <Row>
          <Col sm={12} className="mb-3">
            <FormLabel for={fieldName('legalName')} isRequired>
              Company Name
            </FormLabel>
            <FormField name={fieldName('legalName')} />
          </Col>
          <Col sm={6}>
            <FormLabel for={fieldName('phone')}>Contact</FormLabel>
            <FormField name={fieldName('phone')} />
          </Col>
          <Col sm={6}>
            <FormLabel for={fieldName('taxNumber')} isRequired>
              ABN/ACN
            </FormLabel>
            <FormField name={fieldName('taxNumber')} />
          </Col>
        </Row>
      </FormGroup>
      <FormGroup>
        <FormLabel for={fieldName('addressLine1')} isRequired>
          Street
        </FormLabel>
        <FormField name={fieldName('addressLine1')} />
      </FormGroup>
      <FormGroup>
        <FormLabel for={fieldName('city')} isRequired>
          Suburb
        </FormLabel>
        <FormField name={fieldName('city')} />
      </FormGroup>
      <Row>
        <Col>
          <FormGroup>
            <FormLabel for={fieldName('state')} isRequired>
              State
            </FormLabel>
            <FormField name={fieldName('state')} />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <FormLabel for={fieldName('zip')} isRequired>
              Postcode
            </FormLabel>
            <FormField name={fieldName('zip')} />
          </FormGroup>
        </Col>
      </Row>
      <FormGroup>
        <FormLabel for={fieldName('country')} isRequired>
          Country
        </FormLabel>
        <FormField name={fieldName('country')} type="select">
          {Object.keys(COUNTRY_CODES).map((key) => (
            <option key={key} value={key}>
              {COUNTRY_CODES[key].name}
            </option>
          ))}
        </FormField>
      </FormGroup>
    </>
  );
};

FormFieldsForEntity.propTypes = {
  attributeName: PropTypes.string,
  values: PropTypes.object,
};
