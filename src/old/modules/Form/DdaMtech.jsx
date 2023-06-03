import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'reactstrap';

import { FormButtons } from '.';

const FormDdaMtechComponent = (props) => {
  const { handleSubmit, isSubmitting } = props;

  return (
    <Form>
      <FormButtons
        className="justify-content-start"
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </Form>
  );
};

FormDdaMtechComponent.propTypes = {
  errors: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};

FormDdaMtechComponent.defaultProps = {
  isSubmitting: false,
};

const formikEnhancer = withFormik({
  displayName: 'DdaMtech',

  mapPropsToValues: () => ({
    ddaMtech: true,
    ddaMtechAgreement: true,
  }),

  handleSubmit: (values, { props }) => props.onSubmit(),
});

export const FormDdaMtech = formikEnhancer(FormDdaMtechComponent);
