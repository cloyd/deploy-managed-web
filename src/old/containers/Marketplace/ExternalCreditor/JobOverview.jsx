import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Button, Card, Container } from 'reactstrap';

import { Header } from '@app/modules/Header';
import { JobOverview, QuoteActions } from '@app/modules/Marketplace';
import {
  acceptQuote,
  createQuote,
  fetchJob,
  fetchQuotesByJobId,
  getJob,
  selectQuotesForJob,
} from '@app/redux/marketplace';
import { getProfile } from '@app/redux/profile';

export const MarketplaceJobOverview = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { jobId } = useParams();

  const job = useSelector((state) => {
    return getJob(state.marketplace, jobId);
  });

  const quotes = useSelector((state) => {
    return selectQuotesForJob(state, jobId);
  });

  const profileId = useSelector((state) => {
    return getProfile(state.profile).id;
  });

  const isEditing = useMemo(() => {
    return /\/edit$/.test(location.pathname);
  }, [location]);

  const userQuote = useMemo(() => {
    return quotes.find((quote) => {
      return quote.tradie?.id === profileId;
    });
  }, [profileId, quotes]);

  const handleAcceptJob = useCallback(() => {
    const action = userQuote
      ? acceptQuote(userQuote.id)
      : createQuote({
          skipBidCents: true,
          tradieJobId: job.id,
          workOrder: job.workOrder,
        });

    dispatch(action);
  }, [dispatch, job, userQuote]);

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJob(jobId));
      dispatch(fetchQuotesByJobId(jobId));
    }
  }, [dispatch, jobId]);

  return (
    <>
      <Header className="mb-0" title="Job Details">
        <Button className="p-0" color="link" onClick={handleBack}>
          Back to Marketplace
        </Button>
      </Header>
      <Container className="py-4" data-testid="tradie-job-overview">
        <Card
          className="shadow-sm border-0 overflow-hidden"
          data-testid="marketplace-job-preview">
          <JobOverview
            isEditing={isEditing}
            job={job}
            profileId={profileId}
            quotes={quotes}
            userQuote={userQuote}
          />
        </Card>
      </Container>
      {!isEditing && (
        <QuoteActions
          job={job}
          quote={userQuote}
          onAcceptJob={handleAcceptJob}
        />
      )}
    </>
  );
};
