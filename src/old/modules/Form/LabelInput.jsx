import PropTypes from 'prop-types';
import React from 'react';
import {
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
} from 'reactstrap';

import { disableScroll } from '../../utils';

export const FormLabelInput = ({
  append,
  children,
  className,
  error,
  handleBlur,
  handleChange,
  isRequired,
  isTouched,
  label,
  prepend,
  type,
  value,
  ...props
}) => (
  <div className={className}>
    <Label for={props.id || props.name} className="ml-1">
      {label}
      {isRequired && <span className="text-danger ml-1">*</span>}
    </Label>
    <InputGroup>
      {prepend && (
        <InputGroupAddon addonType="prepend">{prepend}</InputGroupAddon>
      )}
      <Input
        className={type === 'select' ? 'text-capitalize' : null}
        id={props.name}
        invalid={isTouched && !!error}
        type={type || 'text'}
        valid={isTouched && !error}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onWheel={disableScroll}
        {...props}>
        {children}
      </Input>
      {append && <InputGroupAddon addonType="append">{append}</InputGroupAddon>}
      {error && <FormFeedback>{error}</FormFeedback>}
    </InputGroup>
  </div>
);

FormLabelInput.propTypes = {
  append: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.string,
  children: PropTypes.node,
  error: PropTypes.string,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  id: PropTypes.string,
  isReadOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  isTouched: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  prepend: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
};
