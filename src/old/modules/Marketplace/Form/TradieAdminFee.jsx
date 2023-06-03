import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React from 'react';
import { Form, FormGroup } from 'reactstrap';
import * as Yup from 'yup';

import { FormButtons, FormFieldRadio } from '../../Form';

const FormComponent = (props) => {
  const { handleChange, handleSubmit, values } = props;

  return (
    <Form className="d-flex" onSubmit={handleSubmit}>
      <FormGroup className="d-flex mt-1 mb-0 mr-3">
        <FormFieldRadio
          className="pl-1"
          isChecked={
            values.agencyPaysAdminFee === true ||
            values.agencyPaysAdminFee === 'true'
          }
          id="agencyPaysAdminFee-agree"
          name="agencyPaysAdminFee"
          title="Yes"
          value={true}
          onChange={handleChange}
        />
        <FormFieldRadio
          isChecked={
            values.agencyPaysAdminFee === false ||
            values.agencyPaysAdminFee === 'false'
          }
          id="agencyPaysAdminFee-disagree"
          name="agencyPaysAdminFee"
          title="No"
          value={false}
          onChange={handleChange}
        />
      </FormGroup>
      <FormButtons onCancel={props.onCancel} />
    </Form>
  );
};

FormComponent.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  tradie: PropTypes.object,
  values: PropTypes.object.isRequired,
};

FormComponent.defaultProps = {
  hasError: false,
  isSubmitting: false,
  isValid: false,
  tradie: {},
};

const config = {
  displayName: 'FormTradieAdminFee',
  enableReinitialize: true,

  mapPropsToValues: ({ tradie }) => ({
    agencyPaysAdminFee: tradie.agencyPaysAdminFee || false,
  }),

  validationSchema: Yup.object().shape({
    agencyPaysAdminFee: Yup.boolean().required('Is marketplace fee included?'),
  }),

  handleSubmit: (values, { props }) => props.onSubmit(values),
};

export const MarketplaceFormTradieAdminFee = compose(withFormik(config))(
  FormComponent
);
