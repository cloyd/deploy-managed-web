import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import * as Yup from 'yup';

import { dollarToCents, removeSeparators } from '../../utils';
import { CardLight } from '../Card';
import { PaymentDda } from '../Payment';

const FormBankAccountComponent = (props) => {
  const {
    setFieldValue,
    values,
    createToken,
    hostedFields,
    onSubmit,
    isSetup,
    onClose,
    disabled,
  } = props;

  const [fieldErrors, setFieldErrors] = useState({});
  const [responseErrors, setResponseErrors] = useState({});
  const [isBankNameValid, setIsBankNameValid] = useState();
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);

  const handleChangeAgreement = useCallback(
    (e) => {
      setIsAgreementChecked(e.target.checked);
    },
    [setIsAgreementChecked]
  );

  const requiredFieldsValidation = (fieldType) => {
    switch (fieldType) {
      case 'bankAccountName':
        return 'Account name is required';
      case 'bankRoutingNumber':
        return 'BSB is required';
      case 'bankAccountNumber':
        return 'Account number is required';
      default:
        return 'Enter valid data';
    }
  };

  const getResponseErrorMessage = (fieldType) => {
    switch (fieldType) {
      case 'routing_number':
        return 'Please enter a valid bank routing number';
      case 'account_number':
        return 'Please enter valid Account Number';
      case 'account_name':
        return 'Please enter valid Account Name';
      default:
        return 'Please enter valid data';
    }
  };

  const handleResetResponseErrors = useCallback(() => {
    setResponseErrors({});
  }, [setResponseErrors]);

  useEffect(() => {
    const accountName = hostedFields.create('bankAccountName', {
      placeholder: 'Account Holder Full Name',
    });
    const routingNumber = hostedFields.create('bankRoutingNumber', {});
    const accountNumber = hostedFields.create('bankAccountNumber', {});
    accountName.mount('#account-name-field');
    routingNumber.mount('#routing-number-field');
    accountNumber.mount('#account-number-field');

    [accountName, routingNumber, accountNumber].forEach((field) => {
      field.on('change', (event) => {
        // before setting field errors remove the response errors.
        handleResetResponseErrors();
        setFieldErrors((prevState) => ({
          ...prevState,
          [event.fieldType]:
            !event.valid || event.error
              ? event?.error?.message ||
                requiredFieldsValidation(event.fieldType)
              : undefined,
        }));
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const tokenData = await createToken();

      hostedFields
        .createBankAccount({
          token: tokenData.token,
          user_id: tokenData.promisepayUserId,
          bank_name: document.getElementById('bank-name-field').value,
          account_type: document.getElementById('account-type-field').value,
          holder_type: document.getElementById('holder-type-field').value,
          country: 'AUS',
        })
        .then(function (response) {
          // handle create card account succeeded
          let promisepayId = response?.bank_accounts?.id;
          if (promisepayId) {
            onSubmit({ promisepayId });
          }
        })
        .catch(function (response) {
          // handle errors
          for (let key in response.errors) {
            setResponseErrors((prevState) => ({
              ...prevState,
              [key]: getResponseErrorMessage(key),
            }));
          }
        });
    },
    [createToken, hostedFields, onSubmit]
  );

  const handleOnChangeBankName = useCallback(
    (e) => {
      if (e.target.value.trim() === '') {
        setIsBankNameValid(false);
      } else {
        setIsBankNameValid(true);
      }
    },
    [setIsBankNameValid]
  );

  useEffect(() => {
    const routingNumber = values.routingNumber
      .replace(/[^0-9.]+/g, '')
      .replace(/^(.{3})(.)/, '$1-$2')
      .substring(0, 7);

    setFieldValue('routingNumber', routingNumber);
  }, [setFieldValue, values.routingNumber]);

  return (
    <CardLight title="Add a bank account">
      <form id="bank-account-form" data-testid="bank-account-form">
        <div className="mb-2 form-group">
          <label htmlFor="bank-name-field" className="ml-1">
            Bank Name
            <span className="text-danger ml-1">*</span>
          </label>
          <div className="input-group">
            <input
              id="bank-name-field"
              data-testid="bank-name-field"
              onChange={handleOnChangeBankName}
              type="text"
              className={`form-control ${
                isBankNameValid === false && 'is-invalid'
              }`}
            />
            {isBankNameValid === false && (
              <div className="invalid-feedback">Bank name is required</div>
            )}
          </div>
        </div>
        <div className="mb-2 form-group">
          <label htmlFor="account-name-field" className="ml-1">
            Account Name
            <span className="text-danger ml-1">*</span>
          </label>
          <div
            id="account-name-field"
            data-testid="account-name-field"
            className={`form-control ${
              (fieldErrors.bankAccountName || responseErrors.account_name) &&
              'is-invalid'
            }`}
          />
          {(fieldErrors.bankAccountName || responseErrors.account_name) && (
            <div className="invalid-feedback">
              {fieldErrors.bankAccountName || responseErrors.account_name}
            </div>
          )}
        </div>
        <div className="mb-2 form-group">
          <div className="row">
            <div className="mb-2 mb-sm-0 pr-sm-1 col-12 col-sm-4">
              <label htmlFor="routing-number-field" className="ml-1">
                BSB
                <span className="text-danger ml-1">*</span>
              </label>
              <div
                id="routing-number-field"
                data-testid="routing-number-field"
                className={`form-control ${
                  (fieldErrors.bankRoutingNumber ||
                    responseErrors.routing_number) &&
                  'is-invalid'
                }`}
              />
              {(fieldErrors.bankRoutingNumber ||
                responseErrors.routing_number) && (
                // || responseFieldErrors.routing_number
                <div className="invalid-feedback">
                  {fieldErrors.bankRoutingNumber ||
                    responseErrors.routing_number}
                </div>
              )}
            </div>
            <div className="pl-sm-1 col-12 col-sm-8">
              <label htmlFor="account-number-field" className="ml-1">
                Account Number
                <span className="text-danger ml-1">*</span>
              </label>
              <div
                id="account-number-field"
                data-testid="account-number-field"
                className={`form-control ${
                  (fieldErrors.bankAccountNumber ||
                    responseErrors.account_number) &&
                  'is-invalid'
                }`}
              />
              {(fieldErrors.bankAccountNumber ||
                responseErrors.account_number) && (
                <div className="invalid-feedback">
                  {fieldErrors.bankAccountNumber ||
                    responseErrors.account_number}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mb-3 form-group">
          <div className="row">
            <div className="col">
              <label htmlFor="account-type-field" className="ml-1">
                Account Type
                <span className="text-danger ml-1">*</span>
              </label>
              <div className="input-group">
                <select
                  id="account-type-field"
                  name="account-type"
                  defaultValue="savings"
                  className="is-valid form-control">
                  <option value="savings">Savings</option>
                  <option value="checking">Cheque</option>
                </select>
              </div>
            </div>
            <div className="col">
              <label htmlFor="holder-type-field" className="ml-1">
                Holder Type
                <span className="text-danger ml-1">*</span>
              </label>
              <div className="input-group">
                <select
                  id="holder-type-field"
                  name="holder-type"
                  defaultValue="personal"
                  className="is-valid form-control">
                  <option value="personal">Personal</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {!isSetup && (
          <div className="form-group mb-3">
            <PaymentDda
              isChecked={isAgreementChecked}
              onChange={handleChangeAgreement}
              title=""
            />
          </div>
        )}
        <div className="d-flex justify-content-end">
          {onClose && (
            <Button
              type="button"
              color="secondary"
              className="mr-3"
              disabled={disabled}
              onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            data-testid="form-submit-button"
            onClick={handleFormSubmit}
            disabled={
              disabled ||
              (!isSetup &&
                (Object.values(fieldErrors).filter((el) => el === undefined)
                  .length < 3 ||
                  !isBankNameValid ||
                  !isAgreementChecked))
            }
            color="primary">
            {'Add Account'}
          </Button>
        </div>
      </form>
    </CardLight>
  );
};

FormBankAccountComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  hasAgreed: PropTypes.bool,
  isSetup: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setSubmitting: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  hostedFields: PropTypes.object.isRequired,
  createCardAccount: PropTypes.func.isRequired,
  createToken: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

FormBankAccountComponent.defaultProps = {
  hasAgreed: false,
  isSetup: false,
  isSubmitting: false,
  isValid: false,
  disabled: false,
};

const config = {
  displayName: 'FormBankAccount',

  mapPropsToValues: (props) => ({
    accountName: '',
    accountNumber: '',
    accountType: 'savings',
    agreement: props.hasAgreed || props.isSetup,
    amountCents: '1000',
    bankName: '',
    country: 'AUS',
    holderType: 'personal',
    routingNumber: '',
  }),

  validationSchema: () => {
    const schema = {
      bankName: Yup.string().required('Bank name is required'),

      accountName: Yup.string()
        .required('Account name is required')
        .min(5, 'Account name must be between 5 and 32 characters')
        .max(32, 'Account name must be between 5 and 32 characters'),

      accountNumber: Yup.number()
        .required('Account number is required')
        .typeError('Account number must be valid'),

      agreement: Yup.boolean().oneOf(
        [true],
        'You must accept the terms & conditions'
      ),

      routingNumber: Yup.string()
        .required('BSB is required')
        .min(
          7,
          'BSB must contain 6 numbers with a dash in the middle (eg.: 000-000)'
        ),
    };

    return Yup.object().shape(schema);
  },

  handleSubmit: (values, { props, setSubmitting }) => {
    props.onSubmit({
      ...values,
      amountCents: dollarToCents(values.amountCents),
      routingNumber: removeSeparators(values.routingNumber, '-'),
    });
    setSubmitting(false);
  },
};

export const FormBankAccount = compose(withFormik(config))(
  FormBankAccountComponent
);
