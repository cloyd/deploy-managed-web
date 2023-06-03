import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import { CardLight } from '../Card';

export const PropertyKeysCard = ({ keys, ...props }) => {
  return (
    <CardLight title="Key Tracking" {...props}>
      {keys.length > 0 ? (
        <Row>
          {keys.map((key) => (
            <Col xs={3} key={`propertyKey-${key.id}`}>
              {key.identifier}
              {key.holderLabel && (
                <small className="text-muted"> – {key.holderLabel}</small>
              )}
            </Col>
          ))}
        </Row>
      ) : (
        <p className="mb-0">No keys are currently being tracked.</p>
      )}
    </CardLight>
  );
};

PropertyKeysCard.propTypes = {
  keys: PropTypes.array,
};

PropertyKeysCard.defaultProps = {
  keys: [],
};
