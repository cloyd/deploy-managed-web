import PropTypes from 'prop-types';
import React from 'react';
import { CardFooter } from 'reactstrap';

export const StepsCardFooter = (props) => {
  return (
    <CardFooter className="p-3 p-lg-4 border-top bg-white">
      {props.children}
    </CardFooter>
  );
};

StepsCardFooter.propTypes = {
  children: PropTypes.node,
};
