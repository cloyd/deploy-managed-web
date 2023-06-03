import { useMemo } from 'react';

import { replaceSearchParams } from '../../../utils';

export const useLinkSearchParams = (searchParams) =>
  useMemo(
    () => replaceSearchParams({ params: { page: 1 }, search: searchParams }),
    [searchParams]
  );
