import { useMemo } from 'react';

import { useRolesContext } from '../../Profile';

export const usePaymentsNav = () => {
  const {
    isCorporateUser,
    isExternalCreditor,
    isOwner,
    isPrincipal,
    isTenant,
  } = useRolesContext();

  return useMemo(() => {
    // consolidated with conditions for showing default and disbursement on Payments/Setttings
    const showGlobalPaymentSettings =
      (isExternalCreditor || isTenant || isPrincipal) &&
      !isCorporateUser &&
      !isOwner;

    const paymentsSubNavItems = [
      ...(isTenant
        ? [
            {
              title: 'My Wallet',
              to: '/payments/wallet',
            },
          ]
        : []),
      {
        exact: true,
        title: isTenant ? 'Upcoming' : 'Payments Centre',
        to: {
          pathname: '/payments',
          search: '?page=1&is_complete=false',
        },
      },
    ];

    if (showGlobalPaymentSettings) {
      paymentsSubNavItems.push({
        title: 'Settings',
        to: '/payments/settings',
      });
    }

    return { paymentsSubNavItems, showGlobalPaymentSettings };
  }, [isCorporateUser, isExternalCreditor, isOwner, isPrincipal, isTenant]);
};
