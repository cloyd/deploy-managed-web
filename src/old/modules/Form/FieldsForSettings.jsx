import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { FormGroup, FormText } from 'reactstrap';
import * as Yup from 'yup';

import { FormDropdownInput, FormLabelInput } from '.';
import { FEE_UNITS } from '../../redux/property';
import { toDollars, toPercent } from '../../utils';

export const defaultPropsForSettings = ({ agency, property }) => {
  const {
    floatCents,
    lettingFeeUnit,
    lettingFee,
    leaseRenewalUnit,
    leaseRenewal,
    adminFeeCents,
    advertisingFeeCents,
    workOrderLimitCents,
  } = property;

  const managementFee =
    (property && property.percentageManagementFee) ||
    (agency && agency.percentageManagementFee) ||
    100;

  return {
    floatDollars: toDollars(typeof floatCents === 'number' ? floatCents : 0),
    managementFee: toPercent(managementFee),
    lettingFeeUnit,
    lettingFee: lettingFee || 0,
    leaseRenewalUnit,
    leaseRenewal: leaseRenewal || 0,
    adminFee: toDollars(adminFeeCents),
    advertisingFee: toDollars(advertisingFeeCents),
    workOrderLimit: toDollars(workOrderLimitCents),
  };
};

export const validationSchemaForSettings = {
  managementFee: Yup.number()
    .min(1, 'Minimum percentage is 1.00%')
    .required('Management fee is required'),

  lettingFeeUnit: Yup.mixed().when('lettingFee', (lettingFee, schema) => {
    return lettingFee === 0
      ? schema
      : Yup.mixed()
          .oneOf(['% of annual rent', ' weeks rent'])
          .required('Letting Fee Unit is required');
  }),

  leaseRenewalUnit: Yup.mixed().when('leaseRenewal', (leaseRenewal, schema) => {
    return leaseRenewal === 0
      ? schema
      : Yup.mixed()
          .oneOf(['% of annual rent', ' weeks rent'])
          .required('Lease Renewal Unit is required');
  }),

  lettingFee: Yup.number()
    .min(0, 'Must be a positive number')
    .required('Letting Fee is required'),

  leaseRenewal: Yup.number()
    .min(0, 'Must be be a positive number')
    .required('Lease Renewal is required'),

  adminFee: Yup.number()
    .min(0, 'Must be a positive number')
    .required('Admin fee is required'),

  advertisingFee: Yup.number()
    .min(0, 'Must be a positive number')
    .required('Advertising fee is required'),

  workOrderLimit: Yup.number().min(0, 'Must be a positive number'),

  bannerAlert: Yup.string().max(
    200,
    'Banner alert must be maximum 200 characters'
  ),
};

export const FormFieldsForSettings = (props) => {
  const {
    className,
    errors,
    handleChange,
    handleBlur,
    property,
    setFieldValue,
    touched,
    values,
  } = props;
  const showWalletAmountField =
    property.paysViaRent === false &&
    !['weekly_withdrawal', 'monthly_withdrawal'].includes(
      property?.primaryOwner?.withdrawalFrequency
    );

  const handleDropdownChange = useCallback(
    (name, value) => {
      setFieldValue(name, value);
    },
    [setFieldValue]
  );

  return (
    <div className={className}>
      <FormGroup>
        <FormLabelInput
          data-testid="field-management-fee"
          type="number"
          step="any"
          label="Management Fee (Incl GST)"
          prepend="%"
          name="managementFee"
          isRequired
          value={values.managementFee}
          isTouched={touched.managementFee}
          error={errors.managementFee}
          handleChange={handleChange}
          handleBlur={handleBlur}
          disabled={property.isArchived}
        />
        <FormText className="ml-1">
          Make sure to include GST in this fee e.g. if you are collecting 5%,
          set the fee to 5.5%
        </FormText>
      </FormGroup>
      <FormGroup>
        <FormDropdownInput
          data-testid="field-letting-fee"
          type="number"
          label="Letting Fee"
          name="lettingFee"
          min="0"
          step="any"
          isRequired
          dropdownName="lettingFeeUnit"
          value={values.lettingFee}
          dropdownValue={values.lettingFeeUnit}
          isTouched={touched.lettingFee}
          error={errors.lettingFee || errors.lettingFeeUnit}
          handleChange={handleChange}
          handleDropdownChange={handleDropdownChange}
          handleBlur={handleBlur}
          dropdownOptions={FEE_UNITS}
          disabled={property.isArchived}
        />
        {values.lettingFeeUnit === '% of annual rent' && (
          <FormText className="ml-1">
            Make sure to include GST in this fee e.g. if you are collecting 5%,
            set the fee to 5.5%
          </FormText>
        )}
      </FormGroup>
      <FormGroup>
        <FormDropdownInput
          data-testid="field-lease-renewal"
          type="number"
          label="Lease Renewal"
          name="leaseRenewal"
          min="0"
          step="any"
          isRequired
          dropdownName="leaseRenewalUnit"
          dropdownValue={values.leaseRenewalUnit}
          dropdownOptions={FEE_UNITS}
          value={values.leaseRenewal}
          isTouched={touched.leaseRenewal}
          error={errors.leaseRenewal || errors.leaseRenewalUnit}
          handleDropdownChange={handleDropdownChange}
          handleChange={handleChange}
          handleBlur={handleBlur}
          disabled={property.isArchived}
        />
        {values.leaseRenewalUnit === '% of annual rent' && (
          <FormText className="ml-1">
            Make sure to include GST in this fee e.g. if you are collecting 5%,
            set the fee to 5.5%
          </FormText>
        )}
      </FormGroup>
      <FormGroup>
        <FormLabelInput
          type="number"
          label="Advertising"
          data-testid="field-advertising-fee"
          name="advertisingFee"
          min="0"
          step="any"
          prepend="$"
          isRequired
          value={values.advertisingFee}
          isTouched={touched.advertisingFee}
          error={errors.advertisingFee}
          handleChange={handleChange}
          handleBlur={handleBlur}
          disabled={property.isArchived}
        />
      </FormGroup>
      <FormGroup>
        <FormLabelInput
          data-testid="field-work-order-limit"
          type="number"
          label="Approved Maintenance Spend Without Authorisation"
          name="workOrderLimit"
          min="0"
          step="any"
          prepend="$"
          value={values.workOrderLimit}
          isTouched={touched.workOrderLimit}
          error={errors.workOrderLimit}
          handleChange={handleChange}
          handleBlur={handleBlur}
          disabled={property.isArchived}
        />
      </FormGroup>
      <FormGroup>
        <FormLabelInput
          data-testid="field-admin-fee"
          type="number"
          label="Admin Fee"
          name="adminFee"
          min="0"
          step="any"
          prepend="$"
          isRequired
          value={values.adminFee}
          isTouched={touched.adminFee}
          error={errors.adminFee}
          handleChange={handleChange}
          handleBlur={handleBlur}
          disabled={property.isArchived}
        />
      </FormGroup>
      {showWalletAmountField && (
        <FormGroup>
          <FormLabelInput
            type="number"
            label="Wallet Amount"
            name="floatDollars"
            min="0"
            step="any"
            prepend="$"
            isRequired
            value={values.floatDollars}
            isTouched={touched.floatDollars}
            error={errors.floatDollars}
            handleChange={handleChange}
            handleBlur={handleBlur}
            disabled={property.isArchived}
          />
        </FormGroup>
      )}
    </div>
  );
};

FormFieldsForSettings.defaultProps = {
  errors: {},
  property: {},
  touched: {},
  values: {},
};

FormFieldsForSettings.propTypes = {
  className: PropTypes.string,
  errors: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  touched: PropTypes.object,
  values: PropTypes.object,
  property: PropTypes.object,
};
