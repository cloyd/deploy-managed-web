import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  Card,
  Col,
  Container,
  Nav,
  NavItem,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';

import { MarketplaceQuoteEdit } from '@app/containers/Marketplace';
import { useIsBreakpoint, usePrevious } from '@app/hooks';
import { ButtonEdit } from '@app/modules/Button';
import { Link } from '@app/modules/Link';
import {
  JobActionsWithDispatch,
  JobActivities,
  JobDetailsForTradies,
  JobOverviewTitle,
  JobTradieDetails,
  MarketplaceFormJob,
  MarketplaceFormJobInvite,
  MarketplaceFormTradieRecommendation,
  QuoteCard,
  QuoteList,
  useJobPermissions,
} from '@app/modules/Marketplace';
import {
  createQuoteMessage,
  fetchJob,
  fetchMessagesByQuoteId,
  fetchQuotesByJobId,
  inviteTradiesToQuote,
  recommendTradie,
  selectMessagesForQuote,
  selectQuote,
  selectQuotesForJob,
} from '@app/redux/marketplace';
import { hasError } from '@app/redux/notifier';
import { setTaskJobIds } from '@app/redux/task';
import { pluralize } from '@app/utils';

export const TaskJobOverview = ({ job, task }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isSm = useIsBreakpoint('sm');
  const { tab, quoteId } = useParams();

  const taskPath = useMemo(() => {
    return `/property/${task.propertyId}/tasks/${task.id}`;
  }, [task]);

  const workOrders = useSelector((state) => {
    return selectQuotesForJob(state, task.tradieJobId).filter(
      ({ isWorkOrder }) => isWorkOrder
    );
  });

  const quotes = useSelector((state) => {
    return selectQuotesForJob(state, task.tradieJobId).filter(
      ({ isWorkOrder }) => !isWorkOrder
    );
  });

  const quote = useSelector((state) => {
    return selectQuote(state, quoteId);
  });

  const messages = useSelector((state) => {
    return selectMessagesForQuote(state, quoteId);
  });

  const isLoading = useSelector((state) => {
    return state.marketplace.isLoading;
  });

  const isError = useSelector((state) => {
    return hasError(state);
  });

  const handleClick = useCallback(
    (quoteId) => {
      let path = `${taskPath}/job`;

      if (!isNaN(quoteId)) {
        path += `/quote/${quoteId}`;
      }

      history.push(path);
    },
    [history, taskPath]
  );

  const handleEditQuote = useCallback(() => {
    if (!isNaN(quoteId)) {
      history.push(`${taskPath}/job/quote-form/${quoteId}`);
    }
  }, [history, taskPath, quoteId]);

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleSubmitInvite = useCallback(
    (values) => {
      dispatch(inviteTradiesToQuote({ ...values, tradieJobId: job.id }));
    },
    [dispatch, job]
  );

  const handleSubmitWorkOrder = useCallback(
    (values) => {
      dispatch(
        inviteTradiesToQuote({
          ...values,
          tradieJobId: job.id,
          workOrder: true,
        })
      );
    },
    [dispatch, job]
  );

  const handleSubmitMessage = useCallback(
    (params) => {
      dispatch(createQuoteMessage(params));
    },
    [dispatch]
  );

  const handleSubmitRecommendation = useCallback(
    (content) => {
      dispatch(recommendTradie({ quoteId, content }));
      history.push(`${taskPath}/job/quote/${quoteId}`);
    },
    [dispatch, history, quoteId, taskPath]
  );

  const handleCompleteInvite = useCallback(() => {
    dispatch(fetchJob(job.id));
    dispatch(fetchQuotesByJobId(task.tradieJobId));
    history.push(`${taskPath}/job`);
  }, [dispatch, history, job, task, taskPath]);

  const prevJobId = usePrevious(job?.id);
  const prevAcceptedQuoteId = usePrevious(job?.acceptedQuoteId);

  const { canEditJob, canInviteForQuote, canInviteForWorkOrder } =
    useJobPermissions({ job, quote });

  useEffect(() => {
    if (quoteId) {
      dispatch(fetchMessagesByQuoteId(quoteId));
    }
  }, [dispatch, quoteId]);

  // handle the cancel state
  useEffect(() => {
    if (prevJobId && !job) {
      dispatch(setTaskJobIds(task));
      history.push(taskPath);
    }
  }, [dispatch, history, job, prevJobId, task, taskPath]);

  // handle the accept state
  useEffect(() => {
    if (!prevAcceptedQuoteId && job?.acceptedQuoteId) {
      dispatch(setTaskJobIds(task, job.id, job.acceptedQuoteId));
    }
  }, [dispatch, job, prevAcceptedQuoteId, task]);

  // TODO:
  // Make this like /containers/MarketPlace/ExternalCreditors/JobOverview
  // Refactor/combine card content with modules/Marketplace/Job/Overview
  return job ? (
    <Container data-testid="task-job-overview">
      <Link className="ml-2 mb-3" to={taskPath}>
        <FontAwesomeIcon icon={['far', 'chevron-left']} /> Back to task
      </Link>
      <Card
        className="shadow-sm border-0"
        data-testid="marketplace-job-preview">
        <Row className="mx-md-0">
          <Col
            md={4}
            className="d-flex flex-column-reverse flex-md-column p-3 bg-purple-100 rounded-left-lg">
            <Nav vertical className="px-3 px-md-0">
              <NavItem className="mb-3">
                <QuoteCard
                  isActive={!tab}
                  title="Job Overview"
                  status={task.taskStatus.name}
                  onClick={handleClick}>
                  <FontAwesomeIcon
                    className="mr-3"
                    icon={['far', 'file-lines']}
                    size="xl"
                  />
                </QuoteCard>
              </NavItem>
              {!!workOrders.length && (
                <NavItem data-testid="overview-work-orders">
                  <h5 className="ml-1 mb-3 text-dark">Work order</h5>
                  <QuoteList
                    selected={quote}
                    quotes={workOrders}
                    onClick={handleClick}
                  />
                </NavItem>
              )}
              {!!quotes.length && (
                <NavItem data-testid="overview-quotes">
                  <h5 className="ml-1 mb-3 text-dark">
                    {pluralize(`${quotes.length} response`, quotes)}
                  </h5>
                  <QuoteList
                    selected={quote}
                    quotes={quotes}
                    onClick={handleClick}
                  />
                </NavItem>
              )}
            </Nav>
          </Col>
          <Col md={8} className={`p-md-0 ${isSm ? 'border-left' : 'border-0'}`}>
            <TabContent activeTab={tab || 'overview'}>
              <div className="px-3 px-lg-4 py-3 border-bottom d-flex justify-content-between">
                <JobOverviewTitle
                  isEmergency={job.isEmergency}
                  title={job.title}
                  address={job.property?.address}
                />
                {canEditJob && tab !== 'edit' && (
                  <Link to={`${taskPath}/job/edit`}>
                    <ButtonEdit className="p-0">Edit Job</ButtonEdit>
                  </Link>
                )}
              </div>
              {!!quote?.tradie && tab !== 'recommend' && (
                <JobTradieDetails tradie={quote.tradie} />
              )}
              <TabPane tabId="overview" className="px-3 px-lg-4 py-3">
                <JobDetailsForTradies job={job} />
                <JobActionsWithDispatch job={job} quote={quote} task={task} />
              </TabPane>
              {canInviteForQuote && (
                <TabPane tabId="invite" className="px-3 px-lg-4 py-3">
                  <h5 className="mb-3">Request additional quotes</h5>
                  <MarketplaceFormJobInvite
                    hasError={isError}
                    isLoading={isLoading}
                    task={task}
                    onComplete={handleCompleteInvite}
                    onSubmit={handleSubmitInvite}
                  />
                </TabPane>
              )}
              {canInviteForWorkOrder && (
                <TabPane tabId="invite" className="px-3 px-lg-4 py-3">
                  <h5 className="mb-3">
                    Send work order to your preferred tradie
                  </h5>
                  <MarketplaceFormJobInvite
                    hasError={isError}
                    isLoading={isLoading}
                    isMulti={false}
                    task={task}
                    onComplete={handleCompleteInvite}
                    onSubmit={handleSubmitWorkOrder}
                  />
                </TabPane>
              )}
              {canEditJob && (
                <TabPane tabId="edit" className="px-3 px-lg-4 py-3">
                  <MarketplaceFormJob
                    task={task}
                    job={job}
                    onCancel={handleClick}
                  />
                </TabPane>
              )}
              {!!quote && (
                <>
                  <TabPane tabId="quote" className="bg-gray-200">
                    <JobActivities
                      activities={messages}
                      hasError={isError}
                      isLoading={isLoading}
                      className="pt-3"
                      innerClassName="px-3 px-lg-4"
                      quote={quote}
                      onSubmitMessage={handleSubmitMessage}
                      onEditQuote={canEditJob ? handleEditQuote : null}
                    />
                    <JobActionsWithDispatch
                      job={job}
                      quote={quote}
                      task={task}
                    />
                  </TabPane>
                  <TabPane tabId="recommend" className="px-3 px-lg-4 py-3">
                    <MarketplaceFormTradieRecommendation
                      onSubmit={handleSubmitRecommendation}
                      onCancel={handleCancel}
                    />
                  </TabPane>
                  {canEditJob && (
                    <TabPane tabId="quote-form" className="p-3 px-lg-4">
                      <MarketplaceQuoteEdit job={job} quote={quote} />
                    </TabPane>
                  )}
                </>
              )}
            </TabContent>
          </Col>
        </Row>
      </Card>
    </Container>
  ) : null;
};

TaskJobOverview.propTypes = {
  task: PropTypes.object,
  job: PropTypes.object,
};
