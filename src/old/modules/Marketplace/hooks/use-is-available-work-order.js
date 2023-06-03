import { useMemo } from 'react';

import { useRolesContext } from '@app/modules/Profile';

export const useIsAvailableWorkOrder = (job, quote) => {
  const { isExternalCreditor } = useRolesContext();

  return useMemo(() => {
    return isExternalCreditor && job?.hasWorkOrder && !quote?.id;
  }, [isExternalCreditor, job, quote]);
};
