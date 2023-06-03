import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { MarketplaceFormQuoteCreate } from '@app/modules/Marketplace';
import { createQuote } from '@app/redux/marketplace';
import { hasError } from '@app/redux/notifier';
import { getProfile } from '@app/redux/profile';
import { getExternalCreditor } from '@app/redux/users';

const ContainerComponent = ({
  createdQuoteId,
  createQuote,
  hasError,
  isLoading,
  job,
  maxMarketplaceFeeCents,
  tradieUser,
}) => {
  const history = useHistory();

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleSubmit = useCallback(
    (params) => {
      createQuote(params);
    },
    [createQuote]
  );

  useEffect(() => {
    // Reload when job has been created
    if (createdQuoteId) {
      window.location.reload(false);
    }
  }, [createdQuoteId]);

  return (
    <div data-testid="marketplace-quote-create">
      <h5 className="mb-3">Send my quote</h5>
      <MarketplaceFormQuoteCreate
        hasError={hasError}
        isLoading={isLoading}
        job={job}
        maxMarketplaceFeeCents={maxMarketplaceFeeCents}
        tradieUser={tradieUser}
        onCancel={handleBack}
        onComplete={handleBack}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

ContainerComponent.propTypes = {
  createdQuoteId: PropTypes.number,
  createQuote: PropTypes.func,
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  job: PropTypes.object.isRequired,
  maxMarketplaceFeeCents: PropTypes.number,
  tradieUser: PropTypes.object,
};

const mapStateToProps = (state) => {
  const profile = getProfile(state.profile);

  return {
    createdQuoteId: state.marketplace.quote.result,
    hasError: hasError(state),
    isLoading: state.marketplace.isLoading,
    maxMarketplaceFeeCents: state.settings.maxMarketplaceFeeCents,
    tradieUser: getExternalCreditor(state.users, profile.id),
  };
};

const mapDispatchToProps = { createQuote };

export const MarketplaceQuoteCreate = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContainerComponent);
