import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

import { useIsMobile } from '../../hooks';
import { NavSub } from '../../modules/Nav';
import { usePaymentsNav } from '../../modules/Payment/hooks';
import { useRolesContext } from '../../modules/Profile';
import { PaymentsIntention } from './Intention';
import { PaymentsList } from './List';
import { PaymentsSettings } from './Settings';
import { TenantPaymentSettings } from './TenantPaymentSettings';
import { TenantWallet } from './TenantWallet';

export const Payments = (props) => {
  const { location } = props;
  const { paymentsSubNavItems, showGlobalPaymentSettings } = usePaymentsNav();
  const { isTenant } = useRolesContext();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Redirect in case any emails point to global settings
    if (
      !showGlobalPaymentSettings &&
      location.pathname === '/payments/settings'
    ) {
      props.history.replace('/payments');
    }
  }, [location.pathname, props.history, showGlobalPaymentSettings]);

  return (
    <>
      {isMobile && <NavSub items={paymentsSubNavItems} />}
      <Switch>
        <Route path="/payments" component={PaymentsList} exact />
        {isTenant && <Route path="/payments/wallet" component={TenantWallet} />}
        <Route
          path="/payments/settings"
          component={isTenant ? TenantPaymentSettings : PaymentsSettings}
        />
        <Route path="/payments/:intentionId" component={PaymentsIntention} />
      </Switch>
    </>
  );
};

Payments.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};
