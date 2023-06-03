import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';

import { JobActivities } from '@app/modules/Marketplace';
import {
  createQuoteMessage,
  fetchMessagesByQuoteId,
  fetchQuote,
  getMessagesByQuoteId,
  getQuote,
} from '@app/redux/marketplace';
import { hasError } from '@app/redux/notifier';
import { getProfile } from '@app/redux/profile';
import { getExternalCreditor } from '@app/redux/users';

const MarketplaceQuoteDetailsComponent = (props) => {
  const {
    createQuoteMessage,
    fetchMessagesByQuoteId,
    fetchQuote,
    quote,
    quoteId,
  } = props;

  const handleSubmitMessage = useCallback(
    (params) => createQuoteMessage(params),
    [createQuoteMessage]
  );

  useEffect(() => {
    if (quoteId) {
      fetchQuote(quoteId);
      fetchMessagesByQuoteId(quoteId);
    }
  }, [fetchMessagesByQuoteId, fetchQuote, quoteId]);

  return quote.id ? (
    <JobActivities
      activities={props.messages}
      hasError={props.hasError}
      isLoading={props.isLoading}
      className="pt-3"
      innerClassName="px-3 px-lg-4"
      job={props.job}
      maxMarketplaceFeeCents={props.maxMarketplaceFeeCents}
      pathname={props.location.pathname}
      quote={quote}
      tradieUser={props.tradieUser}
      onSubmitMessage={handleSubmitMessage}
    />
  ) : null;
};

MarketplaceQuoteDetailsComponent.propTypes = {
  createQuoteMessage: PropTypes.func,
  fetchMessagesByQuoteId: PropTypes.func,
  fetchQuote: PropTypes.func,
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  location: PropTypes.object.isRequired,
  maxMarketplaceFeeCents: PropTypes.number,
  messages: PropTypes.array,
  job: PropTypes.object,
  quote: PropTypes.object,
  quoteId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tradieUser: PropTypes.object,
};

const mapStateToProps = (state, props) => {
  const { quoteId } = props;
  const profile = getProfile(state.profile);

  return {
    isLoading: state.marketplace.isLoading,
    hasError: hasError(state),
    maxMarketplaceFeeCents: state.settings.maxMarketplaceFeeCents,
    messages: getMessagesByQuoteId(state.marketplace, quoteId),
    quote: getQuote(state.marketplace, quoteId),
    tradieUser: getExternalCreditor(state.users, profile.id),
  };
};

const mapDispatchToProps = {
  createQuoteMessage,
  fetchMessagesByQuoteId,
  fetchQuote,
};

export const MarketplaceQuoteDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketplaceQuoteDetailsComponent);
