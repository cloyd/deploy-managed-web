import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

export const ButtonSettings = ({ children, ...props }) => (
  <Button color="link" className="p-0" {...props}>
    <FontAwesomeIcon icon={['far', 'cog']} className="text-primary mr-1" />
    {children}
  </Button>
);

ButtonSettings.propTypes = {
  children: PropTypes.string.isRequired,
};
