import { useEffect, useState } from 'react';

import { useRolesContext } from '../../Profile';

const NAV_ITEMS = [
  {
    exact: true,
    title: 'Snapshot',
    to: '/reports?source_url=reports',
  },
  {
    exact: true,
    title: 'Gain/Lost',
    to: '/reports/management',
  },
  {
    exact: true,
    title: 'Financials',
    to: '/reports/financials',
  },
  {
    title: 'Efficiency',
    to: '/reports/efficiency',
  },
];

export const useReportsLinks = (isDataReportsModuleEnabled) => {
  const { isCorporateUser, isManager, isPrincipal } = useRolesContext();

  const [navItems, setNavItems] = useState(NAV_ITEMS);

  useEffect(() => {
    isManager &&
      setNavItems(NAV_ITEMS.filter(({ title }) => title !== 'Performance'));
  }, [isManager]);

  useEffect(() => {
    (isPrincipal || isCorporateUser) &&
      isDataReportsModuleEnabled &&
      setNavItems([
        ...navItems,
        {
          exact: true,
          title: 'Data',
          to: '/reports/data',
        },
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCorporateUser, isDataReportsModuleEnabled, isPrincipal]);

  return navItems;
};
