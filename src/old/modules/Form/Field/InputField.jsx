import { useField } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { FormFeedback, Input } from 'reactstrap';

export const InputField = (props) => {
  const [field, meta] = useField(props.name);
  const invalid = meta.touched && meta.error;
  const valid = meta.touched && !meta.error;

  return (
    <>
      <Input {...field} {...props} invalid={!!invalid} valid={valid} />
      {invalid && (
        <FormFeedback invalid={invalid} valid={valid}>
          {meta.error}
        </FormFeedback>
      )}
    </>
  );
};

InputField.propTypes = {
  name: PropTypes.string,
};

export default InputField;
