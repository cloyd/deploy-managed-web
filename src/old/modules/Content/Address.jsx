import PropTypes from 'prop-types';
import React from 'react';

export const ContentAddress = ({
  defaultValue,
  postcode,
  state,
  street = '-',
  suburb,
}) => (
  <div>
    {street && suburb && postcode && state ? (
      <span>
        <span className="d-block">{street}</span>
        {suburb} {postcode} {state}
      </span>
    ) : (
      <span>{defaultValue}</span>
    )}
  </div>
);

ContentAddress.propTypes = {
  defaultValue: PropTypes.string,
  postcode: PropTypes.string,
  state: PropTypes.string,
  street: PropTypes.string,
  suburb: PropTypes.string,
};

ContentAddress.defaultProps = {
  defaultValue: '-',
};
