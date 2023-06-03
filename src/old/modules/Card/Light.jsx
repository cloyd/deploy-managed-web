import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardBody } from 'reactstrap';

import { CardHeaderLight } from '.';

export const CardLight = ({ children, title, isLoading, ...props }) => (
  <Card {...props}>
    {title ? (
      <>
        <CardHeaderLight isLoading={isLoading}>{title}</CardHeaderLight>
        <CardBody>{children}</CardBody>
      </>
    ) : (
      children
    )}
  </Card>
);

CardLight.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};
