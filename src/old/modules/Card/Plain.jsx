import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardBody } from 'reactstrap';

import { toClassName } from '../../utils';

export const CardPlain = ({
  children,
  className,
  classNameInner,
  isHideSpacing,
}) => (
  <Card className={toClassName([!isHideSpacing && 'mb-2'], className)}>
    <CardBody className={classNameInner}>{children}</CardBody>
  </Card>
);

CardPlain.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classNameInner: PropTypes.string,
  isHideSpacing: PropTypes.bool,
};

CardPlain.defaultProps = {
  className: '',
  classNameInner: 'p-3',
};
