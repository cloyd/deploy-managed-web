import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

import { ButtonIcon } from '@app/modules/Button';
import { Link } from '@app/modules/Link';
import {
  JobAcceptModal,
  QuoteDeclineButton,
  useIsAvailableWorkOrder,
  useIsQuotableWorkOrder,
} from '@app/modules/Marketplace';
import { NavOverlay } from '@app/modules/Nav';
import { useRolesContext } from '@app/modules/Profile';

/**
 * Quote actions nav - for tradies
 *
 * @param {*} props
 */
export const QuoteActions = ({ onAcceptJob, job, quote }) => {
  const location = useLocation();
  const { isExternalCreditor } = useRolesContext();
  const isQuotableWorkOrder = useIsQuotableWorkOrder(quote);
  const isAvailableWorkOrder = useIsAvailableWorkOrder(job, quote);

  const canDecline = useMemo(() => {
    return !!quote;
  }, [quote]);

  const canAccept = useMemo(() => {
    return (isQuotableWorkOrder || isAvailableWorkOrder) && !quote?.bidCents;
  }, [isQuotableWorkOrder, isAvailableWorkOrder, quote]);

  const canQuote = useMemo(() => {
    return !job.hasWorkOrder || quote?.bidCents > 0;
  }, [job, quote]);

  return isExternalCreditor && !job.acceptedQuoteId ? (
    <NavOverlay>
      <Row>
        <Col
          md={{ size: 8, offset: 2 }}
          lg={{ size: 6, offset: 3 }}
          className="d-flex justify-content-around">
          {canDecline && <QuoteDeclineButton quote={quote} style="action" />}
          {canAccept && (
            <JobAcceptModal job={job} quote={quote} onSubmit={onAcceptJob} />
          )}
          {canQuote && (
            <Link to={`${location.pathname}/edit`}>
              <ButtonIcon
                direction="column"
                icon={['far', 'comment-dollar']}
                size="2x">
                <small>Quote</small>
              </ButtonIcon>
            </Link>
          )}
        </Col>
      </Row>
    </NavOverlay>
  ) : null;
};

QuoteActions.defaultProps = {
  quote: {},
};

QuoteActions.propTypes = {
  job: PropTypes.object,
  onAcceptJob: PropTypes.func,
  quote: PropTypes.object,
};
