import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import {
  MarketplaceJobOverview,
  MarketplaceMyJobs,
  MarketplaceTradieFinancials,
  MarketplaceTradieList,
  MarketplaceTradieProfile,
} from '@app/containers/Marketplace';
import InviteTradie from '@app/modules/Marketplace/InviteTradie';
import { NavSub } from '@app/modules/Nav';
import { useRolesContext } from '@app/modules/Profile';

/**
 * Container for /marketplace - toggles paths between tradies and managers
 */
export const Marketplace = ({ match }) => {
  const { isExternalCreditor, isManager } = useRolesContext();

  return isExternalCreditor ? (
    <>
      <NavSub
        items={[
          { title: 'New Jobs', to: match.url, exact: true },
          { title: 'Assigned to me', to: `${match.url}/my-jobs` },
          { title: 'Sent for approval', to: `${match.url}/sent-for-approval` },
          { title: 'Active Jobs', to: `${match.url}/active-jobs` },
          { title: 'Past Jobs', to: `${match.url}/past-jobs` },
        ]}
      />
      <Switch>
        <Route path={match.url} component={MarketplaceMyJobs} exact />
        <Route
          path={[
            `${match.url}/:type(my-jobs|sent-for-approval|active-jobs|past-jobs)?`,
          ]}
          component={MarketplaceMyJobs}
          exact
        />
        <Route
          path={`${match.url}/:jobId`}
          component={MarketplaceJobOverview}
        />
      </Switch>
    </>
  ) : isManager ? (
    <Switch>
      <Route path={`${match.url}/invite`} component={InviteTradie} exact />
      <Route
        path={`${match.url}/tradie/:tradieId/financials`}
        component={MarketplaceTradieFinancials}
        exact
      />
      <Route
        path={`${match.url}/tradie/:tradieId`}
        component={MarketplaceTradieProfile}
        exact
      />
      <Route path={match.url} component={MarketplaceTradieList} exact />
    </Switch>
  ) : (
    <Redirect to="/" />
  );
};

Marketplace.propTypes = {
  match: PropTypes.object.isRequired,
};
