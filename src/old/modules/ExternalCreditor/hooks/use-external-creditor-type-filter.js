import { useMemo } from 'react';

import { EXTERNAL_CREDITOR_TYPES } from '../../../redux/users/constants';

export const useExternalCreditorTypeFilter = () =>
  useMemo(
    () =>
      Object.keys(EXTERNAL_CREDITOR_TYPES).map((type) => ({
        label: EXTERNAL_CREDITOR_TYPES[type],
        value: type,
      })),
    []
  );
