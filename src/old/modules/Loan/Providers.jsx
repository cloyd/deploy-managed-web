import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

export const LoanProviders = ({ providers }) => {
  return (
    <>
      <h2 className="text-primary mb-4">Loan Providers</h2>
      {providers.map((provider) => (
        <ul key={`provider-${provider.id}`}>
          <li>
            <Link to={`providers/${provider.id}`}>
              {provider.name} - {provider.products[0].interestRate}%
            </Link>
          </li>
        </ul>
      ))}
    </>
  );
};

LoanProviders.propTypes = {
  providers: PropTypes.array,
};

LoanProviders.defaultProps = {
  providers: [],
};
