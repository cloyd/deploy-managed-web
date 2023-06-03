import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { CustomInput, FormGroup } from 'reactstrap';

import { FormLabel } from '..';

export const FormFieldRadio = (props) => {
  return (
    <FormGroup className={props.className} check>
      <FormLabel for={props.id} className={props.classNameLabel}>
        <CustomInput
          className="d-inline-block mr-1"
          checked={props.isChecked}
          id={props.id}
          name={props.name}
          type="radio"
          value={props.value}
          onChange={props.onChange}
        />
        {props.icon && (
          <FontAwesomeIcon
            icon={['far', props.icon]}
            title={props.title}
            className="mr-1"
          />
        )}
        {props.title}
      </FormLabel>
    </FormGroup>
  );
};

FormFieldRadio.propTypes = {
  isChecked: PropTypes.bool,
  className: PropTypes.string,
  classNameLabel: PropTypes.string,
  icon: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  title: PropTypes.string,
  // eslint-disable-next-line react/boolean-prop-naming
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

FormFieldRadio.defaultProps = {
  className: '',
  classNameLabel: '',
};
