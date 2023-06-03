import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { useIsMobile } from '../../hooks';
import InviteTradie from '../../modules/Marketplace/InviteTradie';
import { NavSub } from '../../modules/Nav';
import { useContactsLinks } from '../../modules/Nav/hooks';
import { getProfile } from '../../redux/profile';
import { MarketplaceTradieProfile } from '../Marketplace/Manager';
import { OwnerFinancials } from '../OwnerFinancials';
import { ContactsCreditor, ContactsCreditorFinancials } from './Creditor';
import { ContactsList } from './List';
import PreferredTradies from './PreferredTradies';
import { ContactsServiceProvider } from './ServiceProvider';
import { ContactsUser } from './User';
import UserCreate from './UserCreate';
import { ContactsUserEdit } from './UserEdit';

const ContactsComponent = (props) => {
  const { history, isMarketplaceEnabled, location } = props;
  const isMobile = useIsMobile();

  const navigation = useContactsLinks();

  const renderContactsList = useCallback(
    (props) => <ContactsList {...props} navigation={navigation} />,
    [navigation]
  );

  useEffect(() => {
    if (typeof isMarketplaceEnabled !== 'boolean') return;

    if (
      location.pathname === '/contacts' ||
      (isMarketplaceEnabled &&
        location.pathname.includes('/contacts/creditors')) ||
      (!isMarketplaceEnabled &&
        location.pathname.includes('/contacts/service-providers'))
    ) {
      history.replace(
        isMarketplaceEnabled
          ? '/contacts/service-providers'
          : '/contacts/creditors'
      );
    }
  }, [history, isMarketplaceEnabled, location.pathname]);

  return (
    <>
      {isMobile && <NavSub items={navigation} />}
      <Switch>
        <Route
          path="/contacts/service-providers"
          component={ContactsServiceProvider}
        />
        <Route
          path="/contacts/preferred-tradies"
          component={PreferredTradies}
          exact
        />
        <Route
          path={'/contacts/preferred-tradies/invite'}
          // eslint-disable-next-line react/jsx-no-bind
          render={(props) => <InviteTradie {...props} isPreferred />}
          exact
        />

        <Route
          path={'/contacts/preferred-tradies/tradie/:tradieId'}
          component={MarketplaceTradieProfile}
          exact
        />

        <Route
          path="/contacts/creditors/:id"
          component={ContactsCreditor}
          exact
        />
        <Route
          path="/contacts/creditors/:id/financials"
          component={ContactsCreditorFinancials}
          exact
        />
        <Route
          path="/contacts/owners/:id/financials"
          component={OwnerFinancials}
          exact
        />
        <Route path="/contacts/:type/create" component={UserCreate} exact />
        <Route
          path="/contacts/:type/:id/edit"
          component={ContactsUserEdit}
          exact
        />
        <Route path="/contacts/:type/:id" component={ContactsUser} exact />
        <Route path="/contacts/:type" render={renderContactsList} exact />
      </Switch>
    </>
  );
};

ContactsComponent.propTypes = {
  history: PropTypes.object.isRequired,
  isMarketplaceEnabled: PropTypes.bool,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

ContactsComponent.defaultProps = {
  isMarketplaceEnabled: false,
};

const mapStateToProps = (state) => ({
  isMarketplaceEnabled: getProfile(state.profile).isMarketplaceEnabled,
});

const mapDispatchToProps = {};

export const Contacts = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactsComponent);
