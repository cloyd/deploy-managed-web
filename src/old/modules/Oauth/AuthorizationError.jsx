import PropTypes from 'prop-types';
import React from 'react';

export const AuthorizationError = (props) => {
  const { message } = props;
  return (
    <div>
      <p>{message}</p>
    </div>
  );
};

AuthorizationError.propTypes = {
  message: PropTypes.string,
};
