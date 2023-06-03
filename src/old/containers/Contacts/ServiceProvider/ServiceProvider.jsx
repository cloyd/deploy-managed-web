import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ServiceProviderEdit } from './Edit';
import { ServiceProviderFinancials } from './Financials';
import { ServiceProviderList } from './List';

export const ContactsServiceProvider = (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        path={`${match.url}/:id/financials`}
        component={ServiceProviderFinancials}
        exact
      />
      <Route path={`${match.url}/:id`} component={ServiceProviderEdit} exact />
      <Route path={match.url} component={ServiceProviderList} exact />
    </Switch>
  );
};

ContactsServiceProvider.propTypes = {
  match: PropTypes.object.isRequired,
};
