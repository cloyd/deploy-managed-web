import snakeCase from 'lodash/fp/snakeCase';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { AttachmentsList } from '@app/modules/Attachments';
import { DividerDouble } from '@app/modules/Divider';
import { Link } from '@app/modules/Link';
import {
  JobMessage,
  MarketplaceFormMessage,
  QuoteDetails,
  QuoteFeeBreakdown,
  useIsQuotableWorkOrder,
} from '@app/modules/Marketplace';
import { useRolesContext } from '@app/modules/Profile';
import { USER_TYPES } from '@app/redux/users';
import { centsToDollar } from '@app/utils';

export const JobActivities = ({
  activities,
  className,
  hasError,
  innerClassName,
  isLoading,
  job,
  maxMarketplaceFeeCents,
  onEditQuote,
  onSubmitMessage,
  pathname,
  quote,
  tradieUser,
}) => {
  const { isExternalCreditor, isManager } = useRolesContext();

  return (
    <div className={className} data-testid="marketplace-activities">
      <div className={innerClassName}>
        {quote && (
          <QuoteMessage
            isExternalCreditor={isExternalCreditor}
            isManager={isManager}
            job={job}
            maxMarketplaceFeeCents={maxMarketplaceFeeCents}
            pathname={pathname}
            quote={quote}
            tradieUser={tradieUser}
            onEditQuote={onEditQuote}
          />
        )}
        {activities &&
          activities.map((activity) => (
            <ActivityMessage
              activity={activity}
              isManager={isManager}
              key={`activity-${activity.id}`}
            />
          ))}
      </div>
      {onSubmitMessage && (isManager || isExternalCreditor) && (
        <div className="bg-white border-top mt-3 px-3 px-lg-4 py-3">
          <MarketplaceFormMessage
            hasError={hasError}
            isLoading={isLoading}
            quoteId={quote.id}
            toName={isManager ? quote?.tradie?.name : quote?.requester?.name}
            onSubmit={onSubmitMessage}
          />
        </div>
      )}
    </div>
  );
};

JobActivities.propTypes = {
  activities: PropTypes.array,
  className: PropTypes.string,
  hasError: PropTypes.bool,
  innerClassName: PropTypes.string,
  isLoading: PropTypes.bool,
  job: PropTypes.object,
  maxMarketplaceFeeCents: PropTypes.number,
  onEditQuote: PropTypes.func,
  onSubmitMessage: PropTypes.func,
  pathname: PropTypes.string,
  quote: PropTypes.object,
  tradieUser: PropTypes.object,
};

const QuoteMessage = ({
  onEditQuote,
  isExternalCreditor,
  isManager,
  job,
  maxMarketplaceFeeCents,
  pathname,
  quote,
  tradieUser,
}) => {
  const isQuotableWorkOrder = useIsQuotableWorkOrder(quote);

  const showReviseWorkOrderMessage =
    isExternalCreditor && pathname && isQuotableWorkOrder;

  const showFeeBreakdown =
    isExternalCreditor && !showReviseWorkOrderMessage && job && tradieUser;

  return (
    <JobMessage
      createdAt={quote.createdAt}
      fromName={quote.tradie?.name}
      fromId={quote.tradie?.id}
      fromType={USER_TYPES.externalCreditor}
      hasLink={isManager}
      isCreator={!isManager}
      isFullWidth>
      <QuoteDetails
        onEditQuote={onEditQuote}
        hasLink={isManager}
        isCompactView={true}
        quote={quote}
      />
      {showReviseWorkOrderMessage && (
        <>
          <DividerDouble className="mt-3" />
          <p data-testid="revise-work-order-message">
            If the work order invoice is greater than Job Limit,{' '}
            <Link to={`${pathname}/edit`}>click here to specify</Link>.
          </p>
          <p className="font-italic mb-0">
            Please note that a fee will be deducted upon invoicing of this work
            order.
          </p>
        </>
      )}
      {showFeeBreakdown && (
        <>
          <p className="mt-4 mb-2 font-weight-bold text-small">
            {quote.invoiceAmountCents
              ? 'Invoice breakdown'
              : job.hasWorkOrder && !quote.bidCents
              ? 'Work order breakdown'
              : 'Quote breakdown'}
          </p>
          <QuoteFeeBreakdown
            className="text-small"
            job={job}
            maxMarketplaceFeeCents={maxMarketplaceFeeCents}
            quote={quote}
            quoteAmount={quote.invoiceAmountCents || quote.bidCents}
            tradieUser={tradieUser}
          />
        </>
      )}
    </JobMessage>
  );
};

QuoteMessage.propTypes = {
  isExternalCreditor: PropTypes.bool,
  isManager: PropTypes.bool,
  job: PropTypes.object,
  maxMarketplaceFeeCents: PropTypes.number,
  onEditQuote: PropTypes.func,
  pathname: PropTypes.string,
  quote: PropTypes.object,
  tradieUser: PropTypes.object,
};

const ActivityMessage = (props) => {
  const { activity, isManager } = props;
  const fromType = snakeCase(activity.from?.type);
  const attachments =
    activity.attachments ||
    activity.data?.tradieQuoteMessage?.attachments ||
    [];

  const message =
    activity.action === 'invite' ? (
      <strong>Job request sent</strong>
    ) : activity.action === 'bid' ? (
      <strong>Quoted {centsToDollar(activity.data?.bidCents)}</strong>
    ) : activity.action === 'revise' ? (
      <strong>Quote revised to {centsToDollar(activity.data?.bidCents)}</strong>
    ) : (
      activity.content || activity.data?.tradieQuoteMessage?.content
    );

  const isActivityMessage = useMemo(() => {
    if (activity?.action) {
      const activityTypes = ['invite', 'bid', 'revise'];
      return activityTypes.some((type) => activity.action.includes(type));
    }

    return false;
  }, [activity]);

  return (
    <JobMessage
      createdAt={activity.createdAt}
      fromAvatarUrl={activity.from?.avatarUrl}
      fromId={activity.from?.id}
      fromName={activity.from?.name}
      fromType={fromType}
      hasLink={isManager}
      isActivityMessage={isActivityMessage}
      isCreator={
        isManager
          ? fromType === USER_TYPES.manager
          : fromType === USER_TYPES.externalCreditor
      }>
      {message}
      {attachments.length > 0 && (
        <AttachmentsList attachments={attachments} className="px-0 mt-3" />
      )}
    </JobMessage>
  );
};

ActivityMessage.propTypes = {
  isManager: PropTypes.bool,
  activity: PropTypes.object,
};
