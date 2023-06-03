import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import addHours from 'date-fns/addHours';
import {
  /* ErrorMessage, */
  connect,
  getIn,
} from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import {
  /* FormFeedback, */
  InputGroupAddon,
} from 'reactstrap';

import { INPUT_FORMATS } from '../../../utils/date';
import { ButtonClose } from '../../Button';

const GenericPicker = (props) => {
  return (
    <DatePicker
      autoComplete="off"
      className="form-control"
      disabledKeyboardNavigation
      {...props}
    />
  );
};

const TimePicker = (props) => {
  return (
    <GenericPicker
      dateFormat="h:mm aa"
      timeCaption="Time"
      timeFormat="HH:mm"
      timeIntervals={15}
      showTimeSelect
      showTimeSelectOnly
      {...props}
    />
  );
};

const toDate = (date) => {
  if (date && typeof date === 'string') {
    return new Date(date);
  }

  return date;
};

const toISOString = (date, hours = 0) => {
  return addHours(date, hours).toISOString();
};

export const FormFieldDateRange = connect(
  ({
    formik,
    name,
    onRemove,
    onChange,
    disabled = false,
    keys = ['startsAt', 'endsAt'],
  }) => {
    const [startKey, endKey] = useMemo(() => {
      return keys;
    }, [keys]);

    const value = useMemo(() => {
      return getIn(formik.values, name);
    }, [formik.values, name]);

    const [startsAt, endsAt] = useMemo(() => {
      return value ? [toDate(value[startKey]), toDate(value[endKey])] : [];
    }, [endKey, startKey, value]);

    const isPersisted = useMemo(() => {
      return onRemove && !!startsAt && !!endsAt;
    }, [endsAt, onRemove, startsAt]);

    const handleChange = useCallback(
      (key) => (date) => {
        const newValue =
          !startsAt && !endsAt
            ? {
                [startKey]: toISOString(date, 8),
                [endKey]: toISOString(date, 9),
              }
            : { ...value, [key]: toISOString(date) };

        if (formik.setFieldValue) {
          formik.setFieldValue(name, newValue);
        } else if (onChange) {
          onChange(name, newValue);
        }
      },
      [endsAt, formik, startKey, endKey, name, startsAt, value, onChange]
    );

    return (
      <div
        data-testid="field-date-range"
        className="d-flex flex-column flex-lg-row">
        <div className="w-auto position-relative d-flex align-items-stretch mr-3 mb-2 mb-lg-0">
          <InputGroupAddon
            addonType="prepend"
            className="input-group-text border-0">
            <FontAwesomeIcon icon={['far', 'calendar-alt']} />
          </InputGroupAddon>
          <GenericPicker
            placeholderText="dd-mm-yyyy"
            selected={startsAt}
            onChange={handleChange(startKey)}
            disabled={disabled}
            dateFormat={INPUT_FORMATS}
          />
        </div>
        <div className="position-relative d-flex align-items-stretch">
          <InputGroupAddon addonType="prepend">
            <span className="input-group-text border-0">
              <FontAwesomeIcon icon={['far', 'clock']} />
            </span>
          </InputGroupAddon>
          <TimePicker
            selected={startsAt}
            onChange={handleChange(startKey)}
            disabled={disabled}
          />
          <span className="mx-2 mt-2">to</span>
          <TimePicker
            selected={endsAt}
            onChange={handleChange(endKey)}
            disabled={disabled}
          />
          {isPersisted && !disabled && (
            <InputGroupAddon addonType="append">
              <span className="input-group-text border-0">
                <ButtonClose
                  onClick={onRemove}
                  hasText={false}
                  size="lg"
                  className="text-danger p-0"
                />
              </span>
            </InputGroupAddon>
          )}
        </div>
      </div>
    );
  }
);

FormFieldDateRange.propTypes = {
  disabled: PropTypes.bool,
  keys: PropTypes.array,
  name: PropTypes.string.isRequired,
  onRemove: PropTypes.func,
  onChange: PropTypes.func,
};
