import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Col, Form, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import { FormButtons, FormFieldBoolean, FormLabel, FormLabelInput } from '.';

class FormBpayComponent extends Component {
  static propTypes = {
    errors: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    hasError: PropTypes.bool,
    isLoading: PropTypes.bool,
    isSubmitting: PropTypes.bool,
    isValid: PropTypes.bool,
    user: PropTypes.object.isRequired,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    setSubmitting: PropTypes.func.isRequired,
    touched: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
  };

  static defaultProps = {
    hasError: false,
    isLoading: false,
    isSubmitting: false,
    isValid: false,
  };

  componentDidUpdate(prevProps) {
    const { hasError, isLoading, isSubmitting, resetForm, setSubmitting } =
      this.props;

    if (isSubmitting && prevProps.isLoading && !isLoading) {
      hasError ? setSubmitting(false) : resetForm();
    }
  }

  render() {
    const {
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      isValid,
      onCancel,
      touched,
      values,
    } = this.props;

    return (
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Row>
            <Col xs={12} sm={{ size: 'auto' }} className="mb-2 flex-fill">
              <FormLabelInput
                label="Biller Name"
                name="name"
                value={values.name}
                isTouched={touched.name}
                error={errors.name}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            </Col>
            <Col xs={12} sm={{ size: 'auto' }} className="mb-2 flex-fill">
              <FormLabelInput
                label="Biller Code"
                name="billerCode"
                value={values.billerCode}
                isTouched={touched.billerCode}
                error={errors.billerCode}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            </Col>
            <Col xs={12} sm={{ size: 'auto' }} className="mb-2 flex-fill">
              <FormLabel for="gstIncluded">Collects GST ?</FormLabel>
              <FormFieldBoolean name="gstIncluded" />
            </Col>
          </Row>
        </FormGroup>
        <FormButtons
          isValid={isValid}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </Form>
    );
  }
}

const formikEnhancer = withFormik({
  displayName: 'FormBpay',
  enableReinitialize: true,

  mapPropsToValues: ({ user }) => {
    return {
      id: user.id,
      name: user.name || '',
      billerCode: user.billerCode || '',
      gstIncluded: user.gstIncluded,
    };
  },

  validationSchema: ({ lease }) => {
    return Yup.object().shape({
      name: Yup.string().required('Bpay name is required'),
      billerCode: Yup.string().required('Bpay biller code is required'),
    });
  },

  handleSubmit: (values, { props }) => {
    props.onSubmit(values);
  },
});

export const FormBpay = formikEnhancer(FormBpayComponent);
