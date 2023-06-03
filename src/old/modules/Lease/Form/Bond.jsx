import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Form, Row } from 'reactstrap';
import * as Yup from 'yup';

import { dollarToCents, toDollars } from '../../../utils';
import { FormButtons, FormLabelInput } from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';

const LeaseFormBondComponent = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    isValid,
    onCancel,
    touched,
    values,
  } = props;

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col xs={12} sm={4} lg={3} className="mb-3 mb-lg-0">
          <FormLabelInput
            label="Bond Id"
            name="bondNumber"
            step="any"
            value={values.bondNumber}
            isTouched={touched.bondNumber}
            error={errors.bondNumber}
            handleBlur={handleBlur}
            handleChange={handleChange}
          />
        </Col>
        <Col xs={12} sm={4} lg={3} className="mb-3 mb-lg-0">
          <FormLabelInput
            label="Bond Amount"
            name="bondCents"
            step="any"
            type="number"
            prepend="$"
            value={values.bondCents}
            isTouched={touched.bondCents}
            error={errors.bondCents}
            handleBlur={handleBlur}
            handleChange={handleChange}
          />
        </Col>
        <Col xs={12} lg={6} className="align-self-sm-end mb-sm-1">
          <FormButtons
            isValid={isValid}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
          />
        </Col>
      </Row>
    </Form>
  );
};

LeaseFormBondComponent.propTypes = {
  errors: PropTypes.object.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  lease: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setTouched: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
};

const config = {
  displayName: 'LeaseFormBond',

  mapPropsToValues: ({ lease }) => ({
    bondNumber: lease.bondNumber || '',
    bondCents: toDollars(lease.bondCents),
    id: lease.id,
  }),

  validationSchema: () => {
    return Yup.object().shape({
      bondNumber: Yup.string()
        .required('Bond ID is required')
        .matches(
          /^(\w|-)+$/,
          'Bond ID may only contain letters, numbers and some special characters like underscores and hyphens'
        ),
      bondCents: Yup.number().min(
        0,
        'Bond amount must be equal or greater than 0'
      ),
    });
  },

  handleSubmit: (values, { props }) =>
    props.onSubmit({ ...values, bondCents: dollarToCents(values.bondCents) }),
};

export const LeaseFormBond = compose(
  withFormik(config),
  withOnComplete
)(LeaseFormBondComponent);
