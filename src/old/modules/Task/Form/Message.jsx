import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Form, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import { VISIBILITY_TYPES } from '../../../redux/users';
import { FormButtons, FormField, FormLabel, FormLabelInput } from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';

const TaskFormMessageComponent = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isDraft,
    isLoading,
    isManager,
    isOverlayed,
    isSubmitting,
    isValid,
    onCancel,
    touched,
    values,
  } = props;

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        {isManager && !isDraft && (
          <Row>
            <Col xs={12} className="my-2" style={{ minWidth: '160px' }}>
              <FormLabel for="replyTo" isRequired>
                Reply to
              </FormLabel>
              <FormField name="replyTo" type="select">
                {VISIBILITY_TYPES.map(({ label, value }) => (
                  <option key={`type-${value}`} value={value}>
                    {label}
                  </option>
                ))}
              </FormField>
            </Col>
          </Row>
        )}
        <FormLabelInput
          type="textarea"
          label="Message"
          name="body"
          rows={6}
          isRequired
          value={values.body}
          isTouched={touched.body}
          error={errors.body}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
      </FormGroup>
      <FormButtons
        onCancel={onCancel}
        isSubmitting={isSubmitting && !isLoading}
        isValid={isValid}
        isOverlayed={isOverlayed}
      />
    </Form>
  );
};

TaskFormMessageComponent.propTypes = {
  dirty: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isDraft: PropTypes.bool,
  isLoading: PropTypes.bool,
  isManager: PropTypes.bool,
  isOverlayed: PropTypes.bool,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  replyTo: PropTypes.string,
  touched: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
};

TaskFormMessageComponent.defaultProps = {
  isOverlayed: true,
};

const config = {
  displayName: 'TaskFormMessage',

  enableReinitialize: true,

  mapPropsToValues: ({ replyTo }) => ({
    body: '',
    replyTo,
  }),

  validationSchema: Yup.object().shape({
    body: Yup.string().required('Message is required'),
  }),

  handleSubmit: (values, { props }) => props.onSubmit(values),
};

export const TaskFormMessage = compose(
  withFormik(config),
  withOnComplete
)(TaskFormMessageComponent);
