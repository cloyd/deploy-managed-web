import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { Container } from 'reactstrap';

import { useLocationParams } from '../../hooks';
import { findItemById } from '../../modules/Filter';
import {
  LoanDetail,
  LoanList,
  LoanProvider,
  LoanProviders,
  useLoanProviders,
  useLoans,
} from '../../modules/Loan';

export const PropertyLoans = ({ lease, property, match }) => {
  const { refresh } = useLocationParams();
  const [loans] = useLoans(property, refresh);
  const [providers] = useLoanProviders();

  const renderLoan = useCallback(
    (routerProps) => {
      const loan = findItemById(loans, routerProps.match.params.loanId);
      const provider = findItemById(providers, loan.loanProviderId);

      if (!loan) {
        return <Redirect to={match.url} />;
      }

      return <LoanDetail loan={loan} property={property} provider={provider} />;
    },
    [loans, match, property, providers]
  );

  const renderLoans = useCallback(() => {
    if (loans.length) {
      return <LoanList loans={loans} providers={providers} />;
    } else {
      return <Redirect to="loans/providers" />;
    }
  }, [loans, providers]);

  const renderProvider = useCallback(
    (routerProps) => {
      const provider = findItemById(
        providers,
        routerProps.match.params.providerId
      );

      return (
        <LoanProvider lease={lease} property={property} provider={provider} />
      );
    },
    [lease, property, providers]
  );

  const renderProviders = useCallback(() => {
    if (providers.length > 1) {
      return <LoanProviders providers={providers} />;
    } else {
      return <Redirect to={`providers/${providers[0].id}`} />;
    }
  }, [providers]);

  if (!loans || !providers) {
    return (
      <Container className="mt-5 text-center">
        <PulseLoader color="#dee2e6" />
      </Container>
    );
  }

  return (
    <Container className="mb-3">
      <Switch>
        <Route
          key={`Property.Loans.Index`}
          path={match.url}
          render={renderLoans}
          exact={true}
        />
        <Route
          key={`Property.Loans.Providers`}
          path={`${match.url}/providers`}
          render={renderProviders}
          exact={true}
        />
        <Route
          key={`Property.Loans.Show`}
          path={`${match.url}/:loanId`}
          render={renderLoan}
          exact={true}
        />
        <Route
          key={`Property.Loans.Provider`}
          path={`${match.url}/providers/:providerId`}
          render={renderProvider}
          exact={true}
        />
      </Switch>
    </Container>
  );
};

PropertyLoans.propTypes = {
  lease: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};
