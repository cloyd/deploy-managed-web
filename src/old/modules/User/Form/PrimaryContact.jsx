import { FormikProvider, useFormik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Form, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

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

// import { withOnComplete } from '../../Form/withOnComplete';

const PrimaryContactSchema = Yup.object().shape({
  address: Yup.object().shape(validationSchemaForAddress),
  primaryContactEmail: Yup.string()
    .required('Email is required')
    .email('Invalid email address'),
  primaryContactFirstName: Yup.string().required('First name is required'),
  primaryContactLastName: Yup.string().required('Last name is required'),
  primaryContactMobile: Yup.number()
    .required('Mobile is required')
    .typeError('Must be a number'),
});

export const UserFormPrimaryContact = ({ agency, onCancel, onSubmit }) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      address: defaultPropsForAddress(agency.address || {}),
      gstIncluded:
        agency.gstIncluded !== undefined ? agency.gstIncluded.toString() : true,
      id: agency.id || '',
      primaryContactDob: agency.primaryContactDob || '',
      primaryContactEmail: agency.primaryContactEmail || '',
      primaryContactFirstName: agency.primaryContactFirstName || '',
      primaryContactLastName: agency.primaryContactLastName || '',
      primaryContactMobile: agency.primaryContactMobile || '',
    },
    validationSchema: PrimaryContactSchema,
    onSubmit: (values) => {
      const { address, ...params } = values;
      onSubmit({ ...params, addressAttributes: address });
    },
  });

  return (
    <FormikProvider value={formik}>
      <Form
        data-testid="user-form-primary-contact"
        onSubmit={formik.handleSubmit}>
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
          <Col xs={12} sm={{ size: 'auto' }} className="flex-fill">
            <FormGroup>
              <FormLabel for="gstIncluded">Creditor collects GST ?</FormLabel>
              <FormFieldBoolean name="gstIncluded" />
            </FormGroup>
          </Col>
        </Row>
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
        <FormGroup>
          <FormLabel for="primaryContactDob">Date of birth</FormLabel>
          <FormFieldDate name="primaryContactDob" />
        </FormGroup>
        <FormFieldsForAddress setFieldValue={formik.setFieldValue} />
        <FormButtons
          isRequired
          isSubmitting={formik.isSubmitting}
          isValid={formik.isValid && formik.dirty}
          onCancel={onCancel}
        />
      </Form>
    </FormikProvider>
  );
};

UserFormPrimaryContact.propTypes = {
  agency: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
};

export default UserFormPrimaryContact;
