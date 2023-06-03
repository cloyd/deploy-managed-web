import PropTypes from 'prop-types';
import React from 'react';

import { FormField } from '..';
import { formatDate } from '../../../utils';

export const FormFieldLeases = (props) => (
  <FormField name={props.name} type="select" disabled={props.disabled}>
    <option value="">-- Select --</option>
    {props.leases.map((lease) => {
      const { endDate, id, primaryTenant, startDate } = lease;

      return (
        <option key={`${props.name}-${id}`} value={id}>
          {primaryTenant
            ? `${formatDate(startDate)} to ${formatDate(endDate)} -
               ${primaryTenant.firstName} ${primaryTenant.lastName}`
            : props.defaultLabelText}
        </option>
      );
    })}
  </FormField>
);

FormFieldLeases.propTypes = {
  defaultLabelText: PropTypes.string,
  disabled: PropTypes.bool,
  leases: PropTypes.array,
  name: PropTypes.string,
};

FormFieldLeases.defaultProps = {
  defaultLabelText: 'Draft lease - (no tenant)',
  leases: [],
  name: 'lease',
};
