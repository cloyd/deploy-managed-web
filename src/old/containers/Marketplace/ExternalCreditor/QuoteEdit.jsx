import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Link } from '@app/modules/Link';
import { MarketplaceFormQuoteEdit } from '@app/modules/Marketplace';
import { useIsQuotableWorkOrder } from '@app/modules/Marketplace/hooks';
import {
  QUOTE_STATUSES,
  updateQuote,
  updateQuoteAttachments,
} from '@app/redux/marketplace';
import { hasError } from '@app/redux/notifier';
import { getProfile } from '@app/redux/profile';
import { getExternalCreditor } from '@app/redux/users';

const ContainerComponent = (props) => {
  const { quote, updateQuote, updateQuoteAttachments } = props;
  const history = useHistory();
  const isQuotableWorkOrder = useIsQuotableWorkOrder(quote);

  const handleBack = useCallback(() => history.goBack(), [history]);

  const handleSubmit = useCallback(
    (params) => quote?.id && updateQuote(params),
    [quote, updateQuote]
  );

  return (
    <div data-testid="marketplace-quote-form">
      <h5 className="mb-3">Submit quote</h5>
      {quote?.status === QUOTE_STATUSES.quoting && (
        <p>
          Not ready to quote yet?{' '}
          <Link to={`/marketplace/${quote?.tradieJobId}`}>Click here</Link> to
          send a message to the PM.
        </p>
      )}
      <MarketplaceFormQuoteEdit
        hasError={props.hasError}
        isLoading={props.isLoading}
        isQuotableWorkOrder={isQuotableWorkOrder}
        job={props.job}
        maxMarketplaceFeeCents={props.maxMarketplaceFeeCents}
        quote={quote}
        tradieUser={props.tradieUser}
        onCancel={handleBack}
        onComplete={handleBack}
        onSubmit={handleSubmit}
        onUploaderComplete={updateQuoteAttachments}
      />
    </div>
  );
};

ContainerComponent.propTypes = {
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  job: PropTypes.object.isRequired,
  maxMarketplaceFeeCents: PropTypes.number,
  quote: PropTypes.object,
  tradieUser: PropTypes.object,
  updateQuote: PropTypes.func,
  updateQuoteAttachments: PropTypes.func,
};

const mapStateToProps = (state) => {
  const profile = getProfile(state.profile);

  return {
    hasError: hasError(state),
    isLoading: state.marketplace.isLoading,
    maxMarketplaceFeeCents: state.settings.maxMarketplaceFeeCents,
    tradieUser: getExternalCreditor(state.users, profile.id),
  };
};

const mapDispatchToProps = { updateQuote, updateQuoteAttachments };

export const MarketplaceQuoteEdit = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContainerComponent);
