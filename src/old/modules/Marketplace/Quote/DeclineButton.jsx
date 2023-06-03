import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'reactstrap';

import { declineQuote } from '../../../redux/marketplace';
import { ButtonIcon } from '../../Button';
import { useQuoteStatus } from '../hooks';

export const QuoteDeclineButton = ({ quote, style, ...props }) => {
  const { isPending } = useQuoteStatus(quote);
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(declineQuote(quote.id));
  }, [dispatch, quote]);

  if (!isPending || !quote.isWorkOrder) return null;

  return style === 'action' ? (
    <ButtonIcon
      color="danger"
      direction="column"
      icon={['far', 'times']}
      size="2x"
      onClick={handleClick}>
      <small>Decline</small>
    </ButtonIcon>
  ) : (
    <Button color="danger" onClick={handleClick} {...props}>
      Decline
    </Button>
  );
};

QuoteDeclineButton.propTypes = {
  quote: PropTypes.object,
  style: PropTypes.string,
};
