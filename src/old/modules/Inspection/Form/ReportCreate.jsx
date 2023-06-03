import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { Form, FormGroup } from 'reactstrap';
import * as Yup from 'yup';

import { useInspectionTypes } from '..';
import { INSPECTION_TYPE } from '../../../redux/inspection';
import {
  FormButtons,
  FormField,
  FormFieldDate,
  FormFieldLeases,
  FormLabel,
} from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';

/**
 * Create a report given an array of leases
 */
const FormComponent = (props) => {
  const { leases, values } = props;
  const inspectionTypes = useInspectionTypes(leases);

  const leaseOptions = useMemo(() => {
    switch (values.type) {
      // Routine inspections do not require tenants
      case INSPECTION_TYPE.ROUTINE:
        return leases;

      case INSPECTION_TYPE.INGOING:
        return leases.filter(
          (lease) =>
            !!lease.primaryTenant &&
            lease.status !== 'expired' &&
            lease.status !== 'cancelled'
        );

      case INSPECTION_TYPE.OUTGOING:
        return leases.filter(
          (lease) => !!lease.primaryTenant && lease.status !== 'cancelled'
        );

      default:
        return [];
    }
  }, [leases, values.type]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    props.setFieldValue('leaseId', '');
  }, [values.type]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <Form
      data-testid="form-inspection-report-create"
      onSubmit={props.handleSubmit}>
      {!props.reportType && (
        <FormGroup>
          <FormLabel for="type">Inspection type</FormLabel>
          <FormField name="type" type="select">
            <option value="">-- Select --</option>
            {inspectionTypes.map((type) => (
              <option key={`inspection-type-${type}`} value={type}>
                {startCase(type)}
              </option>
            ))}
          </FormField>
        </FormGroup>
      )}
      <FormGroup>
        <FormLabel for="leaseId">Lease</FormLabel>
        <FormFieldLeases
          defaultLabelText="Complete report with no tenancy"
          leases={leaseOptions}
          name="leaseId"
          disabled={!values.type}
        />
      </FormGroup>
      <FormGroup className="mb-5">
        <FormLabel for="inspectionDate">Inspection date</FormLabel>
        <FormFieldDate name="inspectionDate" disabled={!values.type} />
      </FormGroup>
      <FormButtons
        btnSubmit={props.btnSubmit}
        isSpaced={true}
        isValid={props.isValid}
        onSubmit={props.handleSubmit}
        onCancel={props.onCancel}
      />
    </Form>
  );
};

FormComponent.propTypes = {
  btnSubmit: PropTypes.object,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  leases: PropTypes.array,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  reportType: PropTypes.string,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object,
};

FormComponent.defaultProps = {
  isLoading: false,
  isSubmitting: false,
  isValid: false,
  leases: [],
};

const config = {
  displayName: 'InspectionFormReportCreate',

  mapPropsToValues: (props) => ({
    type: props.reportType || '',
  }),

  validationSchema: () =>
    Yup.object().shape({
      inspectionDate: Yup.date().required('Inspection date is required'),
      leaseId: Yup.string().required('Lease is required'),
      type: Yup.string().required('Inspection type is required'),
    }),

  handleSubmit: (values, { props, setSubmitting }) => {
    props.onSubmit(values);
    setSubmitting(false);
  },
};

export const InspectionFormReportCreate = compose(
  withFormik(config),
  withOnComplete
)(FormComponent);
