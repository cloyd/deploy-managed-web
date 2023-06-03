import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Form, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import { EXTERNAL_CREDITOR_CLASSIFICATIONS } from '../../../redux/users';
import { useExternalCreditorTypeFilter } from '../../ExternalCreditor';
import {
  FormButtons,
  FormField,
  FormFieldBoolean,
  FormFieldDate,
  FormLabel,
} from '../../Form';
import {
  FormFieldsForAddress,
  defaultPropsForAddress,
  validationSchemaForAddress,
} from '../../Form/FieldsForAddress';
import { withOnComplete } from '../../Form/withOnComplete';

/**
 * Creditor contacts version of external creditor details form, its intended use:
 * - when Marketplace disabled, for any non-marketplace external creditor
 * - when Marketplace enabled, for any service providers
 */
const ExternalCreditorFormDetailsComponent = (props) => {
  const {
    handleSubmit,
    isMarketplaceEnabled,
    isSubmitting,
    isValid,
    dirty,
    onCancel,
    setFieldValue,
  } = props;
  const creditorTypes = useExternalCreditorTypeFilter();

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
      {!isMarketplaceEnabled && (
        <Row>
          <Col xs={12} md={6}>
            <FormGroup>
              <FormLabel for="typeOf" isRequired>
                Creditor Type
              </FormLabel>
              <FormField
                data-testid="field-type-of"
                name="typeOf"
                type="select">
                <option value="">-- Select --</option>
                {creditorTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </FormField>
            </FormGroup>
          </Col>
          <Col xs={12} md={6}>
            <FormGroup>
              <FormLabel for="classification" isRequired>
                Classification
              </FormLabel>
              <FormField
                data-testid="field-classification"
                name="classification"
                type="select">
                <option value="">-- Select --</option>
                {Object.keys(EXTERNAL_CREDITOR_CLASSIFICATIONS).map((key) => (
                  <option
                    key={EXTERNAL_CREDITOR_CLASSIFICATIONS[key]}
                    value={EXTERNAL_CREDITOR_CLASSIFICATIONS[key]}>
                    {startCase(EXTERNAL_CREDITOR_CLASSIFICATIONS[key])}
                  </option>
                ))}
              </FormField>
            </FormGroup>
          </Col>
        </Row>
      )}
      <Row>
        <Col xs={12} sm={6}>
          <FormGroup>
            <FormLabel for="gstIncluded">Creditor collects GST?</FormLabel>
            <FormFieldBoolean name="gstIncluded" />
          </FormGroup>
        </Col>
        <Col xs={12} sm={6}>
          <FormGroup>
            <FormLabel for="primaryContactMobile" isRequired>
              Mobile
            </FormLabel>
            <FormField
              data-testid="field-primary-contact-mobile"
              name="primaryContactMobile"
              type="tel"
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={6}>
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
  displayName: 'ExternalCreditorFormDetails',
  enableReinitialize: true,

  mapPropsToValues: (props) => {
    const { isMarketplaceEnabled, externalCreditor } = props;

    return {
      isMarketplaceEnabled,
      ...(!isMarketplaceEnabled && {
        classification: externalCreditor?.classification,
        typeOf: externalCreditor?.typeOf,
      }),

      address: defaultPropsForAddress(externalCreditor?.address || {}),
      gstIncluded:
        externalCreditor?.gstIncluded !== undefined
          ? externalCreditor?.gstIncluded
          : true,
      id: externalCreditor?.id,

      primaryContactDob: externalCreditor?.primaryContactDob || '',
      primaryContactEmail: externalCreditor?.primaryContactEmail || '',
      primaryContactFirstName: externalCreditor?.primaryContactFirstName || '',
      primaryContactLastName: externalCreditor?.primaryContactLastName || '',
      primaryContactMobile: externalCreditor?.primaryContactMobile || '',
    };
  },

  validationSchema: Yup.object().shape({
    isMarketplaceEnabled: Yup.bool(),
    address: Yup.object().shape(validationSchemaForAddress),
    classification: Yup.string().when('isMarketplaceEnabled', {
      is: false,
      then: Yup.string().required('Creditor classification is required'),
    }),
    isExternalCreditor: Yup.bool(),
    primaryContactEmail: Yup.string()
      .required('Email is required')
      .email('Invalid email address'),
    primaryContactFirstName: Yup.string().required('First name is required'),
    primaryContactLastName: Yup.string().required('Last name is required'),
    primaryContactMobile: Yup.number()
      .required('Mobile is required')
      .typeError('Must be a number'),
    typeOf: Yup.string().when('isMarketplaceEnabled', {
      is: false,
      then: Yup.string().required('Creditor type is required'),
    }),
  }),

  handleSubmit: (values, { props }) => {
    const { address, isMarketplaceEnabled, ...params } = values;
    props.onSubmit({ ...params, addressAttributes: address });
  },
};

ExternalCreditorFormDetailsComponent.propTypes = {
  externalCreditor: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
  isMarketplaceEnabled: PropTypes.bool,
  isSubmitting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export const ExternalCreditorFormDetails = compose(
  withFormik(config),
  withOnComplete
)(ExternalCreditorFormDetailsComponent);
