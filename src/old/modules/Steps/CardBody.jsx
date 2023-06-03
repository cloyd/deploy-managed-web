import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { CardBody, Col, Row } from 'reactstrap';

export const StepsCardBody = (props) => {
  return (
    <CardBody className="px-3 pt-3 px-lg-5 pt-lg-5 pb-0">
      <Row className={props.className}>
        <Col xs={12} sm={10} className="offset-sm-1">
          {props.icon && (
            <FontAwesomeIcon
              size="4x"
              icon={props.icon}
              className="text-primary mb-3"
            />
          )}
          {props.title && (
            <h3 className="mb-4" role="heading">
              {props.title}
            </h3>
          )}
          {props.children}
        </Col>
      </Row>
    </CardBody>
  );
};

StepsCardBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.array,
};
