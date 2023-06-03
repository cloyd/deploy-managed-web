import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Form } from 'reactstrap';
import * as Yup from 'yup';

import { usePrevious } from '../../../hooks';
import { FormButtons } from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';
import { withRouterHash } from '../../Route/withRouterHash';
import {
  MarketplaceFieldsTradieInvite,
  mapTradieInviteFieldsProps,
  validationSchemaForTradieInviteFields,
} from '../Fields';

const FormComponent = (props) => {
  const {
    handleReset,
    handleSubmit,
    isReset,
    isSubmitting,
    setFieldValue,
    values,
    errors,
  } = props;
  const wasSubmitting = usePrevious(isSubmitting);

  useEffect(() => {
    if (isReset && wasSubmitting) {
      handleReset();
    }
  }, [handleReset, isReset, wasSubmitting]);

  return (
    <Form>
      <MarketplaceFieldsTradieInvite
        setFieldValue={setFieldValue}
        values={values}
        errors={errors}
      />
      {props.children}
      <FormButtons
        btnSubmit={{
          text: 'Invite tradie',
        }}
        isSubmitting={props.isSubmitting}
        isValid={props.isValid}
        onCancel={props.onCancel}
        onSubmit={handleSubmit}
      />
    </Form>
  );
};

FormComponent.propTypes = {
  children: PropTypes.node,
  errors: PropTypes.object,
  handleReset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  isReset: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  onCancel: PropTypes.func,
  onComplete: PropTypes.func,
  onSubmit: PropTypes.func,
  search: PropTypes.string,
  setFieldValue: PropTypes.func.isRequired,
  tradie: PropTypes.object,
  values: PropTypes.object.isRequired,
  isPreferred: PropTypes.bool,
};

FormComponent.defaultProps = {
  hasError: false,
  isSubmitting: false,
  isReset: false,
  isValid: false,
  isPreferred: false,
};

const config = {
  displayName: 'FormInviteTradie',
  enableReinitialize: true,

  mapPropsToValues: (props) => {
    const { search, tradie, isPreferred } = props;

    const values = mapTradieInviteFieldsProps(tradie, search);

    return {
      ...values,
      preferredTradie: isPreferred || values.preferredTradie,
      isPreferred,
    };
  },

  validationSchema: Yup.object().shape({
    ...validationSchemaForTradieInviteFields,
  }),

  handleSubmit: (values, { props }) => props.onSubmit(values),
};

export const MarketplaceFormInviteTradie = compose(
  withRouterHash,
  withFormik(config),
  withOnComplete
)(FormComponent);
