import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'reactstrap';
import * as Yup from 'yup';

import {
  FormButtons,
  FormFieldsForSettings,
  defaultPropsForSettings,
  validationSchemaForSettings,
} from '.';
import { fromPercent, toCents } from '../../utils';
import { withOnComplete } from './withOnComplete';

const FormSettingsComponent = (props) => {
  const { handleSubmit, isSubmitting, isValid, onCancel } = props;

  return (
    <Form onSubmit={handleSubmit}>
      <FormFieldsForSettings {...props} />
      <FormButtons
        isValid={isValid}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </Form>
  );
};

FormSettingsComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
};

const config = {
  displayName: 'FormSettings',
  mapPropsToValues: (props) => defaultPropsForSettings(props),
  validationSchema: () => Yup.object().shape(validationSchemaForSettings),
  handleSubmit: (values, { props }) => {
    props.onSubmit({
      id: props.property.id,
      ...values,
      adminFeeCents: toCents(values.adminFee),
      advertisingFeeCents: toCents(values.advertisingFee),
      workOrderLimitCents: toCents(values.workOrderLimit),
      floatCents: toCents(values.floatDollars),
      percentageManagementFee: fromPercent(values.managementFee),
    });
  },
};

export const FormSettings = compose(
  withFormik(config),
  withOnComplete
)(FormSettingsComponent);
