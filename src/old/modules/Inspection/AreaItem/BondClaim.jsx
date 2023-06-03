import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { FormFieldCheckbox } from '../../Form';

export const InspectionAreaItemBondClaim = (props) => {
  const { itemId, isPotentialBondClaim, onChange } = props;

  const handleChange = useCallback(
    (value) => onChange(itemId)({ isPotentialBondClaim: value.target.checked }),
    [itemId, onChange]
  );

  return onChange ? (
    <FormFieldCheckbox
      className="d-flex justify-items-center my-2"
      classNameLabel="mb-0 d-flex align-items-center small"
      data-testid="checkbox-isPotentialBondClaim"
      defaultChecked={isPotentialBondClaim}
      fieldId={itemId}
      name="bond-claim"
      text="Potential bond claim"
      onChange={handleChange}
    />
  ) : isPotentialBondClaim ? (
    <p className="my-2 text-danger text-small">
      <FontAwesomeIcon icon={['far', 'flag']} className="mr-1" /> Potential bond
      claim
    </p>
  ) : null;
};

InspectionAreaItemBondClaim.propTypes = {
  isPotentialBondClaim: PropTypes.bool,
  itemId: PropTypes.number,
  onChange: PropTypes.func,
};
