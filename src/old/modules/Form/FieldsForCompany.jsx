import PropTypes from 'prop-types';
import React from 'react';
import { FormGroup } from 'reactstrap';
import * as Yup from 'yup';

import { FormField, FormLabel } from '.';
import {
  FormFieldsForAddress,
  validationSchemaForAddress,
} from './FieldsForAddress';

export const mapCompanyFieldProps = (company = {}) => ({
  address: {
    street: company.addressLine1 || '',
    suburb: company.city || '',
    country: company.country || 'AUS',
    state: company.state || '',
    postcode: company.zip || '',
  },
  legalName: company.legalName || '',
  ownerId: company.ownerId,
  ownerType: company.ownerType,
  servicingRadiusKm: company.servicingRadiusKm,
  taxNumber: company.taxNumber || '',
  licenseNumber: company.licenseNumber || '',
});

export const validationSchemaForCompany = {
  address: Yup.object().shape(validationSchemaForAddress),
  legalName: Yup.string().required('Trading name is required'),
  taxNumber: Yup.string().required('ABN/Tax file number is required'),
};

export const FormFieldsForCompany = (props) => {
  const { prefix, setFieldValue } = props;
  const fieldPrefix = prefix ? `${prefix}.` : '';

  return (
    <>
      <FormGroup>
        <FormLabel for={`${fieldPrefix}legalName`} isRequired>
          Legal Trading Name
        </FormLabel>
        <FormField
          data-testid="field-company-legal-name"
          name={`${fieldPrefix}legalName`}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel for={`${fieldPrefix}taxNumber`} isRequired>
          ABN / Tax file number
        </FormLabel>
        <FormField
          data-testid="field-company-tax-number"
          name={`${fieldPrefix}taxNumber`}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel for={`${fieldPrefix}licenseNumber`}>
          Business Licence
        </FormLabel>
        <FormField
          data-testid="field-company-licence-number"
          name={`${fieldPrefix}licenseNumber`}
        />
      </FormGroup>
      <FormFieldsForAddress
        prefix={`${fieldPrefix}address`}
        setFieldValue={setFieldValue}
      />
      {props.children}
    </>
  );
};

FormFieldsForCompany.propTypes = {
  children: PropTypes.node,
  prefix: PropTypes.string,
  setFieldValue: PropTypes.func,
};
