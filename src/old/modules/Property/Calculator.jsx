import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Col,
  Input,
  PopoverBody,
  PopoverHeader,
  Row,
  UncontrolledPopover,
} from 'reactstrap';

import { DURATIONS } from '../../redux/property';
import { daysBetween, toDollars } from '../../utils';
import { FormField, FormFieldDate, FormLabel, FormOptionsList } from '../Form';

const DURATION_OPTIONS = DURATIONS.map((duration) => ({
  label: duration.charAt(0).toUpperCase() + duration.slice(1),
  value: duration,
}));

const INITIAL_DURATION_VALUES = DURATIONS.reduce((acc, duration) => {
  acc[duration] = '0.00';
  return acc;
}, {});

const CalculatorForm = ({ lease, setFieldValue, values }) => {
  const { amount, duration, from, to } = values;
  const [durationValues, setDurationValues] = useState(INITIAL_DURATION_VALUES);
  const [isOpenedFlexibleDates, setIsOpenedFlexibleDates] = useState(false);
  const [isOpenedCalculator, setIsOpenedCalculator] = useState(false);
  const days = Math.abs(daysBetween(to, from)) + 1;

  const computeDurationValues = useCallback(
    (duration, newAmount) => {
      const value = (newAmount || amount) * 100;
      let dailyRate;
      switch (duration) {
        case 'daily':
          dailyRate = value;
          break;
        case 'weekly':
          dailyRate = value / 7;
          break;
        case 'monthly':
          dailyRate = (value * 12) / 365;
          break;
        case 'yearly':
          dailyRate = value / 365;
          break;
        case 'fortnightly':
          dailyRate = value / 14;
          break;
      }

      setDurationValues({
        daily: dailyRate,
        weekly: dailyRate * 7,
        fortnightly: dailyRate * 14,
        monthly: (dailyRate * 365) / 12,
        yearly: dailyRate * 365,
      });
    },
    [amount]
  );

  // set lease rent and duration as default values
  useEffect(() => {
    if (lease.amountCents) {
      const amount = lease.amountCents[lease.payFrequency];
      const duration = lease.payFrequency;

      computeDurationValues(duration, amount / 100);
      setFieldValue('amount', toDollars(amount));
      setFieldValue('duration', duration);
    }
    // Don't include computeDurationValues (which updates when amount changes)
    // to prevent amount to always be set to lease rent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lease.amountCents, lease.payFrequency]);

  const handleChangeValue = useCallback(
    (e) => {
      const value = e.target.value;
      const field = e.target.name;

      if (field === 'amount') {
        computeDurationValues(duration, value);
      } else if (field === 'duration') {
        computeDurationValues(value);
      }

      setFieldValue(field, value);
    },
    [computeDurationValues, duration, setFieldValue]
  );

  const handleToggleFlexibleDates = useCallback(
    () => setIsOpenedFlexibleDates(!isOpenedFlexibleDates),
    [isOpenedFlexibleDates]
  );

  const handleToggleCalculator = useCallback(
    () => setIsOpenedCalculator(!isOpenedCalculator),
    [isOpenedCalculator]
  );

  return (
    <div className="navbar-nav">
      <FontAwesomeIcon
        id="calculator-link"
        icon={['far', 'calculator']}
        className={`nav-link ${isOpenedCalculator ? 'active' : 'inactive'}`}
        onClick={handleToggleCalculator}
        size={'1x'}
      />
      <UncontrolledPopover
        placement="top"
        target="calculator-link"
        trigger="click"
        className="calculator">
        <PopoverHeader>Rent Calculator</PopoverHeader>
        <PopoverBody>
          <div className="px-3 py-2 mb-1">
            <Row className="mb-1">
              <Col>
                <FormLabel for="amount">Amount</FormLabel>
                <FormField
                  min="0"
                  name={'amount'}
                  prepend="$"
                  step="any"
                  onChange={handleChangeValue}
                  bsSize="sm"
                />
              </Col>
              <Col className="d-flex align-items-end">
                <FormField
                  name="duration"
                  type="select"
                  onChange={handleChangeValue}
                  bsSize="sm">
                  <FormOptionsList
                    options={DURATION_OPTIONS.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                    name="durations"
                  />
                </FormField>
              </Col>
            </Row>
            {DURATION_OPTIONS.map(({ label, value }, index) => (
              <Row className="pt-1" key={value + index}>
                <Col className="text-right">{label}</Col>
                <Col>{toDollars(durationValues[value])}</Col>
              </Row>
            ))}
          </div>
          <div
            className={`collapsible ${
              isOpenedFlexibleDates ? 'open' : 'closed'
            }`}>
            <h6
              className={'header px-3 py-2 m-0 border-top border-bottom'}
              onClick={handleToggleFlexibleDates}>
              Flexible Dates
              <FontAwesomeIcon
                icon={[
                  'far',
                  isOpenedFlexibleDates ? 'chevron-down' : 'chevron-up',
                ]}
                className="ml-2"
              />
            </h6>
            <div className={'body px-3 py-1'}>
              <Row className={'mb-1'}>
                <Col>
                  <FormLabel for="from" size="sm">
                    From
                  </FormLabel>
                  <FormFieldDate
                    name="from"
                    size="sm"
                    customInput={<Input bsSize="sm" />}
                    showPrepend={false}
                  />
                </Col>
                <Col>
                  <FormLabel for="to" size="sm">
                    to <small>(inclusive)</small>
                  </FormLabel>
                  <FormFieldDate
                    name="to"
                    size="sm"
                    customInput={<Input bsSize="sm" />}
                    showPrepend={false}
                  />
                </Col>
              </Row>
              <div className="text-right">
                <div>
                  {days}
                  {` day${days > 1 ? 's' : ''}`}
                </div>
                <h6 className="m-0">
                  Total: ${toDollars(days * durationValues.daily)}
                </h6>
              </div>
            </div>
          </div>
        </PopoverBody>
      </UncontrolledPopover>
    </div>
  );
};

CalculatorForm.propTypes = {
  lease: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
};

const formikEnhancer = withFormik({
  displayName: 'FormCalculator',
  mapPropsToValues: () => {
    return {
      amount: '0.00',
      duration: 'weekly',
      from: new Date(),
      to: new Date(),
    };
  },
});

export const Calculator = formikEnhancer(CalculatorForm);
