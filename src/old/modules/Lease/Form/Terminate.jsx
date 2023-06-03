import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Col, Form, Row } from 'reactstrap';
import * as Yup from 'yup';

import { useIsOpen } from '../../../hooks';
import { TERMINATION_REASON } from '../../../redux/lease/constants';
import {
  FormButtons,
  FormFieldDate,
  FormLabel,
  FormLabelInput,
} from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';
import { ModalConfirm } from '../../Modal';

const LeaseFormTerminateComponent = ({
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  isValid,
  onCancel,
  touched,
  values,
}) => {
  const [isOpen, actions] = useIsOpen(handleSubmit);

  const openModal = useCallback(
    (e) => {
      e.preventDefault();
      actions.handleOpen();
    },
    [actions]
  );

  return (
    <Form onSubmit={openModal}>
      <Row>
        <Col xs={6} md={4} className="pr-1">
          <FormLabel for="terminationDate">Date</FormLabel>
          <FormFieldDate name="terminationDate" />
        </Col>
        <Col xs={6} md={4} className="pl-1">
          <FormLabelInput
            type="select"
            label="Reason"
            name="terminationReason"
            value={values.terminationReason}
            isTouched={touched.terminationReason}
            error={errors.terminationReason}
            handleChange={handleChange}
            handleBlur={handleBlur}>
            {TERMINATION_REASON.map((value, i) => (
              <option key={`reason-${i}`} value={value}>
                {value}
              </option>
            ))}
          </FormLabelInput>
        </Col>
        <Col xs={12} md={4} className="mt-3 align-self-sm-end mb-sm-1">
          <FormButtons
            className="align-self-start justify-content-sm-end"
            isValid={isValid}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
          />
        </Col>
      </Row>
      <ModalConfirm
        body="Please ensure the termination dates are correct. Once the final rental item is completed, the lease termination cannot be cancelled or changed."
        btnSubmit={{ color: 'danger', text: 'Yes' }}
        isOpen={isOpen}
        title="Are you sure?"
        onCancel={actions.handleClose}
        onSubmit={actions.handleSubmit}
      />
    </Form>
  );
};

LeaseFormTerminateComponent.propTypes = {
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  lease: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
};

const config = {
  displayName: 'LeaseFormTerminate',
  isInitialValid: true,

  mapPropsToValues: ({ lease }) => ({
    id: lease.id,
    terminationDate: new Date(),
    terminationReason: TERMINATION_REASON[0],
  }),

  validationSchema: Yup.object().shape({
    terminationDate: Yup.string().required('Date is required'),
    terminationReason: Yup.string().required('Reason is required'),
  }),

  handleSubmit: (values, { props }) => props.onSubmit(values),
};

export const LeaseFormTerminate = compose(
  withFormik(config),
  withOnComplete
)(LeaseFormTerminateComponent);
