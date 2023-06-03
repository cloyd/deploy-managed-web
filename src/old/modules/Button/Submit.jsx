import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

export const ButtonSubmit = ({ children, isSubmitting, ...props }) => (
  <Button color="primary" type="submit" {...props}>
    {isSubmitting && (
      <FontAwesomeIcon
        className="text-white mr-1"
        icon={['far', 'spinner']}
        spin
      />
    )}
    {children}
  </Button>
);

ButtonSubmit.propTypes = {
  children: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool,
};
