import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { useQuoteStatus } from '@app/modules/Marketplace';
import { useRolesContext } from '@app/modules/Profile';
import { QUOTE_STATUSES } from '@app/redux/marketplace';
import { getProfile } from '@app/redux/profile';

/**
 * Hook that returns job related permissions for current logged in user.
 * Typically you would pass in both a job & a quote, however just a task can be
 * passed in for basic permissions such as canViewJob.
 *
 * @param {Object} job
 * @param {Object} quote
 * @param {Object} task
 */
export const useJobPermissions = ({ job, quote, task }) => {
  const { isManager, isOwner } = useRolesContext();
  const { isAccepted } = useQuoteStatus(quote);
  const { isMarketplaceEnabled } = useSelector((state) => {
    return getProfile(state.profile);
  });

  return useMemo(() => {
    const hasJob = !!(job?.id || task?.tradieJobId);
    const quoteUnaccepted = !job?.acceptedQuoteId;
    const canAcceptQuote = quoteUnaccepted && quote?.bidCents > 0;
    const canAcceptWorkOrder =
      quoteUnaccepted && job?.hasWorkOrder && quote?.id && !quote?.bidCents;

    if (isManager) {
      return {
        canAccept: canAcceptQuote || canAcceptWorkOrder,
        canBillJob: job?.id && job?.acceptedQuoteId,
        canCreateJob:
          isMarketplaceEnabled &&
          task?.isMaintenance &&
          !task?.invoice &&
          !hasJob,
        canCancelJob: !task?.invoice?.intentionTriggered,
        canEditJob: hasJob,
        canInviteForQuote: job?.id && !job?.hasWorkOrder && quoteUnaccepted,
        canInviteForWorkOrder:
          job?.id &&
          job?.hasWorkOrder &&
          quoteUnaccepted &&
          !job?.hasRequestedWorkOrder,
        canRequestReview: canAcceptQuote,
        canRevertAcceptedQuote:
          hasJob && quote?.status === QUOTE_STATUSES.accepted,
        canRecommend:
          isAccepted &&
          !quote?.tradie?.recommendation &&
          quote?.id === job?.acceptedQuoteId,
        canViewJob: hasJob,
      };
    } else if (isOwner) {
      return {
        canAccept: canAcceptQuote,
        canViewJob: hasJob,
      };
    } else {
      return {};
    }
  }, [isAccepted, isManager, isMarketplaceEnabled, isOwner, job, quote, task]);
};
