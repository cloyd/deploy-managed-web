import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React from 'react';
import { Alert, Form, FormGroup } from 'reactstrap';
import * as Yup from 'yup';

import { useInspectionTypes } from '..';
import { ContentDefinition } from '../../Content';
import { FormButtons, FormField, FormFieldDate, FormLabel } from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';
import { useLeaseDates } from '../../Lease/hooks';
import { PropertyUserIcon } from '../../Property';

/**
 * Create a report given a single lease
 */
const FormComponent = (props) => {
  const { reportType } = props;
  const lease = props.lease || {};

  const inspectionTypes = useInspectionTypes([lease]);
  const [dates, leaseTermString] = useLeaseDates(lease);

  const isValidType = !reportType || inspectionTypes.includes(reportType);

  return isValidType ? (
    <Form
      data-testid="form-inspection-report-create"
      onSubmit={props.handleSubmit}>
      {!reportType && (
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
        <ContentDefinition label="Lease Term">
          {lease.id ? (
            <>
              {dates.leaseStart} - {dates.end}{' '}
              {leaseTermString || (
                <span className="text-danger">(Expired)</span>
              )}
            </>
          ) : (
            'Draft lease'
          )}
        </ContentDefinition>
      </FormGroup>
      <FormGroup>
        <ContentDefinition label="Tenant">
          {lease.primaryTenant ? (
            <PropertyUserIcon
              role="tenant"
              size={0.4}
              user={lease.primaryTenant}
            />
          ) : (
            '(no tenant)'
          )}
        </ContentDefinition>
      </FormGroup>
      <FormGroup className="mb-5">
        <FormLabel for="inspectionDate">Inspection date</FormLabel>
        <FormFieldDate name="inspectionDate" disabled={!props.values?.type} />
      </FormGroup>
      <FormButtons
        btnSubmit={props.btnSubmit}
        isSpaced={true}
        isValid={props.isValid}
        onSubmit={props.handleSubmit}
        onCancel={props.onCancel}
      />
    </Form>
  ) : (
    <>
      <Alert color="danger">
        Error: a valid lease is required to create this inspection.
      </Alert>
      <FormButtons isSpaced={true} isValid={false} onCancel={props.onCancel} />
    </>
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
  lease: PropTypes.object,
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
};

const config = {
  displayName: 'InspectionFormReportCreate',

  mapPropsToValues: (props) => ({
    leaseId: props.lease?.id,
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

export const InspectionFormReportCreateWithLease = compose(
  withFormik(config),
  withOnComplete
)(FormComponent);
