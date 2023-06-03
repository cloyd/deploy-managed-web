import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Col, Form, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import { formatPhoneNumber, removeSpaces } from '../../../utils';
import {
  FormButtons,
  FormField,
  FormFieldBoolean,
  FormFieldDate,
  FormFieldSelect,
  FormLabel,
} from '../../Form';
import {
  FormFieldsForAddress,
  defaultPropsForAddress,
  validationSchemaForAddress,
} from '../../Form/FieldsForAddress';
import { withOnComplete } from '../../Form/withOnComplete';

/**
 * Marketplace Tradie version of external creditor details form
 * This is to replace ExternalCreditorFormDetails when typeOf param is replaced by tagIds
 */
const ExternalCreditorFormMarketplaceDetailsComponent = (props) => {
  const {
    errors,
    handleSubmit,
    isSubmitting,
    isValid,
    dirty,
    onCancel,
    setFieldValue,
    values,
  } = props;

  const handleSelectTag = useCallback(
    (value) => setFieldValue('tagIds', value),
    [setFieldValue]
  );

  const handleMobileInputChange = useCallback(
    (e) => {
      const formattedPhoneNumber = formatPhoneNumber(e.target.value);
      setFieldValue('primaryContactMobile', formattedPhoneNumber);
    },
    [setFieldValue]
  );

  return (
    <Form data-testid="user-form-primary-contact" onSubmit={handleSubmit}>
      <FormGroup>
        <FormLabel for="primaryContactFirstName" isRequired>
          First Name
        </FormLabel>
        <FormField
          data-testid="field-primary-contact-first-name"
          name="primaryContactFirstName"
        />
      </FormGroup>
      <FormGroup>
        <FormLabel for="primaryContactLastName" isRequired>
          Last Name
        </FormLabel>
        <FormField
          data-testid="field-primary-contact-last-name"
          name="primaryContactLastName"
        />
      </FormGroup>
      <FormGroup>
        <FormLabel for="primaryContactEmail" isRequired>
          Email
        </FormLabel>
        <FormField
          data-testid="field-primary-contact-email"
          name="primaryContactEmail"
        />
      </FormGroup>
      <Row>
        <Col>
          <FormGroup>
            <FormLabel for="tagIds" isRequired>
              Creditor Type
            </FormLabel>
            <FormFieldSelect
              data-testid="field-tag-select"
              error={errors.tagIds}
              options={props.marketplaceTagFormOptions}
              onChange={handleSelectTag}
              value={values.tagIds}
            />
          </FormGroup>
        </Col>
      </Row>
      <FormGroup>
        <FormLabel for="gstIncluded">Creditor collects GST?</FormLabel>
        <FormFieldBoolean name="gstIncluded" />
      </FormGroup>
      <Row>
        <Col md={6}>
          <FormGroup>
            <FormLabel
              for="primaryContactMobile"
              helpText="This mobile number will be used for SMS communications">
              Mobile
            </FormLabel>
            <FormField
              data-testid="field-primary-contact-mobile"
              name="primaryContactMobile"
              placeholder="0400 000 000"
              onChange={handleMobileInputChange}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <FormLabel for="primaryContactDob">Date of birth</FormLabel>
            <FormFieldDate name="primaryContactDob" />
          </FormGroup>
        </Col>
      </Row>
      <FormFieldsForAddress setFieldValue={setFieldValue} />
      <FormButtons
        isRequired
        isSubmitting={isSubmitting}
        isValid={isValid && dirty}
        onCancel={onCancel}
      />
    </Form>
  );
};

const config = {
  displayName: 'ExternalCreditorFormMarketplaceDetails',
  enableReinitialize: true,

  mapPropsToValues: (props) => {
    const { externalCreditor, isTestMode } = props;

    return {
      address: defaultPropsForAddress(externalCreditor.address || {}),
      gstIncluded:
        typeof externalCreditor.gstIncluded !== 'undefined'
          ? `${externalCreditor.gstIncluded}`
          : true,
      id: externalCreditor.id || '',
      isTestMode: !!isTestMode,
      primaryContactDob: externalCreditor.primaryContactDob || '',
      primaryContactEmail: externalCreditor.primaryContactEmail || '',
      primaryContactFirstName: externalCreditor.primaryContactFirstName || '',
      primaryContactLastName: externalCreditor.primaryContactLastName || '',
      primaryContactMobile:
        formatPhoneNumber(externalCreditor.primaryContactMobile) || '',
      tagIds: externalCreditor.tagIds || [],
    };
  },

  validationSchema: Yup.object().shape({
    address: Yup.object().shape(validationSchemaForAddress),
    isExternalCreditor: Yup.bool(),
    isTestMode: Yup.bool(),
    primaryContactEmail: Yup.string()
      .required('Email is required')
      .email('Invalid email address'),
    primaryContactFirstName: Yup.string().required('First name is required'),
    primaryContactLastName: Yup.string().required('Last name is required'),
    primaryContactMobile: Yup.string()
      .transform((value) => value.replace(/\s/g, ''))
      .matches(
        /^$|^(\+?[0-9]{2})?[0-9]{10}$/,
        'Valid mobile number is required'
      ),
    tagIds: Yup.array().when('isTestMode', {
      is: false,
      then: Yup.array()
        .min(1, 'At least one tag is required')
        .required('Creditor type is required'),
    }),
  }),

  handleSubmit: (values, { props }) => {
    const { address, isTestMode, primaryContactMobile, ...params } = values;
    props.onSubmit({
      ...params,
      primaryContactMobile: primaryContactMobile
        ? removeSpaces(primaryContactMobile)
        : '',
      addressAttributes: address,
    });
  },
};

ExternalCreditorFormMarketplaceDetailsComponent.propTypes = {
  errors: PropTypes.object,
  externalCreditor: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isSubmitting: PropTypes.bool.isRequired,
  isTestMode: PropTypes.bool,
  isValid: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
  marketplaceTagFormOptions: PropTypes.array,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object,
};

export const ExternalCreditorFormMarketplaceDetails = compose(
  withFormik(config),
  withOnComplete
)(ExternalCreditorFormMarketplaceDetailsComponent);
