import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { CardBody, Col, Form, Row } from 'reactstrap';
import * as Yup from 'yup';

import {
  FormButtons,
  FormFieldsForSettings,
  FormLabelInput,
  defaultPropsForSettings,
  validationSchemaForSettings,
} from '.';
import { Loading } from '../../containers/Loading';
import { useIsMobile, usePrevious } from '../../hooks';
import { fromPercent, toCents } from '../../utils';
import { CardLight } from '../Card';
import { ModalConfirm } from '../Modal';

const PropertyAuthoritiesComponent = (props) => {
  const prevIsLoading = usePrevious(props.isLoading);
  const isMobile = useIsMobile();
  const [isPropertyLoading, setIsPropertyLoading] = useState(true);
  const {
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid,
    onSubmit,
    onCancel,
    property,
    touched,
    values,
    handleModalOpen,
    isConfirmationOpen,
    setValues,
  } = props;

  useEffect(() => {
    const { hasError, isLoading, isSubmitting, resetForm, setSubmitting } =
      props;

    // Update isSubmitting or reset
    if (isSubmitting && prevIsLoading && !isLoading) {
      hasError ? setSubmitting(false) : resetForm();
    }
  }, [prevIsLoading, props]);

  const handleSubmitAuthoritiesEdit = useCallback(() => {
    const {
      floatDollars,
      managementFee,
      adminFee,
      advertisingFee,
      workOrderLimit,
      lettingFee,
      leaseRenewal,
      ...params
    } = values;

    onSubmit({
      ...params,
      lettingFeeMetric: fromPercent(lettingFee),
      leaseRenewalMetric: fromPercent(leaseRenewal),
      floatCents: toCents(floatDollars),
      adminFeeCents: toCents(adminFee),
      advertisingFeeCents: toCents(advertisingFee),
      workOrderLimitCents: toCents(workOrderLimit),
      percentageManagementFee: fromPercent(managementFee),
    });
    handleModalOpen();
  }, [values, onSubmit, handleModalOpen]);

  useEffect(() => {
    if (property.hasOwnProperty('lettingFee')) {
      setValues({
        ...values,
        ...defaultPropsForSettings({ property }),
      });
      setIsPropertyLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property]);

  return isPropertyLoading ? (
    <Loading isOpen={isPropertyLoading} isLoading={isPropertyLoading} />
  ) : (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col xs={12} sm={12} className="mb-3">
          <CardLight title="Authorities & Agreements" className="d-flex h-100">
            <CardBody
              className={`d-flex ${isMobile ? 'flex-column' : 'flex-row'}`}>
              <Col xs={12} sm={6}>
                <FormFieldsForSettings {...props} />
              </Col>
              <Col xs={12} sm={6}>
                <FormLabelInput
                  className="mb-3"
                  label="Special authorities"
                  type="textarea"
                  name="specialAuthorities"
                  value={values.specialAuthorities}
                  isTouched={touched.specialAuthorities}
                  error={errors.specialAuthorities}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  rows="4"
                  disabled={property.isArchived}
                />
                <FormLabelInput
                  className="mb-3"
                  label="Internal Notes"
                  type="textarea"
                  name="internalNotes"
                  value={values.internalNotes}
                  isTouched={touched.internalNotes}
                  error={errors.internalNotes}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  rows="4"
                  disabled={property.isArchived}
                />
                <FormLabelInput
                  label="Banner Alert (200 characters)"
                  type="textarea"
                  name="bannerAlert"
                  value={values.bannerAlert}
                  isTouched={touched.bannerAlert}
                  error={errors.bannerAlert}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  rows="5"
                  disabled={property.isArchived}
                />
              </Col>
            </CardBody>
          </CardLight>
        </Col>
      </Row>
      <FormButtons
        onCancel={onCancel}
        isOverlayed
        isSubmitting={isSubmitting}
        isValid={isValid}
      />
      <ModalConfirm
        data-testid="modal-property-authorities-edit"
        isOpen={!!isConfirmationOpen}
        size="md"
        title="Confirmation"
        onCancel={onCancel}
        onSubmit={handleSubmitAuthoritiesEdit}>
        <p>
          Are you sure you would like to edit the property Authorities & Fees
        </p>
      </ModalConfirm>
    </Form>
  );
};

PropertyAuthoritiesComponent.propTypes = {
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  property: PropTypes.object.isRequired,
  resetForm: PropTypes.func.isRequired,
  setSubmitting: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  isConfirmationOpen: PropTypes.bool,
  handleModalOpen: PropTypes.func,
  setValues: PropTypes.func.isRequired,
};

const formikEnhancer = withFormik({
  displayName: 'FormPropertyAuthorities',

  mapPropsToValues: (props) => {
    const { property } = props;
    const { id, internalNotes, specialAuthorities, bannerAlert } =
      property || {};

    return {
      id,
      ...defaultPropsForSettings(props),
      specialAuthorities: specialAuthorities || '',
      internalNotes: internalNotes || '',
      bannerAlert: bannerAlert || '',
    };
  },

  validationSchema: () => {
    const schema = {
      ...validationSchemaForSettings,
    };
    return Yup.object().shape(schema);
  },

  handleSubmit: (values, { props }) => {
    props.handleModalOpen();
  },
});

export const FormPropertyAuthorities = formikEnhancer(
  PropertyAuthoritiesComponent
);
