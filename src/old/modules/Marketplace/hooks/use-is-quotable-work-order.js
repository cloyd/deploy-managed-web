import { useMemo } from 'react';

import { QUOTE_STATUSES } from '../../../redux/marketplace';

export const useIsQuotableWorkOrder = (quote) =>
  useMemo(
    () =>
      quote &&
      quote.isWorkOrder &&
      quote.status === QUOTE_STATUSES.awaitingAcceptance,
    [quote]
  );
