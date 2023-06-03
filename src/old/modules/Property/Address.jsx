import PropTypes from 'prop-types';
import React from 'react';

export const PropertyAddress = (props) => {
  const { className, isArchived, postcode, state, street, suburb } = props;

  return (
    <div className={`address ${className}`}>
      <strong>{street}</strong>
      {isArchived && (
        <small className="text-danger mx-2 pb-1">(Archived)</small>
      )}
      <br />
      {suburb}, {state}, {postcode}
    </div>
  );
};

PropertyAddress.propTypes = {
  className: PropTypes.string,
  isArchived: PropTypes.bool,
  postcode: PropTypes.string,
  state: PropTypes.string,
  street: PropTypes.string,
  suburb: PropTypes.string,
};

PropertyAddress.defaultProps = {
  isArchived: false,
};
