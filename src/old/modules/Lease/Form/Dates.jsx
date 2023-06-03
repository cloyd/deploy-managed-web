import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Col, Form, Row } from 'reactstrap';

import { FREQUENCY_DATES } from '../../../redux/lease';
import {
  FormButtons,
  FormField,
  FormFieldDate,
  FormLabel,
  FormOptionsList,
} from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';
import { ModalConfirm } from '../../Modal';
import { LeaseFormWarning } from '../Form';

const LeaseFormDatesComponent = (props) => {
  const {
    handleSubmit,
    isSubmitting,
    isValid,
    onCancel,
    setFieldValue,
    values,
    handleChangeLeaseEnd,
    lease,
  } = props;

  const [showWarning, setShowWarning] = useState(false);

  const firstPaymentDatePickerProps = useMemo(
    () => ({
      minDate: new Date(lease.allowedMinStartDate),
      maxDate: new Date(lease.allowedMaxStartDate),
    }),
    [lease.allowedMaxStartDate, lease.allowedMinStartDate]
  );

  const hideModal = useCallback((e) => {
    if (e.preventDefault) e.preventDefault();
    setShowWarning(false);
  }, []);

  const handleChangeDate = useCallback(
    (key) => (date) => !date && setFieldValue(`${key}Frequency`, undefined),
    [setFieldValue]
  );

  const handleCancelWarning = useCallback(() => {
    setFieldValue('startDate', lease.startDate);
    setShowWarning(false);
  }, [lease.startDate, setFieldValue]);

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Alert color="warning" className="col-12">
            Note: Lease renewal tasks are automatically generated 90 days before
            the lease end date.
          </Alert>
        </Row>
        <Row className="mb-3">
          <Col xs={12} sm={4} lg={3}>
            <FormLabel for="leaseStartDate">Lease Start</FormLabel>
            <FormFieldDate name="leaseStartDate" />
          </Col>
          <Col xs={12} sm={4} lg={3}>
            <FormLabel for="endDate">Lease End</FormLabel>
            <FormFieldDate name="endDate" onChange={handleChangeLeaseEnd} />
          </Col>
          <Col xs={12} sm={4} lg={3}>
            <FormLabel for="tenantStartDate">
              Living in property since
            </FormLabel>
            <FormFieldDate name="tenantStartDate" />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs={12} sm={4} lg={3}>
            <FormLabel for="startDate">First Payment Date</FormLabel>
            <FormFieldDate
              name="startDate"
              datePickerProps={firstPaymentDatePickerProps}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs={6} sm={4} lg={3}>
            <FormLabel for="inspectionDate">Next Inspection</FormLabel>
            <FormFieldDate
              name="inspectionDate"
              onChange={handleChangeDate('inspectionDate')}
            />
          </Col>
          <Col xs={6} sm={4} lg={3}>
            <FormLabel for="inspectionDateFrequency">
              Inspection Frequency
            </FormLabel>
            <FormField name="inspectionDateFrequency" type="select">
              <FormOptionsList
                hasBlank={!values.inspectionDate}
                options={FREQUENCY_DATES}
                name="inspectionDateFrequency"
              />
            </FormField>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs={6} sm={4} lg={3}>
            <FormLabel for="reviewDate">Next Rent Review</FormLabel>
            <FormFieldDate
              name="reviewDate"
              onChange={handleChangeDate('reviewDate')}
            />
          </Col>
          <Col xs={6} sm={4} lg={3}>
            <FormLabel for="reviewDateFrequency">Review Frequency</FormLabel>
            <FormField name="reviewDateFrequency" type="select">
              <FormOptionsList
                hasBlank={!values.reviewDate}
                options={FREQUENCY_DATES}
                name="reviewDateFrequency"
              />
            </FormField>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="align-self-sm-end mb-sm-1 mt-lg-3">
            <FormButtons
              isValid={isValid}
              isSubmitting={isSubmitting}
              onCancel={onCancel}
            />
          </Col>
        </Row>
      </Form>
      {/* Modal for past first payment date Alert Confirmation */}
      <ModalConfirm isOpen={showWarning} size="lg" title="Warning">
        <LeaseFormWarning onSubmit={hideModal} onCancel={handleCancelWarning} />
      </ModalConfirm>
    </>
  );
};

LeaseFormDatesComponent.propTypes = {
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  lease: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setTouched: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  handleChangeLeaseEnd: PropTypes.func.isRequired,
};

const config = {
  displayName: 'LeaseFormDates',

  validate: (values, props) => {
    const errors = {};

    // check if first payment date changed
    if (props.lease.startDate !== values.startDate) {
      const firstPaymentDate = new Date(values.startDate);

      // Only allow plus or minus 1 month from the lease start date
      if (
        isBefore(firstPaymentDate, new Date(props.lease.allowedMinStartDate)) ||
        isAfter(firstPaymentDate, new Date(props.lease.allowedMaxStartDate))
      ) {
        errors.startDate =
          'Choose up to one month before or after the lease start date.';
      }
    }

    return errors;
  },

  mapPropsToValues: ({ lease }) => ({
    endDate: lease.endDate || '',
    inspectionDate: lease.inspectionDate || '',
    inspectionDateFrequency: lease.inspectionDateFrequency || '',
    leaseStartDate: lease.leaseStartDate || '',
    tenantStartDate: lease.tenantStartDate || '',
    reviewDate: lease.reviewDate || '',
    reviewDateFrequency: lease.reviewDateFrequency || '',
    id: lease.id,
    startDate: lease.startDate || '',
  }),

  handleSubmit: (values, { props }) =>
    props.onSubmit({
      ...values,
      // startDate: new Date(values.startDate).toDateString(),
      markExistingRenewalTaskAsCompleted: props.isExistingRenewalTaskComplete,
    }),
};

export const LeaseFormDates = compose(
  withFormik(config),
  withOnComplete
)(LeaseFormDatesComponent);
