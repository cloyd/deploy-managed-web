import PropTypes from 'prop-types';
import React from 'react';

export const CardAccountDetails = ({ fullName, number }) => (
  <>
    {fullName?.length ? (
      <>
        <span>
          <strong>Name:</strong> {fullName}
        </span>
        <br />
        <span>
          <strong>Number:</strong> {number}
        </span>
      </>
    ) : (
      <span>No account set for paying rent</span>
    )}
  </>
);

CardAccountDetails.propTypes = {
  fullName: PropTypes.string,
  number: PropTypes.string,
};

CardAccountDetails.defaultProps = {
  fullName: '',
  number: '',
};
