import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { useIsOpen } from '@app/hooks';
import { ButtonIcon } from '@app/modules/Button';
import { ContentWithLabel } from '@app/modules/Content';
import { ModalConfirm } from '@app/modules/Modal';
import { centsToDollar } from '@app/utils';

/**
 * Accept quote confirmation component - should be used by managers/owners
 * when they accept quotes.
 */
export const QuoteAcceptModal = (props) => {
  const { className, onSubmit, quote } = props;
  const [isOpen, openActions] = useIsOpen(onSubmit);

  const quoteType = useMemo(() => {
    if (quote.isWorkOrder && !quote.bidCents) {
      return 'work order';
    } else {
      return 'quote';
    }
  }, [quote.bidCents, quote.isWorkOrder]);

  return (
    <div className={className}>
      <ButtonIcon
        color="success"
        data-testid="button-quote-accept"
        direction="column"
        icon={['far', 'check']}
        size="2x"
        onClick={openActions.handleOpen}>
        <small>Accept</small>
      </ButtonIcon>
      <ModalConfirm
        btnCancel={{ text: 'Cancel' }}
        btnSubmit={{ text: 'Accept', color: 'success' }}
        isOpen={isOpen}
        size="lg"
        title={`Accept this ${quoteType}?`}
        onCancel={openActions.handleClose}
        onSubmit={openActions.handleSubmit}>
        <ContentWithLabel label="Tradie name" value={quote.tradie?.name} />
        {quote.bidCents > 0 && (
          <ContentWithLabel
            label="Quoted amount"
            value={centsToDollar(quote.bidCents)}
          />
        )}
        <ContentWithLabel label="Note" value={quote.tradie?.note} />
      </ModalConfirm>
    </div>
  );
};

QuoteAcceptModal.propTypes = {
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
  quote: PropTypes.object,
};

QuoteAcceptModal.defaultProps = {
  quote: {},
};
