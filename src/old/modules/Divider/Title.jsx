import PropTypes from 'prop-types';
import React from 'react';
import { Col } from 'reactstrap';

import { toClassName } from '../../utils';

export const DividerTitle = ({ className, title }) => {
  const classNames = [
    'd-flex',
    'justify-content-between',
    'align-items-center',
    'p-2',
  ];

  return title ? (
    <div className={toClassName(classNames, className)}>
      <Col className="p-0">
        <hr />
      </Col>
      <Col className="text-center text-nowrap text-uppercase text-gray">
        <small>{title}</small>
      </Col>
      <Col className="p-0">
        <hr />
      </Col>
    </div>
  ) : (
    <div style={{ width: '30px' }}>
      <hr style={{ borderTopWidth: '2px' }} />
    </div>
  );
};

DividerTitle.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
};
