import PropTypes from 'prop-types';
import React from 'react';

import { FormField } from '..';

export const FormFieldBoolean = (props) => {
  return (
    <FormField name={props.name} type="select">
      <option key={true} value={true}>
        Yes
      </option>
      <option key={false} value={false}>
        No
      </option>
    </FormField>
  );
};

FormFieldBoolean.propTypes = {
  name: PropTypes.string.isRequired,
};
