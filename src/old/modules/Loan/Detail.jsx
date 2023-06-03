import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardBody, CardTitle, Table } from 'reactstrap';

import {
  LoanCallback,
  LoanGraph,
  LoanInstalment,
  LoanTransfer,
  useGraphInstalments,
  useLoanInstalments,
} from '.';
import { centsToDollar } from '../../utils';

export const LoanDetail = ({ loan, property, provider }) => {
  const [instalments] = useLoanInstalments(property, loan);
  const graphInstalments = useGraphInstalments(instalments, loan);

  return (
    <>
      <Card className="mb-3">
        <CardBody className="d-flex flex-column align-items-baseline flex-md-row justify-content-md-between">
          <h2 className="text-primary mb-0">
            {loan.provider} {loan.name} {loan.number}
          </h2>
          <div className="d-flex flex-column align-items-end">
            <span className="h5-font-size">
              Available Loan Balance:{' '}
              <strong>{centsToDollar(loan.walletBalanceCents)}</strong>
            </span>
            <LoanTransfer loan={loan} property={property} />
          </div>
        </CardBody>
      </Card>
      <Card className="mb-3">
        <CardBody>
          <CardTitle className="text-center">
            <h5>Your Loan Overview</h5>
          </CardTitle>
          <LoanGraph instalments={graphInstalments} />
        </CardBody>
      </Card>
      {instalments && (
        <Card className="mb-3 border-0">
          <CardTitle className="m-0 px-3">
            <h5 className="my-3">Instalments</h5>
          </CardTitle>
          <Table className="mb-1" responsive>
            <tbody>
              {instalments.map((instalment, index) => (
                <LoanInstalment
                  key={`instalment-${instalment.id}`}
                  title={`Instalment #${index + 1}`}
                  instalment={instalment}
                  property={property}
                />
              ))}
            </tbody>
          </Table>
        </Card>
      )}
      <Card className="mb-3 border-0">
        <CardBody className="mt-2">
          <LoanCallback provider={provider} />
        </CardBody>
      </Card>
    </>
  );
};

LoanDetail.propTypes = {
  loan: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
  provider: PropTypes.object.isRequired,
};
