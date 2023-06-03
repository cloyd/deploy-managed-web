import values from 'lodash/fp/values';
import { useMemo } from 'react';

import { INSPECTION_TYPE } from '../../../redux/inspection';

// Filter out Ingoing/Outgoing if no leases with tenants are present
export const useInspectionTypes = (leases = []) =>
  useMemo(() => {
    const hasLeaseWithTenant = !!leases.find((lease) => !!lease.primaryTenant);

    return hasLeaseWithTenant
      ? values(INSPECTION_TYPE)
      : [INSPECTION_TYPE.ROUTINE];
  }, [leases]);
