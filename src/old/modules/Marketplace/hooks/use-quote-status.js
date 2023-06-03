import { useMemo } from 'react';

import {
  QUOTE_ACCEPTED_STATUSES,
  QUOTE_PENDING_STATUSES,
  QUOTE_STATUSES,
} from '@app/redux/marketplace';

export const useQuoteStatus = (quote) => {
  const { status } = quote || {};

  return useMemo(() => {
    return {
      isPending: QUOTE_PENDING_STATUSES.includes(status),
      isAccepted: QUOTE_ACCEPTED_STATUSES.includes(status),
      isAwaitingAcceptance: status === QUOTE_STATUSES.awaitingAcceptance,
      isAwaitingApproval: status === QUOTE_STATUSES.awaitingApproval,
      isDeclined: status === QUOTE_STATUSES.declined,
      isQuoting: status === QUOTE_STATUSES.quoting,
    };
  }, [status]);
};
