import PropTypes from 'prop-types';
import React from 'react';

import { FormFieldRadio, FormLabel } from '../../Form';

export const InspectionFormFieldIsAgreed = (props) => {
  const { onChange, id, value } = props;

  return (
    <div className="d-block pt-1 pb-3">
      <FormLabel className="mb-2" for="isAgreed" isRequired>
        Do you agree with the condition reported for this item?
      </FormLabel>
      <div className="d-flex">
        <FormFieldRadio
          className="pl-1"
          isChecked={value === true || value === 'true'}
          icon="check"
          id={`${id}-agree`}
          name="isAgreed"
          title="Agree"
          value={true}
          onChange={onChange}
        />
        <FormFieldRadio
          isChecked={value === false || value === 'false'}
          icon="times"
          id={`${id}-disagree`}
          name="isAgreed"
          title="Disgree"
          value={false}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

InspectionFormFieldIsAgreed.propTypes = {
  id: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
