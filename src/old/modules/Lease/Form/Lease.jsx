import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import range from 'lodash/fp/range';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Col,
  CustomInput,
  Form,
  FormGroup,
  FormText,
  Label,
  Row,
} from 'reactstrap';
import * as Yup from 'yup';

import {
  FREQUENCY_DATES,
  FREQUENCY_DEPOSITS,
  FREQUENCY_PAID,
} from '../../../redux/lease/constants';
import {
  dollarToCents,
  toCents,
  toDollars,
  toFrequencyAmountsCents,
  toYearAmountsCents,
} from '../../../utils';
import {
  FormButtons,
  FormField,
  FormFieldDate,
  FormLabel,
  FormOptionsList,
} from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';
import { LeasePaymentValues } from '../PaymentValues';

const byValue = (value) => (item) => item.value === value;

const LeaseFormComponent = ({
  handleChange,
  handleSubmit,
  isNsw,
  isSubmitting,
  isValid,
  lease,
  onCancel,
  setFieldValue,
  values,
  isCommercial,
  errors,
  handleChangeLeaseEnd,
}) => {
  const isDisabled = useMemo(() => lease.status === 'active', [lease.status]);

  const frequencyDeposits = useMemo(() => {
    if (isNsw) {
      return [{ ...FREQUENCY_DEPOSITS.find(byValue('weekly')), multiplier: 2 }];
    }

    if (values.payFrequency !== 'monthly') {
      return [{ ...FREQUENCY_DEPOSITS.find(byValue(values.payFrequency)) }];
    }

    return FREQUENCY_DEPOSITS;
  }, [isNsw, values.payFrequency]);

  const isMonthlyPayFrequency = useMemo(
    () => values.payFrequency === 'monthly',
    [values.payFrequency]
  );

  const frequencyDeposit = useMemo(() => {
    const depositFrequency =
      values.depositFrequency &&
      frequencyDeposits.find(byValue(values.depositFrequency));

    return depositFrequency || frequencyDeposits.find(byValue('weekly'));
  }, [frequencyDeposits, values.depositFrequency]);

  const depositMultipliers = useMemo(() => {
    const multiplier = isNsw ? 2 : frequencyDeposit.multiplier;
    const frequency = isNsw ? 'weekly' : frequencyDeposit.value;

    const amountsCents = toYearAmountsCents(values.annualRentCents);
    const rentDollars = amountsCents[frequency];

    return range(0, multiplier).map((value) => {
      const label = `${value} = $${toDollars(value * rentDollars)}`;
      return { label, value };
    });
  }, [frequencyDeposit, isNsw, values.annualRentCents]);

  const handleChangeDate = useCallback(
    (key) => (date) => !date && setFieldValue(`${key}Frequency`, undefined),
    [setFieldValue]
  );

  const handleChangeDepositFrequency = useCallback(
    (e) => {
      // Reset the multipier to 0 when changing the deposit frquency
      if (
        values.depositFrequency !== undefined ||
        e.target.value !== values.depositFrequency
      ) {
        setFieldValue('depositMultiplier', 0);
      }

      handleChange(e);
    },
    [handleChange, setFieldValue, values.depositFrequency]
  );

  const handleChangePayFrequency = useCallback(
    (e) => {
      const amountsCents = toYearAmountsCents(values.annualRentCents);
      if (!isNsw) {
        setFieldValue('depositFrequency', e.target.value);
      }

      setFieldValue('rentDollars', toDollars(amountsCents[e.target.value]));
      handleChange(e);
    },
    [handleChange, isNsw, setFieldValue, values.annualRentCents]
  );

  const handleChangeRentDollars = useCallback(
    (e) => {
      const amountsCents = toFrequencyAmountsCents(toCents(e.target.value));
      const value = Math.round(amountsCents[values.payFrequency]);
      setFieldValue('annualRentCents', value);
      handleChange(e);
    },
    [handleChange, setFieldValue, values.payFrequency]
  );

  // Set the depositCents whenever required values change
  useEffect(() => {
    const { annualRentCents, depositFrequency, depositMultiplier } = values;
    const amountsCents = toYearAmountsCents(annualRentCents);
    const depositCents = amountsCents[depositFrequency] * depositMultiplier;

    setFieldValue('depositCents', Math.round(depositCents));
  }, [setFieldValue, values]);

  useEffect(() => {
    setFieldValue('isCommercial', isCommercial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCommercial]);

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormGroup>
        <Row>
          <Col xs={6}>
            <FormLabel for="payFrequency" isRequired>
              Pay Frequency
            </FormLabel>
            <FormField
              name="payFrequency"
              type="select"
              onChange={handleChangePayFrequency}
              disabled={isDisabled}>
              {FREQUENCY_PAID.map(({ label, value }) => (
                <option key={`pay-frequency-${value}`} value={value}>
                  {label}
                </option>
              ))}
            </FormField>
          </Col>
          <Col xs={6} className="pl-0">
            <div className="d-flex justify-content-between">
              <FormLabel for="rentDollars" isRequired>
                {startCase(values.payFrequency)} Rent
              </FormLabel>
              <CustomInput
                className="ml-1"
                checked={values.gstIncluded}
                id="gstIncluded"
                label="GST Included"
                name="gstIncluded"
                type="checkbox"
                value={values.gstIncluded}
                onChange={handleChange}
              />
            </div>
            <FormField
              min="10"
              name="rentDollars"
              onChange={handleChangeRentDollars}
              prepend="$"
              type="number"
              step="any"
              disabled={isDisabled}
            />
          </Col>
        </Row>
      </FormGroup>
      <Label className="ml-1 font-weight-bold">Deposit</Label>
      <fieldset
        disabled={values.rentDollars === 0}
        className={values.rentDollars === 0 ? 'opacity-50' : ''}>
        <FormGroup>
          <Row>
            <Col xs={6}>
              <FormLabel for="depositFrequency" isRequired>
                Frequency
              </FormLabel>
              <FormField
                disabled={isNsw || !isMonthlyPayFrequency || isDisabled}
                name="depositFrequency"
                type="select"
                onChange={handleChangeDepositFrequency}>
                {frequencyDeposits.map(({ label, value }) => (
                  <option key={`deposit-frequency-${value}`} value={value}>
                    {label}
                  </option>
                ))}
              </FormField>
            </Col>
            <Col xs={6} className="pl-0">
              <FormLabel for="depositMultiplier" isRequired>
                Number of {frequencyDeposit.label}
              </FormLabel>
              <FormField
                name="depositMultiplier"
                type="select"
                disabled={isDisabled}>
                {depositMultipliers.map(({ label, value }) => (
                  <option key={`deposit-multiplier-${value}`} value={value}>
                    {label}
                  </option>
                ))}
              </FormField>
            </Col>
            <div className="d-none">
              <FormField
                min="0"
                name="depositCents"
                prepend="$"
                type="number"
                step="any"
                disabled={isDisabled}
              />
            </div>
          </Row>
          {isNsw && (
            <FormText className="ml-1">
              Legally in New South Wales a deposit cannot be over a week&apos;s
              rent
            </FormText>
          )}
        </FormGroup>
      </fieldset>
      <FormGroup>
        <Row>
          <Col xs={6}>
            <FormLabel for="tenantPaysWater">Do Tenants Pay</FormLabel>
            <CustomInput
              checked={values.tenantPaysWater}
              id="tenantPaysWater"
              label="Water"
              name="tenantPaysWater"
              type="checkbox"
              value={values.tenantPaysWater}
              onChange={handleChange}
            />
          </Col>
          {isCommercial && (
            <Col xs={6} className="pl-0">
              <FormLabel for="daysRentInvoiceInAdvance" isRequired>
                Send Invoice in Advance(Days)
              </FormLabel>
              <FormField
                id="daysRentInvoiceInAdvance"
                type="number"
                step="any"
                min="1"
                name="daysRentInvoiceInAdvance"
                max="365"
                error={errors.daysRentInvoiceInAdvance}
                disabled={isDisabled}
              />
            </Col>
          )}
        </Row>
      </FormGroup>
      <FormGroup>
        <Row>
          <Col xs={6}>
            <FormLabel for="bondNumber">Bond Id</FormLabel>
            <FormField name="bondNumber" disabled={isDisabled} />
          </Col>
          <Col xs={6} className="pl-0">
            <FormLabel for="bondDollars" isRequired>
              Bond
            </FormLabel>
            <FormField
              min="0"
              name="bondDollars"
              prepend="$"
              step="any"
              type="number"
              disabled={isDisabled}
            />
          </Col>
        </Row>
      </FormGroup>
      <FormGroup>
        <LeasePaymentValues value={values.annualRentCents} />
      </FormGroup>
      <FormGroup>
        <Row>
          <Col xs={6}>
            <FormLabel for="leaseStartDate" isRequired>
              Lease Start
            </FormLabel>
            <FormFieldDate name="leaseStartDate" disabled={isDisabled} />
          </Col>
          <Col xs={6} className="pl-0">
            <FormLabel for="endDate" isRequired>
              Lease End
            </FormLabel>
            <FormFieldDate
              name="endDate"
              onChange={handleChangeLeaseEnd}
              disabled={isDisabled}
            />
          </Col>
        </Row>
      </FormGroup>
      <FormGroup>
        <Row>
          <Col xs={6}>
            <FormLabel for="startDate" isRequired>
              First payment
            </FormLabel>
            <FormFieldDate name="startDate" disabled={isDisabled} />
          </Col>
          <Col xs={6} className="pl-0">
            <FormLabel for="tenantStartDate">
              Living in property since
            </FormLabel>
            <FormFieldDate name="tenantStartDate" disabled={isDisabled} />
          </Col>
        </Row>
      </FormGroup>
      <FormGroup>
        <Row className="mb-3">
          <Col xs={6}>
            <FormLabel for="inspectionDate">Next Inspection</FormLabel>
            <FormFieldDate
              name="inspectionDate"
              onChange={handleChangeDate('inspectionDate')}
              disabled={isDisabled}
            />
          </Col>
          <Col xs={6} className="pl-0">
            <FormLabel for="inspectionDateFrequency">
              Inspection Frequency
            </FormLabel>
            <FormField
              name="inspectionDateFrequency"
              type="select"
              disabled={isDisabled}>
              <FormOptionsList
                hasBlank={!values.inspectionDate}
                options={FREQUENCY_DATES}
                name="inspectionDateFrequency"
              />
            </FormField>
          </Col>
        </Row>
      </FormGroup>
      <FormGroup>
        <Row className="mb-3">
          <Col xs={6}>
            <FormLabel for="reviewDate">Next Rent Review</FormLabel>
            <FormFieldDate
              name="reviewDate"
              onChange={handleChangeDate('reviewDate')}
              disabled={isDisabled}
            />
          </Col>
          <Col xs={6} className="pl-0">
            <FormLabel for="reviewDateFrequency">Review Frequency</FormLabel>
            <FormField
              name="reviewDateFrequency"
              type="select"
              disabled={isDisabled}>
              <FormOptionsList
                hasBlank={!values.reviewDate}
                options={FREQUENCY_DATES}
                name="reviewDateFrequency"
              />
            </FormField>
          </Col>
        </Row>
      </FormGroup>
      <FormButtons
        isValid={isValid}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </Form>
  );
};

LeaseFormComponent.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  isNsw: PropTypes.bool,
  lease: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  isCommercial: PropTypes.bool,
  errors: PropTypes.object.isRequired,
  handleChangeLeaseEnd: PropTypes.func.isRequired,
};

const config = {
  displayName: 'LeaseForm',

  mapPropsToValues: (props) => {
    const { lease } = props;
    const amountCents = toYearAmountsCents(lease.annualRentCents);

    return {
      annualRentCents: lease.annualRentCents,
      bondDollars: toDollars(lease.bondCents),
      bondNumber: lease.bondNumber || '',
      depositFrequency: lease.depositFrequency,
      depositMultiplier: lease.depositMultiplier,
      depositCents: lease.depositCents,
      endDate: lease.endDate,
      id: lease.id,
      inspectionDate: lease.inspectionDate || '',
      inspectionDateFrequency: lease.inspectionDateFrequency || '',
      leaseStartDate: lease.leaseStartDate,
      payFrequency: lease.payFrequency,
      rentDollars: toDollars(amountCents[lease.payFrequency]),
      reviewDate: lease.reviewDate || '',
      reviewDateFrequency: lease.reviewDateFrequency || '',
      startDate: lease.startDate,
      tenantPaysWater: lease.tenantPaysWater,
      tenantStartDate: lease.tenantStartDate,
      daysRentInvoiceInAdvance: lease.daysRentInvoiceInAdvance || 30,
      gstIncluded: lease.gstIncluded ?? true,
    };
  },

  validationSchema: () => {
    return Yup.object().shape({
      bondDollars: Yup.number()
        .required('Bond is required')
        .minAmount('Bond must be greater than $10'),
      rentDollars: Yup.number()
        .required('Rent is required')
        .positive('Must be a positive number')
        .minAmount('Rent must be greater than $10'),
      startDate: Yup.date().required('First payment date is required'),
      leaseStartDate: Yup.date().required('Lease start date is required'),
      endDate: Yup.date()
        .required('End date is required')
        .min(Yup.ref('leaseStartDate'), 'Must be after the start date'),
      daysRentInvoiceInAdvance: Yup.number().when('isCommercial', {
        is: true,
        then: Yup.number()
          .required('Days is required')
          .min(1, 'Days must be greater than 0')
          .max(365, 'Days must be less than 366'),
      }),
    });
  },

  handleSubmit: (values, { props }) => {
    props.onSubmit({
      ...values,
      bondCents: dollarToCents(values.bondDollars),
    });
  },
};

export const LeaseForm = compose(
  withFormik(config),
  withOnComplete
)(LeaseFormComponent);
