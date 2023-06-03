import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Button, CustomInput, Form } from 'reactstrap';
import * as Yup from 'yup';

import {
  FormButtons,
  FormFieldsForUser,
  defaultPropsForUser,
  validationSchemaForUser,
} from '.';
import { usePrevious } from '../../hooks';
import { useRolesContext } from '../../modules/Profile';
import { fetchAgencies } from '../../redux/agency';

const FormComponent = ({
  handleSubmit,
  hasError,
  helpText,
  isDisabled,
  isEditing,
  isSubmitting,
  onCancel,
  onChangePassword,
  resetForm,
  setSubmitting,
  user,
  isLoadingLease,
  type,
  tenantType,
  isCreate,
  isAgencyShown,
  isSearchable,
  // formik props
  setFieldValue,
  values,
  errors,
  isValid,
  dirty,
  touched,
}) => {
  const dispatch = useDispatch();
  const prevIsLoadingLease = usePrevious(isLoadingLease);
  const { isCorporateUser } = useRolesContext();

  useEffect(() => {
    if (isCorporateUser) dispatch(fetchAgencies({}));
  }, [dispatch, isCorporateUser]);

  useEffect(() => {
    if (isSubmitting && prevIsLoadingLease && !isLoadingLease) {
      hasError ? setSubmitting(false) : resetForm();
    }
  }, [
    hasError,
    isLoadingLease,
    isSubmitting,
    prevIsLoadingLease,
    resetForm,
    setSubmitting,
  ]);

  const handleTenantTypeChange = useCallback(
    (e) => {
      setFieldValue('tenantType', e.target.value);
    },
    [setFieldValue]
  );

  return isEditing ? (
    <Form onSubmit={handleSubmit} data-testid="user-edit-form">
      {helpText && <p className={'text-danger'}>{helpText}</p>}
      {/* Show this only for Edit */}
      {type === 'tenant' && user?.id && (
        <div className="d-flex">
          <div className="col-2 h6 px-0">Tenant Type</div>
          <div className="w-100 col-9 h6 d-flex">
            <CustomInput
              checked={values.tenantType === 'private'}
              id="private"
              className="pr-3"
              label="Personally"
              name="tenantType"
              type="radio"
              value="private"
              onChange={handleTenantTypeChange}
            />
            <CustomInput
              checked={values.tenantType === 'company'}
              id="company"
              label="Company / Trust"
              name="tenantType"
              type="radio"
              value="company"
              onChange={handleTenantTypeChange}
            />
          </div>
        </div>
      )}
      <FormFieldsForUser
        className={isDisabled ? 'opacity-50' : null}
        isDisabled={isDisabled}
        isAuthyEnabled={user.isAuthyEnabled}
        // While editing tenant type will be in values as its part of the form but while creating tenantType is passed as a prop and its not included in the form
        tenantType={user?.id ? values.tenantType : tenantType}
        userId={user?.id}
        type={type}
        isCreate={isCreate}
        isAgencyShown={isAgencyShown}
        isSearchable={isSearchable}
        // formik props
        setFieldValue={setFieldValue}
        values={values}
        errors={errors}
        touched={touched}
      />
      <FormButtons
        btnSubmit={{
          className: onChangePassword
            ? 'd-flex justify-content-between w-100'
            : '',
        }}
        onCancel={onCancel}
        isDisabled={isDisabled}
        isSubmitting={isSubmitting}
        isValid={isValid && dirty}>
        {onChangePassword && (
          <Button
            color="link"
            className="px-0"
            data-testid="reset-password-btn"
            onClick={onChangePassword}>
            Change Password
          </Button>
        )}
      </FormButtons>
    </Form>
  ) : (
    <UserInfo data={user} />
  );
};

FormComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
  helpText: PropTypes.string,
  isDisabled: PropTypes.bool,
  isEditing: PropTypes.bool,
  isLoading: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  dirty: PropTypes.bool,
  onCancel: PropTypes.func,
  onChangePassword: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  setSubmitting: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  isLoadingLease: PropTypes.bool,
  isSearchable: PropTypes.bool,
  tenantType: PropTypes.string,
  isCreate: PropTypes.bool,
  type: PropTypes.string,
  setFieldValue: PropTypes.func,
  values: PropTypes.object,
  errors: PropTypes.object,
  touched: PropTypes.object,
  isAgencyShown: PropTypes.bool,
};

FormComponent.defaultProps = {
  isDisabled: false,
  isEditing: true,
  isLoading: false,
  isLoadingLease: false,
  isSubmitting: false,
  isValid: false,
  isAgencyShown: false,
  isSearchable: false,
};

const config = {
  displayName: 'FormUser',
  enableReinitialize: true,
  mapPropsToValues: ({ user, type, tenantType }) => {
    if (user?.id && type === 'tenant') {
      // In edit mode of usertype - tenant, we need to pass tenantType explicitly to persist form values while swapping between tenant types company and personally
      return { ...defaultPropsForUser({ ...user, tenantType }) };
    } else {
      return { ...defaultPropsForUser(user) };
    }
  },
  validationSchema: () =>
    Yup.object().shape(validationSchemaForUser, [
      ['phoneNumber', 'phoneNumber'],
    ]),
  validate: (values, props) => {
    const errors = {};

    if (props.isCorporateUser && props.isAgencyShown && !values.agencyId) {
      errors.agencyId = 'Primary agency is required';
    }

    return errors;
  },
  handleSubmit: (values, { props }) => {
    props.onSubmit(values);
  },
};

export const FormUser = withFormik(config)(FormComponent);

// TODO: extract this component
const UserInfo = ({ data }) => {
  const { kycApproved, firstName, lastName, email, phoneNumber, status } = data;
  const kycApprovedText = useMemo(
    () =>
      kycApproved !== undefined
        ? kycApproved
          ? 'Approved'
          : 'Not Approved'
        : undefined,
    [kycApproved]
  );

  return (
    <>
      <p className="d-flex flex-column">
        <small className="font-weight-bold">First Name:</small>
        <span>{firstName}</span>
      </p>
      <p className="d-flex flex-column">
        <small className="font-weight-bold">Last Name:</small>
        <span>{lastName}</span>
      </p>
      <p className="d-flex flex-column">
        <small className="font-weight-bold">Email:</small>
        <a href={`mailto:${email}`} className="btn-link">
          {email}
        </a>
      </p>
      {phoneNumber && (
        <p className="d-flex flex-column">
          <small className="font-weight-bold">Mobile:</small>
          <span>{phoneNumber}</span>
        </p>
      )}
      <p className="d-flex flex-column">
        <small className="font-weight-bold">Status:</small>
        <span className="text-capitalize">{status}</span>
      </p>
      {kycApprovedText && (
        <p className="d-flex flex-column">
          <small className="font-weight-bold">KYC Status:</small>
          <span className="text-capitalize">{kycApprovedText}</span>
        </p>
      )}
    </>
  );
};

UserInfo.propTypes = {
  data: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    kycApproved: PropTypes.bool,
    status: PropTypes.string,
  }).isRequired,
};
