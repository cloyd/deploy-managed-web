import { withFormik } from 'formik';
import flow from 'lodash/fp/flow';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Form, FormGroup } from 'reactstrap';
import * as Yup from 'yup';

import { USER_TYPES } from '../../../redux/users';
import {
  FormButtons,
  FormField,
  FormLabel,
  FormTypeaheadUser,
} from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';

const config = {
  displayName: 'TaskFormQuote',

  mapPropsToValues: (props) => ({
    externalCreditorId: '',
    note: '',
    propertyId: props.task.propertyId,
    taskId: props.task.id,
    typeOf: '',
  }),

  validationSchema: Yup.object().shape({
    externalCreditorId: Yup.string().required('Tradie is required'),
    note: Yup.string().required('Message is required'),
  }),

  handleSubmit: (values, { props }) => props.onSubmit(values),
};

const TaskFormQuoteComponent = (props) => {
  const {
    className,
    handleSubmit,
    isSubmitting,
    isValid,
    dirty,
    onCancel,
    setFieldValue,
  } = props;
  const [selectedCreditor, setSelectedCreditor] = useState([]);

  const handleSearch = useCallback(
    (value = {}) => {
      if (value.id && value.typeOf) {
        setFieldValue('externalCreditorId', value.id);
        setFieldValue('typeOf', value.typeOf);
        setSelectedCreditor([value]);
      } else {
        setFieldValue('externalCreditorId', '');
        setFieldValue('typeOf', '');
        setSelectedCreditor([]);
      }
    },
    [setFieldValue]
  );

  return (
    <Form onSubmit={handleSubmit} className={className}>
      <FormGroup>
        <FormLabel for="search" isRequired>
          Request quote from
        </FormLabel>
        <div className="col-lg-5 px-0">
          <FormTypeaheadUser
            name="search"
            type={USER_TYPES.externalCreditor}
            selected={selectedCreditor}
            onChange={handleSearch}
          />
        </div>
        <FormField name="typeOf" hidden />
        <FormField name="externalCreditorId" hidden />
      </FormGroup>
      <FormGroup>
        <FormLabel for="note" isRequired>
          Message
        </FormLabel>
        <FormField name="note" rows={6} type="textarea" />
      </FormGroup>
      <FormButtons
        btnSubmit={{ text: 'Send' }}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isValid={isValid && dirty}
        isOverlayed
      />
    </Form>
  );
};

TaskFormQuoteComponent.propTypes = {
  className: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onComplete: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  task: PropTypes.object,
};

TaskFormQuoteComponent.defaultProps = {
  task: {},
};

export const TaskFormQuote = flow(
  withOnComplete,
  withFormik(config)
)(TaskFormQuoteComponent);
