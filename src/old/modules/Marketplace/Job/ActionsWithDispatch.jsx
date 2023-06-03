import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { JobActions } from '@app/modules/Marketplace';
import {
  acceptQuote,
  cancelJob,
  requestOwnerReview,
  revertAcceptedQuote,
} from '@app/redux/marketplace';

export const JobActionsWithDispatch = ({ job, quote, task }) => {
  const dispatch = useDispatch();

  const handleAcceptQuote = useCallback(() => {
    dispatch(acceptQuote(quote.id));
  }, [dispatch, quote]);

  const handleCancelJob = useCallback(() => {
    dispatch(cancelJob(job.id));
  }, [dispatch, job]);

  const handleRequestReview = useCallback(() => {
    dispatch(requestOwnerReview(job.id));
  }, [dispatch, job]);

  const handleRevertQuote = useCallback(() => {
    dispatch(revertAcceptedQuote(quote.id));
  }, [dispatch, quote]);

  return (
    <JobActions
      job={job}
      quote={quote}
      task={task}
      onAcceptQuote={handleAcceptQuote}
      onCancelJob={handleCancelJob}
      onRequestReview={handleRequestReview}
      onRevertQuote={handleRevertQuote}
    />
  );
};

JobActionsWithDispatch.propTypes = {
  job: PropTypes.object,
  quote: PropTypes.object,
  task: PropTypes.object,
};
