import PropTypes from 'prop-types';
import React from 'react';

import { AttachmentsList } from '@app/modules/Attachments';
import { ButtonEdit } from '@app/modules/Button';
import { DividerDouble } from '@app/modules/Divider';
import { Link } from '@app/modules/Link';
import { QuoteStatus } from '@app/modules/Marketplace';
import { centsToDollar, toClassName } from '@app/utils';

export const QuoteDetails = ({
  onEditQuote,
  hasLink,
  isCompactView,
  quote,
}) => {
  return (
    <div className="d-flex flex-column">
      <h5 className="d-flex align-items-baseline">
        {hasLink ? (
          <Link
            className="w-100 text-left"
            to={`/marketplace/tradie/${quote.tradie?.id}`}>
            <h5 className="mb-0">{quote.tradie?.name}</h5>
          </Link>
        ) : (
          <span className="w-100">{quote.tradie?.name}</span>
        )}
        {onEditQuote && (
          <ButtonEdit className="text-nowrap p-0 mr-3" onClick={onEditQuote}>
            Edit
          </ButtonEdit>
        )}
        {quote.bidCents && (
          <span>
            {centsToDollar(quote.invoiceAmountCents || quote.bidCents)}
          </span>
        )}
      </h5>
      <p className="mb-0">
        <QuoteStatus className="text-small" status={quote.status} />
      </p>
      {quote.tradie?.note && <DividerDouble className="mt-3" />}
      <p className="mb-0">{quote.tradie?.note}</p>
      {quote.attachments?.length > 0 && (
        <AttachmentsList
          attachments={quote.attachments}
          className={toClassName(
            ['px-0 mt-4 mx-0'],
            isCompactView ? '' : 'w-75'
          )}
          md={isCompactView ? 6 : 3}
        />
      )}
    </div>
  );
};

QuoteDetails.propTypes = {
  onEditQuote: PropTypes.func,
  hasLink: PropTypes.bool,
  isCompactView: PropTypes.bool,
  quote: PropTypes.object,
};

QuoteDetails.defaultProps = {
  hasLink: false,
  quote: {},
};
