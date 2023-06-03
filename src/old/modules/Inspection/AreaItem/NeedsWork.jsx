import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { FormFieldCheckbox } from '../../Form';

export const InspectionAreaItemNeedsWork = (props) => {
  const { itemId, isWorkNeeded, onChange } = props;

  const handleChange = useCallback(
    (value) => onChange(itemId)({ isWorkNeeded: value.target.checked }),
    [itemId, onChange]
  );

  return onChange ? (
    <FormFieldCheckbox
      className="d-flex justify-items-center my-2"
      classNameLabel="mb-0 d-flex align-items-center small"
      data-testid="checkbox-isWorkNeeded"
      defaultChecked={!!isWorkNeeded}
      fieldId={itemId}
      name={`needs-work`}
      text="Needs work"
      onChange={handleChange}
    />
  ) : isWorkNeeded ? (
    <p className="my-2 text-warning text-small">
      <FontAwesomeIcon icon={['far', 'flag']} className="mr-1" /> Needs work
    </p>
  ) : null;
};

InspectionAreaItemNeedsWork.propTypes = {
  isWorkNeeded: PropTypes.bool,
  itemId: PropTypes.number,
  onChange: PropTypes.func,
};
