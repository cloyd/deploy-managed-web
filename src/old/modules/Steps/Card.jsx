import PropTypes from 'prop-types';
import React from 'react';
import { Card } from 'reactstrap';

export const StepsCard = (props) => {
  return (
    <Card className="text-center" {...props}>
      {props.children}
    </Card>
  );
};

StepsCard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
