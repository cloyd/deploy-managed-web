import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

import { LoanCard, LoanInfoModal } from '.';
import { Link } from '../../modules/Link';

export const LoanList = ({ loans, providers }) => {
  return loans.length ? (
    <>
      <h2 className="text-primary mb-4">Loans</h2>
      <div className="mb-3">
        <Row className="card-body text-muted">
          <Col xs={12} lg={1} className="text-left text-nowrap">
            Loan #
          </Col>
          <Col xs={4} lg={5} className="text-left">
            Loan Amount
          </Col>
          <Col xs={4} lg={3} className="text-left">
            Available Balance
          </Col>
          <Col xs={4} lg={3} className="text-left">
            Amount Owing
          </Col>
        </Row>
        {loans.map((loan) => (
          <div key={`loan-${loan.id}`}>
            {loan.isApproved ? (
              <Link to={`loans/${loan.id}`} className="w-100 text-dark">
                <LoanCard loan={loan} />
              </Link>
            ) : (
              <LoanInfoModal loan={loan} providers={providers} />
            )}
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-between">
        <Link
          to="loans/providers"
          color="white"
          className="btn btn-primary btn-lg">
          Apply for a loan
        </Link>
      </div>
    </>
  ) : (
    <Redirect to="loans/providers" />
  );
};

LoanList.propTypes = {
  loans: PropTypes.array.isRequired,
  providers: PropTypes.array.isRequired,
};
