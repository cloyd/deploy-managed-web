import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle as RcCardTitle } from 'reactstrap';

export const CardTitle = ({ children, ...props }) => (
  <RcCardTitle {...props}>{children}</RcCardTitle>
);

CardTitle.propTypes = {
  children: PropTypes.node,
};
