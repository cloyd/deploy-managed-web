import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Card, Col, Row } from 'reactstrap';

import { FormButtons, FormFieldCheckbox } from '@app/modules/Form';

const COMMENTS = [
  'On Time',
  'High quality service',
  'Affordable',
  'Works within budget',
  'Fast response',
  'Friendly and polite',
  'Neat and tidy',
  'Highly skilled',
];

export const MarketplaceFormTradieRecommendation = ({ onSubmit, onCancel }) => {
  const [values, setValues] = useState([]);

  const handleChange = useCallback(
    (event) => {
      const { value } = event.currentTarget;

      setValues((state) => {
        const index = state.indexOf(value);

        if (index >= 0) {
          state.splice(index);
          return [...state];
        } else {
          return [...state, value];
        }
      });
    },
    [setValues]
  );

  const handleSubmit = useCallback(() => {
    if (values.length) {
      onSubmit(values.join(', '));
    }
  }, [onSubmit, values]);

  return (
    <>
      <Card className="bg-lavender p-4 mb-3">
        <strong className="mb-3">How would you rate this tradie?</strong>
        <Row>
          {COMMENTS.map((value, index) => (
            <Col sm={6} key={`recommend-${index}`} className="text-primary">
              <FormFieldCheckbox
                fieldId={`recommend-${index}`}
                name={`recommend-${index}`}
                className="m-0"
                text={value}
                value={value}
                onChange={handleChange}
              />
            </Col>
          ))}
        </Row>
      </Card>
      <FormButtons onSubmit={handleSubmit} onCancel={onCancel} />
    </>
  );
};

MarketplaceFormTradieRecommendation.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
};
