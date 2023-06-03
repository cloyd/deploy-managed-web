import { ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import { toPercentFormattedAmount } from '../../../../utils';

export const TotalSharesSummaryRow = (props) => (
  <Row>
    <Col xs={{ size: 7, offset: 5 }}>
      Total: {toPercentFormattedAmount(props.values[props.name])}
      <ErrorMessage name={props.name}>
        {(msg) => (
          <span className="ml-2 text-danger">must be exactly 100%</span>
        )}
      </ErrorMessage>
    </Col>
  </Row>
);

TotalSharesSummaryRow.propTypes = {
  values: PropTypes.object,
  name: PropTypes.string,
};
