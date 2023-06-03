import { useMemo } from 'react';

import { USER_TYPES } from '../../../redux/users';
import { useRolesContext } from '../../Profile';

export const useContactsLinks = (isMarketplaceEnabled) => {
  const { isCorporateUser, isPrincipal, isManager } = useRolesContext();

  const navItems = useMemo(() => {
    const nav = [];

    if (!isCorporateUser && (isManager || isPrincipal)) {
      nav.push({
        title: 'Preferred Tradies',
        to: '/contacts/preferred-tradies?page=1',
        type: USER_TYPES.externalCreditor,
      });
    }

    if (isMarketplaceEnabled) {
      nav.push({
        title: 'Service Providers',
        to: '/contacts/service-providers?page=1',
        type: USER_TYPES.externalCreditor,
      });
    } else {
      nav.push({
        title: 'Creditors',
        titleLong: 'External Creditors',
        to: '/contacts/creditors?page=1',
        type: USER_TYPES.externalCreditor,
      });
    }

    if (isPrincipal || isCorporateUser) {
      nav.push({
        title: 'Managers',
        to: '/contacts/managers?page=1',
        type: USER_TYPES.manager,
      });
    }

    nav.push({
      title: 'Owners',
      to: '/contacts/owners?page=1',
      type: USER_TYPES.owner,
    });

    nav.push({
      title: 'Tenants',
      to: '/contacts/tenants?page=1',
      type: USER_TYPES.tenant,
    });

    return nav;
  }, [isCorporateUser, isManager, isMarketplaceEnabled, isPrincipal]);

  return navItems;
};
