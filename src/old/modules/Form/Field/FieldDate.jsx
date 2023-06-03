import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, connect, getIn } from 'formik';
import get from 'lodash/fp/get';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { FormFeedback, InputGroup, InputGroupAddon } from 'reactstrap';

// TODO: use useFormikContext hook
export const FormFieldDate = connect(
  ({ formik, name, onChange, datePickerProps, useCustomValues, ...props }) => {
    const hasError = useMemo(() => {
      return (
        formik?.errors &&
        formik?.touched &&
        name &&
        get(name, formik?.errors) &&
        get(name, formik?.touched)
      );
    }, [formik, name]);

    const value = useMemo(
      () =>
        Date.parse(
          formik?.values && !useCustomValues
            ? getIn(formik.values, name)
            : props.value
        ),
      [formik, name, props.value, useCustomValues]
    );

    const handleChange = useCallback(
      (value) => {
        !!formik?.setFieldTouched && formik.setFieldTouched(name, true);

        !!formik?.setFieldValue &&
          !useCustomValues &&
          formik.setFieldValue(name, value ? value.toString() : '');

        !!onChange && onChange(value);
      },
      [formik, name, onChange, useCustomValues]
    );

    return (
      <InputGroup data-testid="field-date-picker" size={props.size}>
        <div className="d-flex mr-lg-2">
          {props.showPrepend && (
            <InputGroupAddon addonType="prepend">
              <span className="input-group-text">
                <FontAwesomeIcon icon={['far', 'calendar-alt']} />
              </span>
            </InputGroupAddon>
          )}
          <DatePicker
            autoComplete="off"
            className={`form-control ${hasError ? 'is-invalid' : ''}`}
            dateFormat={['dd-MM-yyyy', 'dd/MM/yyyy', 'dd-MM-yy', 'dd/MM/yy']}
            disabled={props.disabled}
            disabledKeyboardNavigation
            name={name}
            onChange={handleChange}
            placeholderText="dd-mm-yyyy"
            popperPlacement={props.popperPlacement}
            selected={value}
            customInput={props.customInput}
            {...datePickerProps}
          />
        </div>
        {props.isDateTime && (
          <div className="d-flex">
            <InputGroupAddon addonType="prepend">
              <span className="input-group-text">
                <FontAwesomeIcon icon={['far', 'clock']} />
              </span>
            </InputGroupAddon>
            <DatePicker
              className={`form-control ${hasError && 'is-invalid'}`}
              dateFormat="h:mm aa"
              disabled={props.disabled}
              disabledKeyboardNavigation
              name={name}
              selected={value}
              onChange={handleChange}
              popperPlacement={props.popperPlacement}
              showTimeSelect
              showTimeSelectOnly
              timeCaption="Time"
              timeFormat="HH:mm"
              timeIntervals={15}
              autoComplete="off"
            />
          </div>
        )}
        <ErrorMessage
          className={hasError && 'd-block'}
          name={name}
          component={FormFeedback}
        />
      </InputGroup>
    );
  }
);

FormFieldDate.propTypes = {
  customInput: PropTypes.node,
  disabled: PropTypes.bool,
  showPrepend: PropTypes.bool,
  isDateTime: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  popperPlacement: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  datePickerProps: PropTypes.object,
};

FormFieldDate.defaultProps = {
  disabled: false,
  isDateTime: false,
  showPrepend: true,
  value: new Date(),
  datePickerProps: {},
};
