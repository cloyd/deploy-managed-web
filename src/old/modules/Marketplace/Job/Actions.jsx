import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import { ButtonDollar, ButtonIcon } from '@app/modules/Button';
import { Link } from '@app/modules/Link';
import {
  JobCancelModal,
  JobRequestReviewModal,
  QuoteAcceptModal,
  QuoteRevertModal,
  useJobPermissions,
} from '@app/modules/Marketplace';
import { NavOverlay } from '@app/modules/Nav';

/**
 * Job actions nav - for managers and owners
 */
export const JobActions = ({
  job,
  onAcceptQuote,
  onCancelJob,
  onRequestReview,
  onRevertQuote,
  quote,
  task,
}) => {
  const {
    canAccept,
    canBillJob,
    canCancelJob,
    canEditJob,
    canInviteForQuote,
    canInviteForWorkOrder,
    canRecommend,
    canRequestReview,
    canRevertAcceptedQuote,
  } = useJobPermissions({ job, quote });

  return canEditJob || canAccept ? (
    <NavOverlay data-testid="job-actions-nav">
      <Row>
        <Col
          md={{ size: 8, offset: 2 }}
          lg={{ size: 6, offset: 3 }}
          className="d-flex justify-content-around">
          {onCancelJob && canCancelJob && (
            <JobCancelModal title={job.title} onSubmit={onCancelJob} />
          )}
          {onRevertQuote && canRevertAcceptedQuote && (
            <QuoteRevertModal title={quote.title} onSubmit={onRevertQuote} />
          )}
          {canInviteForQuote && (
            <Link
              data-testid="button-invite-job"
              to={`/property/${task.propertyId}/tasks/${task.id}/job/invite`}>
              <ButtonIcon
                direction="column"
                icon={['far', 'comment-dollar']}
                size="2x">
                <small>Invite</small>
              </ButtonIcon>
            </Link>
          )}
          {canInviteForWorkOrder && (
            <Link
              data-testid="button-invite-work-order"
              to={`/property/${task.propertyId}/tasks/${task.id}/job/invite`}>
              <ButtonIcon
                direction="column"
                icon={['far', 'comment-dollar']}
                size="2x">
                <small>Send</small>
              </ButtonIcon>
            </Link>
          )}
          {canBillJob && (
            <Link to={`/property/${task.propertyId}/tasks/${task.id}/bill#add`}>
              <ButtonDollar size="2x" direction="column">
                <small>Invoice</small>
              </ButtonDollar>
            </Link>
          )}
          {onRequestReview && canRequestReview && (
            <JobRequestReviewModal
              title={job.title}
              onSubmit={onRequestReview}
            />
          )}
          {onAcceptQuote && canAccept && (
            <QuoteAcceptModal quote={quote} onSubmit={onAcceptQuote} />
          )}
          {canRecommend && (
            <Link
              data-testid="button-review-tradie"
              to={`/property/${task.propertyId}/tasks/${task.id}/job/recommend/${quote.id}`}>
              <ButtonIcon direction="column" icon={['far', 'star']} size="2x">
                <small>Rate</small>
              </ButtonIcon>
            </Link>
          )}
        </Col>
      </Row>
    </NavOverlay>
  ) : null;
};

JobActions.defaultProps = {
  quote: {},
  task: {},
};

JobActions.propTypes = {
  isDebtor: PropTypes.bool,
  job: PropTypes.object,
  onAcceptQuote: PropTypes.func,
  onCancelJob: PropTypes.func,
  onRequestReview: PropTypes.func,
  onRevertQuote: PropTypes.func,
  property: PropTypes.object,
  quote: PropTypes.object,
  task: PropTypes.object,
};
