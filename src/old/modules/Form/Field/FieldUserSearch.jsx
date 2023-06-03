/* eslint-disable react/jsx-no-bind */
import { Field, getIn } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { FormFeedback, InputGroup } from 'reactstrap';

import { UserSearchSelect } from '@app/modules/User';

export const FormFieldSearchUser = ({ onInputChange, name, ...props }) => (
  <InputGroup>
    <Field name={name}>
      {({ field, form }) => {
        const { name } = field;
        const error = getIn(form.errors, name);

        return (
          <>
            <UserSearchSelect
              className="w-100"
              name={name}
              handleBlur={() =>
                form.setTouched({ ...form.touched, [name]: true })
              }
              canSendInvite={false}
              isMulti={false}
              isModalSearchDisabled
              hasFilters={false}
              searchParams={{
                perPage: 6,
              }}
              onInputChange={(value) => {
                form.setTouched({ ...form.touched, [name]: true });
                onInputChange(value);
              }}
              {...props}
            />
            {form.touched[name] && error && (
              <FormFeedback className="d-block">{error}</FormFeedback>
            )}
          </>
        );
      }}
    </Field>
  </InputGroup>
);

FormFieldSearchUser.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  onChange: PropTypes.func,
  onInputChange: PropTypes.func,
};

FormFieldSearchUser.defaultProps = {
  className: '',
  type: 'owner',
};
