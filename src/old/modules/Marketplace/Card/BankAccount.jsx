import PropTypes from 'prop-types';
import React from 'react';
import { CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap';

import { CardLight } from '../../Card';
import { ContentDefinition } from '../../Content';

export const CardBankAccount = (props) => {
  const { account } = props;

  return (
    <CardLight className={props.className}>
      <CardHeader className="d-flex justify-content-between bg-white border-400">
        <CardTitle className="mb-0" tag="h5">
          Bank Details
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <Col xs={12} className="mb-3">
            <ContentDefinition
              label="Account name"
              value={account.accountName}
            />
          </Col>
          <Col xs={12} className="mb-3">
            <ContentDefinition label="Bank name" value={account.bankName} />
          </Col>
        </Row>
      </CardBody>
    </CardLight>
  );
};

CardBankAccount.propTypes = {
  className: PropTypes.string,
  account: PropTypes.object,
};

CardBankAccount.defaultProps = {
  account: {},
};
