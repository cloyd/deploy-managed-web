import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { CustomInput, FormGroup } from 'reactstrap';

import { FormLabel } from '..';

export const FormFieldCheckbox = (props) => {
  const {
    children,
    className,
    classNameLabel,
    classNameInput,
    defaultChecked,
    fieldId,
    icon,
    isChecked,
    name,
    onChange,
    text,
    ...otherProps
  } = props;
  const key = useMemo(() => `${fieldId}-${name}`, [fieldId, name]);

  return (
    <FormGroup className={className}>
      <CustomInput
        className={classNameInput || 'd-inline-block'}
        checked={isChecked}
        defaultChecked={defaultChecked}
        id={key}
        name={name}
        type="checkbox"
        onChange={onChange}
        {...otherProps}
      />
      <FormLabel for={key} className={classNameLabel}>
        {icon && (
          <FontAwesomeIcon icon={['far', icon]} title={text} className="mr-1" />
        )}
        {text || children}
      </FormLabel>
    </FormGroup>
  );
};

FormFieldCheckbox.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classNameLabel: PropTypes.string,
  classNameInput: PropTypes.string,
  // eslint-disable-next-line react/boolean-prop-naming
  defaultChecked: PropTypes.bool,
  fieldId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  icon: PropTypes.string,
  isChecked: PropTypes.bool,
  name: PropTypes.string.isRequired,
  text: PropTypes.string,
  onChange: PropTypes.func,
};

FormFieldCheckbox.defaultProps = {
  className: 'd-flex justify-items-center',
};
