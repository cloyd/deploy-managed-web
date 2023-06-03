import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';

import { useIsMobile } from '../../hooks';
import { NavSub } from '../../modules/Nav';
import { usePaymentsNav } from '../../modules/Payment/hooks';
import { useRolesContext } from '../../modules/Profile';
import { BillieForm } from './Form';

export const Billie = ({ history, location }) => {
  const { isManager } = useRolesContext();
  const isMobile = useIsMobile();
  const { paymentsSubNavItems } = usePaymentsNav();

  return isManager ? (
    <>
      {isMobile && <NavSub items={paymentsSubNavItems} />}
      <BillieForm history={history} location={location} />
    </>
  ) : (
    <Redirect to="/" />
  );
};

Billie.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};
