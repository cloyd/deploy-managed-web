import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { IconWorkOrder, QuoteCard } from '@app/modules/Marketplace';
import {
  QUOTE_ACCEPTED_STATUSES,
  QUOTE_STATUSES,
} from '@app/redux/marketplace';
import { formatDate } from '@app/utils';

const STATUSES = [
  ...QUOTE_ACCEPTED_STATUSES,
  QUOTE_STATUSES.awaitingAcceptance,
  QUOTE_STATUSES.awaitingApproval,
];

function contentFor({ status, updatedAt }) {
  if (updatedAt && STATUSES.includes(status)) {
    return `Submitted ${formatDate(updatedAt, 'shortWithTime')}`;
  }
}

export const QuoteList = ({ onClick, quotes, selected, ...props }) => {
  const handleClick = useCallback(
    (quoteId) => {
      if (onClick) {
        return () => onClick(quoteId);
      }
    },
    [onClick]
  );

  return (
    <div data-testid="quote-list" {...props}>
      {quotes.map((quote) => (
        <QuoteCard
          key={`item-${quote.id}`}
          amount={quote.bidCents}
          content={contentFor(quote)}
          status={quote.status}
          title={quote.tradie?.name}
          isActive={quote === selected}
          className="mb-3"
          onClick={handleClick(quote.id)}>
          <IconWorkOrder className="mt-2 mr-3" quote={quote} size="xl" />
        </QuoteCard>
      ))}
    </div>
  );
};

QuoteList.propTypes = {
  selected: PropTypes.object,
  onClick: PropTypes.func,
  quotes: PropTypes.array,
};
