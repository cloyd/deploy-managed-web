import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Form, FormGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import * as Yup from 'yup';

import { FormButtons } from '@app/modules/Form';
import { withRouterHash } from '@app/modules/Route';
import { UserSearchSelect } from '@app/modules/User';
import {
  EXTERNAL_CREDITOR_CLASSIFICATIONS,
  USER_TYPES,
} from '@app/redux/users';

const JobInviteFormSchema = Yup.object().shape({
  tradieIds: Yup.array().test({
    test: (arr) => arr?.length > 0,
    message: 'You must choose a tradie to invite',
  }),
});

const FormComponent = (props) => {
  const { task, isMulti, onSubmit, onCancel, isLoading } = props;

  const formik = useFormik({
    initialValues: {
      tradieIds: [],
    },
    validationSchema: JobInviteFormSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleChangeTradie = useCallback(
    (value) => formik.setFieldValue('tradieIds', value),
    [formik]
  );

  return (
    <Form onSubmit={formik.handleSubmit}>
      <FormGroup>
        <div className="d-flex mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText className="py-1">
              <FontAwesomeIcon icon={['far', 'store-alt']} />
            </InputGroupText>
          </InputGroupAddon>
          <UserSearchSelect
            canSendInvite
            className="w-100"
            isMulti={isMulti}
            searchParams={{
              perPage: 6,
              classification: EXTERNAL_CREDITOR_CLASSIFICATIONS.tradie,
              propertyId: task.propertyId,
            }}
            type={USER_TYPES.externalCreditor}
            onChange={handleChangeTradie}
          />
        </div>
      </FormGroup>
      <FormButtons
        btnSubmit={{ text: 'Send' }}
        isSubmitting={isLoading}
        isValid={formik.isValid && formik.dirty}
        onCancel={onCancel}
      />
    </Form>
  );
};

FormComponent.propTypes = {
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  isMulti: PropTypes.bool,
  onCancel: PropTypes.func,
  onComplete: PropTypes.func,
  onSubmit: PropTypes.func,
  task: PropTypes.object,
};

FormComponent.defaultProps = {
  hasError: false,
  isMulti: true,
};

export const MarketplaceFormJobInvite = compose(withRouterHash)(FormComponent);
