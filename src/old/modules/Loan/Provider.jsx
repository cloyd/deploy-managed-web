import PropTypes from 'prop-types';
import React from 'react';
import { Alert } from 'reactstrap';

import { LoanApplication, LoanCalculator, LoanCallback } from '.';
import { CardPlain } from '../Card';

export const LoanProvider = ({ lease, property, provider }) => {
  return (
    <>
      <CardPlain className="mb-3 px-md-5 text-center">
        <h2 className="text-primary mb-4 h1">
          Free up your cashflow with {provider.name}?
        </h2>
        <h3>
          Have you thought about accessing short-term funds to help with repairs
          or maintenance to you investment property? {provider.name} may be able
          to help
        </h3>
      </CardPlain>
      {provider.showGraph && (
        <CardPlain className="mb-3">
          <div className="text-center">
            <h3 className="text-primary mb-3">Repayments are simple</h3>
            <p>
              Use your rental income to pay back your loan.
              {provider.description && (
                <span className="d-block">{provider.description}</span>
              )}
            </p>
          </div>
          {provider.products.length && (
            <LoanCalculator
              incomeCents={lease.monthlyRentOwnerPortionCents}
              value={provider.loanMinAmountCents / 100}
              products={provider.products}
            />
          )}
        </CardPlain>
      )}
      <CardPlain className="row mx-0 mb-3 text-center">
        <div className="col-md-10 offset-md-1 mt-3">
          <h2 className="text-primary mb-2">Get Started</h2>
          <p className="mb-4">
            Subject to credit criteria. By clicking on the below, you understand
            that you are now being directed to the {provider.name} website.
          </p>
          {property.canApplyForLoans ? (
            <p>
              <LoanApplication
                lease={lease}
                property={property}
                provider={provider}
              />
              <span className="d-block mt-2">Get a response with 24hrs</span>
            </p>
          ) : (
            <Alert color="warning">
              Please add bank details to apply for a loan with{' '}
              <strong>{provider.name}</strong>.
            </Alert>
          )}
        </div>
        <hr className="my-4" />
        <div className="col-md-10 offset-md-1 mt-3">
          <LoanCallback provider={provider} />
        </div>
      </CardPlain>
    </>
  );
};

LoanProvider.propTypes = {
  lease: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
  provider: PropTypes.object.isRequired,
};
