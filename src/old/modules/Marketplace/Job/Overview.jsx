import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Col, Nav, NavItem, Row, TabContent, TabPane } from 'reactstrap';

import {
  MarketplaceQuoteCreate,
  MarketplaceQuoteDetails,
  MarketplaceQuoteEdit,
} from '@app/containers/Marketplace';
import { useIsBreakpoint } from '@app/hooks';
import { CardLight } from '@app/modules/Card';
import {
  JobDetailsForTradies,
  JobOverviewTitle,
  JobTradieDetails,
  QuoteCard,
  QuoteList,
  useJobType,
  useQuoteStatus,
} from '@app/modules/Marketplace';
import { useRolesContext } from '@app/modules/Profile';

export const JobOverview = ({
  isEditing,
  job,
  profileId,
  quotes,
  userQuote,
}) => {
  const history = useHistory();
  const location = useLocation();
  const { isExternalCreditor } = useRolesContext();
  const isSm = useIsBreakpoint('sm');

  // TODO: This needs updating to use match params to set tabs
  // and this whole component can be combined with parent container
  const [activeTab, setActiveTab] = useState('overview');

  const otherQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      return quote.tradie?.id !== profileId;
    });
  }, [profileId, quotes]);

  const { isAwaitingAcceptance } = useQuoteStatus(userQuote);

  const hasUserQuote = useMemo(() => {
    return !!userQuote;
  }, [userQuote]);

  const hasOtherQuotes = useMemo(() => {
    return !!otherQuotes?.length;
  }, [otherQuotes]);

  const hasQuoteMessage = useMemo(() => {
    return (
      hasUserQuote &&
      hasOtherQuotes &&
      isExternalCreditor &&
      isAwaitingAcceptance &&
      !job.acceptedQuoteId
    );
  }, [
    hasUserQuote,
    hasOtherQuotes,
    isExternalCreditor,
    isAwaitingAcceptance,
    job,
  ]);

  const quoteMessage = useMemo(() => {
    return job.hasWorkOrder
      ? 'This work order has been sent to multiple trades, please ensure you accept it quickly to secure the job'
      : 'This quote request has been sent to multiple trades, please ensure you submit your quote quickly to secure the job';
  }, [job]);

  const jobType = useJobType(job);

  const quoteStatus = useMemo(() => {
    if (hasUserQuote && userQuote) {
      return userQuote.status;
    } else if (job.acceptedQuoteId) {
      return `${jobType} Approved`;
    }

    return 'Awaiting Tradies';
  }, [hasUserQuote, jobType, job.acceptedQuoteId, userQuote]);

  const handleClick = useCallback(
    (id) => () => {
      setActiveTab(id);

      if (isEditing) {
        history.push(`/marketplace/${job.id}`);
      }
    },
    [history, isEditing, job.id, setActiveTab]
  );

  const handleQuote = useCallback(() => {
    history.push(`/marketplace/${job.id}/edit`);
  }, [history, job.id]);

  useEffect(() => {
    if (isEditing && activeTab !== 'quote-form') {
      setActiveTab('quote-form');
    }

    if (!isEditing && activeTab === 'quote-form') {
      setActiveTab(hasUserQuote ? 'quote' : 'overview');
    }
  }, [activeTab, hasUserQuote, isEditing, setActiveTab]);

  return (
    <Row className="mx-md-0">
      <Col
        md={4}
        className="d-flex flex-column-reverse flex-md-column p-3 bg-purple-100">
        <Nav vertical className="px-3 px-md-0">
          <NavItem className="mb-3">
            <QuoteCard
              isActive={activeTab === 'overview'}
              title="Job Overview"
              status={quoteStatus}
              onClick={handleClick('overview')}>
              <FontAwesomeIcon
                className="mr-3"
                icon={['far', 'file-lines']}
                size="xl"
              />
            </QuoteCard>
          </NavItem>
          {hasUserQuote && (
            <NavItem data-testid="my-quote">
              <h5 className="mb-3 text-dark" data-testid="my-quote-title">
                My {userQuote.isWorkOrder ? 'work order' : 'quote'}
              </h5>
              <QuoteList
                selected={activeTab === 'quote' ? userQuote : undefined}
                quotes={[userQuote]}
                onClick={handleClick('quote')}
              />
            </NavItem>
          )}
          {hasQuoteMessage && (
            <CardLight
              className="alert-warning p-3 mb-3"
              data-testid="quote-message">
              {quoteMessage}
            </CardLight>
          )}
          {hasOtherQuotes && !isExternalCreditor && (
            <NavItem data-testid="other-quotes">
              <QuoteList
                className="mb-3"
                quotes={otherQuotes}
                onClick={handleClick('other-quotes')}
              />
            </NavItem>
          )}
        </Nav>
      </Col>
      <Col md={8} className={`p-md-0 ${isSm ? 'border-left' : 'border-0'}`}>
        <TabContent activeTab={activeTab}>
          <div className="px-3 px-lg-4 py-3 border-bottom">
            <JobOverviewTitle
              isEmergency={job.isEmergency}
              title={job.title}
              address={job.property?.address}
            />
          </div>
          {hasUserQuote && <JobTradieDetails tradie={userQuote.tradie} />}
          <TabPane tabId="overview" className="p-3 px-lg-4">
            <JobDetailsForTradies job={job} onClickQuote={handleQuote} />
          </TabPane>
          <TabPane tabId="quote" className="bg-gray-200">
            <MarketplaceQuoteDetails
              job={job}
              location={location}
              quoteId={userQuote?.id}
            />
          </TabPane>
          <TabPane tabId="quote-form" className="p-3 px-lg-4">
            {hasUserQuote ? (
              <MarketplaceQuoteEdit job={job} quote={userQuote} />
            ) : (
              <MarketplaceQuoteCreate job={job} />
            )}
          </TabPane>
        </TabContent>
      </Col>
    </Row>
  );
};

JobOverview.propTypes = {
  isEditing: PropTypes.bool,
  job: PropTypes.object,
  profileId: PropTypes.number,
  quotes: PropTypes.array,
  userQuote: PropTypes.object,
};
