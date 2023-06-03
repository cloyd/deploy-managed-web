import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { Link } from '@app/modules/Link';
import {
  useIsAvailableWorkOrder,
  useJobType,
  useQuoteStatus,
} from '@app/modules/Marketplace';

export const QuoteCtaButton = ({ quote, job, ...props }) => {
  const isAvailableWorkOrder = useIsAvailableWorkOrder(job, quote);

  const {
    isAccepted,
    isAwaitingAcceptance,
    isAwaitingApproval,
    isDeclined,
    isQuoting,
  } = useQuoteStatus(quote);

  const jobType = useJobType(job);

  const [text, color] = useMemo(() => {
    return isAccepted
      ? [`Review accepted ${jobType}`, 'success']
      : isAwaitingAcceptance
      ? ['Review and accept', 'success']
      : isAwaitingApproval
      ? [`Review my ${jobType}`, 'secondary']
      : isAvailableWorkOrder
      ? ["I'm Available", 'secondary']
      : isDeclined
      ? [`View my ${jobType}`, 'danger']
      : [`Submit my ${jobType}`, 'primary'];
  }, [
    isAccepted,
    isAwaitingAcceptance,
    isAwaitingApproval,
    isAvailableWorkOrder,
    isDeclined,
    jobType,
  ]);

  const to = useMemo(() => {
    const path = `/marketplace/${job.id}`;
    return isQuoting ? `${path}/edit` : path;
  }, [isQuoting, job]);

  return (
    <Link color={color} to={to} {...props}>
      {text}
    </Link>
  );
};

QuoteCtaButton.propTypes = {
  job: PropTypes.object,
  quote: PropTypes.object,
};
