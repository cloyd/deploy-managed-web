import { ErrorMessage, Field, getIn } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { FormFeedback, Input, InputGroup, InputGroupAddon } from 'reactstrap';

import { disableScroll, toClassName } from '../../../utils';

export const FormField = ({ append, prepend, ...props }) => (
  <InputGroup size={props.bsSize}>
    {prepend && (
      <InputGroupAddon addonType="prepend">{prepend}</InputGroupAddon>
    )}
    <Field name={props.name}>
      {({ field, form }) => {
        const { name, onBlur, onChange, value } = field;
        const isTouched = getIn(form.touched, name);
        const error = getIn(form.errors, name);

        return (
          <Input
            className={toClassName(
              props.type === 'select' ? ['text-capitalize'] : [],
              props.className
            )}
            data-testid={`form-field-${name}`}
            invalid={isTouched && !!error}
            valid={isTouched && !error}
            value={value || ''}
            onBlur={onBlur}
            onChange={onChange}
            onWheel={disableScroll}
            {...props}>
            {props.children}
          </Input>
        );
      }}
    </Field>
    {append && <InputGroupAddon addonType="append">{append}</InputGroupAddon>}
    <ErrorMessage name={props.name} component={FormFeedback} />
  </InputGroup>
);

FormField.propTypes = {
  append: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  name: PropTypes.string.isRequired,
  prepend: PropTypes.string,
  type: PropTypes.string,
  bsSize: PropTypes.string,
};

FormField.defaultProps = {
  className: '',
  type: 'text',
};
