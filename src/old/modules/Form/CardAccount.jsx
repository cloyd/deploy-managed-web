import cardValidator from 'card-validator';
import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button } from 'reactstrap';
import * as Yup from 'yup';

import { addSeparators } from '../../utils';
import { CardLight } from '../Card';

class FormCardAccountComponent extends Component {
  static propTypes = {
    errors: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    hasError: PropTypes.bool,
    isLoading: PropTypes.bool,
    isSubmitting: PropTypes.bool,
    isValid: PropTypes.bool,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    setSubmitting: PropTypes.func.isRequired,
    touched: PropTypes.object.isRequired,
    hostedFields: PropTypes.object.isRequired,
    values: PropTypes.shape({
      cvv: PropTypes.string,
      expiryDate: PropTypes.string,
      fullName: PropTypes.string,
      number: PropTypes.string,
    }).isRequired,
    createCardAccount: PropTypes.func.isRequired,
    createToken: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    hasError: false,
    isLoading: true,
    isSubmitting: false,
    isValid: false,
    disabled: false,
  };

  constructor(props) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  state = {
    isConfirmed: false,
    fieldErrors: {},
    fieldsEmpty: {},
    card: {
      lengths: [19],
    },
  };

  handleValidations(event) {
    this.setState((state) => {
      return {
        ...state,
        fieldErrors: {
          ...state.fieldErrors,
          [event.fieldType]: event.error ? event.error.message : undefined,
        },
      };
    });
    this.setState((state) => {
      return {
        ...state,
        fieldsEmpty: {
          ...state.fieldsEmpty,
          [event.fieldType]: event.empty,
        },
      };
    });
  }

  componentDidMount() {
    const cardName = this.props.hostedFields.create('cardName', {
      placeholder: 'Full Name',
    });
    const cardNumber = this.props.hostedFields.create('cardNumber', {
      placeholder: '•••• •••• •••• ••••',
    });
    const cardExpiry = this.props.hostedFields.create('cardExpiry', {
      placeholder: 'MM/YY',
    });
    const cardCvv = this.props.hostedFields.create('cardCvv', {
      placeholder: '•••',
    });
    cardName.mount('#card-name-field');
    cardNumber.mount('#card-number-field');
    cardExpiry.mount('#card-expiry-field');
    cardCvv.mount('#card-cvv-field');

    const inputs = [cardName, cardNumber, cardExpiry, cardCvv];

    inputs.forEach((field) => {
      field.on('change', (event) => {
        this.handleValidations(event);
      });
    });
  }

  componentWillUnmount() {
    this.props.hostedFields.destroy();
  }

  componentDidUpdate(prevProps) {
    // Update after submitting
    this.onComplete(prevProps);
  }

  async handleFormSubmit(event) {
    event.preventDefault();

    const { createToken, hostedFields, onSubmit } = this.props;
    const tokenData = await createToken();

    hostedFields
      .createCardAccount({
        token: tokenData.token,
        user_id: tokenData.promisepayUserId,
      })
      .then(function (response) {
        // handle create card account succeeded
        onSubmit({ promisepayId: response.card_accounts.id });
      })
      .catch(function (response) {
        // handle errors
      });
  }

  handleBack(event) {
    event.preventDefault();
    this.props.history.goBack();
  }

  onComplete(prevProps) {
    const { hasError, isLoading, isSubmitting, resetForm, setSubmitting } =
      this.props;

    if (isSubmitting && !isLoading && prevProps.isLoading) {
      hasError ? setSubmitting(false) : resetForm();
    }
  }

  setCard(card) {
    const { lengths, gaps } = card;

    this.setState({
      card: {
        ...card,
        lengths: lengths.map((value) => value + gaps.length),
      },
    });
  }

  setNumber(prevValue, gaps) {
    const number = addSeparators({
      prevValue,
      value: this.props.values.number,
      gaps,
      separator: ' ',
    });

    number && this.props.setFieldValue('number', number);
  }

  setExpiryDate(prevValue) {
    const expiryDate = addSeparators({
      prevValue,
      value: this.props.values.expiryDate,
      gaps: [2],
      separator: '/',
    });

    expiryDate && this.props.setFieldValue('expiryDate', expiryDate);
  }

  render() {
    return (
      <CardLight title="Add a credit card">
        <form id="card-account-form">
          <div className="mb-2 form-group">
            <label className="ml-1" htmlFor="card-name-field">
              Name on card
              <span className="text-danger ml-1">*</span>
            </label>
            <div
              id="card-name-field"
              data-testid="card-name-field"
              className={`form-control ${
                this.state.fieldErrors.cardName && 'is-invalid'
              }`}
            />
            {this.state.fieldErrors.cardName && (
              <div className="invalid-feedback">
                {this.state.fieldErrors.cardName}
              </div>
            )}
          </div>
          <div className="mb-2 position-relative form-group">
            <label htmlFor="card-number-field">
              Card Number
              <span className="text-danger ml-1">*</span>
            </label>
            <div
              id="card-number-field"
              data-testid="card-number-field"
              className={`form-control ${
                this.state.fieldErrors.cardNumber && 'is-invalid'
              }`}
            />
            {this.state.fieldErrors.cardNumber && (
              <div className="invalid-feedback">
                {this.state.fieldErrors.cardNumber}
              </div>
            )}
          </div>
          <div className="mb-2 row form-group">
            <div className="pr-2 col">
              <label htmlFor="card-expiry-field">
                Expiry Date
                <span className="text-danger ml-1">*</span>
              </label>
              <div
                id="card-expiry-field"
                data-testid="card-expiry-field"
                className={`form-control ${
                  this.state.fieldErrors.cardExpiry && 'is-invalid'
                }`}
              />
              {this.state.fieldErrors.cardExpiry && (
                <div className="invalid-feedback">
                  {this.state.fieldErrors.cardExpiry}
                </div>
              )}
            </div>
            <div className="pl-2 col">
              <label htmlFor="card-cvv-field">
                CVV
                <span className="text-danger ml-1">*</span>
              </label>
              <div
                id="card-cvv-field"
                data-testid="card-cvv-field"
                className={`form-control ${
                  this.state.fieldErrors.cardCvv && 'is-invalid'
                }`}
              />
              {this.state.fieldErrors.cardCvv && (
                <div className="invalid-feedback">
                  {this.state.fieldErrors.cardCvv}
                </div>
              )}
            </div>
          </div>
          <div
            className={`d-flex ${
              this.props.onCancel
                ? 'justify-content-end'
                : 'justify-content-between'
            }`}>
            <Button
              data-testid="form-cancel-add-card-button"
              onClick={
                this.props.onCancel ? this.props.onCancel : this.handleBack
              }
              disabled={this.props.disabled}
              color="secondary">
              Cancel
            </Button>
            <div className="ml-2">
              <Button
                type="submit"
                data-testid="form-submit-button"
                onClick={this.handleFormSubmit}
                disabled={
                  this.props.disabled ||
                  Object.values(this.state.fieldErrors).filter(
                    (el) => el === undefined
                  ).length < 4 ||
                  Object.keys(this.state.fieldErrors).length === 0 ||
                  Object.values(this.state.fieldsEmpty).filter((el) => el)
                    .length > 0
                }
                color="primary">
                {'Add Account'}
              </Button>
            </div>
          </div>
        </form>
      </CardLight>
    );
  }
}

const formikEnhancer = withFormik({
  displayName: 'CreditCard',

  mapPropsToValues: () => ({
    fullName: '',
    expiryDate: '',
    number: '',
    cvv: '',
  }),

  validationSchema: Yup.object().shape({
    fullName: Yup.string()
      .required('Name on card required')
      .test(
        'credit-card-fullname',
        'Name must be at least 2 words',
        (value) => value && value.match(/\S+/g).length > 1
      ),

    number: Yup.mixed().test(
      'credit-card-type',
      'Must be valid Visa or Mastercard',
      (value = '') => {
        const { card, isValid } = cardValidator.number(value);
        return isValid && /visa|mastercard/.test(card.type);
      }
    ),

    cvv: Yup.mixed().test(
      'cvv',
      'Must be valid CVV',
      (value = '') => cardValidator.cvv(value).isValid
    ),

    expiryDate: Yup.mixed().test(
      'expiryDate',
      'Must be valid date mm/yyyy',
      (value = '') =>
        value.length === 7 && cardValidator.expirationDate(value).isValid
    ),
  }),
});

export const FormCardAccount = formikEnhancer(FormCardAccountComponent);
