import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap';

import { ButtonEdit } from '../Button';
import { CardLight } from '../Card';
import { ContentDefinition } from '../Content';

export const PropertyDetailsCard = ({
  inclusions,
  onClick,
  type,
  category,
  ...props
}) => {
  return (
    <CardLight {...props}>
      <CardHeader className="d-flex justify-content-between bg-white border-400">
        <CardTitle className="mb-0" tag="h5">
          Property details
        </CardTitle>
        {onClick && <ButtonEdit onClick={onClick}>Edit</ButtonEdit>}
      </CardHeader>
      <CardBody>
        <ContentDefinition
          className="d-block mt-3"
          label="Property type"
          value={type}
        />
        {type !== 'commercial' && (
          <>
            <small className="font-weight-bold">Features</small>
            <Row>
              {inclusions.map((inclusion) => (
                <Col xs={6} sm={3} key={inclusion.name}>
                  <FontAwesomeIcon
                    icon={['far', 'check']}
                    className="text-primary"
                  />
                  <span className="ml-1">{inclusion.label}</span>
                </Col>
              ))}
            </Row>
          </>
        )}
        <ContentDefinition
          className="d-block mt-3"
          label="Property category"
          value={category}
        />
      </CardBody>
    </CardLight>
  );
};

PropertyDetailsCard.propTypes = {
  inclusions: PropTypes.array,
  onClick: PropTypes.func,
  type: PropTypes.string,
  category: PropTypes.string,
};
