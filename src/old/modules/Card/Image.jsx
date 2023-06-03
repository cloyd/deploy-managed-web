import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import { CardPlain } from '.';
import { toClassName } from '../../utils';
import { ImageBackground } from '../Image';

export const CardImage = ({ children, className, src, ...props }) => {
  return (
    <CardPlain
      className={toClassName(['overflow-hidden'], className)}
      classNameInner="p-0">
      <Row>
        <Col xs={4} md={2} className="brand-default pr-0">
          <ImageBackground src={src} />
        </Col>
        <Col xs={8} md={10}>
          <div className="py-3">{children}</div>
        </Col>
      </Row>
    </CardPlain>
  );
};

CardImage.defaultProps = {
  className: '',
  src: '',
};

CardImage.propTypes = {
  src: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
