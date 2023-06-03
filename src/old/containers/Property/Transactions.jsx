import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import startCase from 'lodash/fp/startCase';
import pluralize from 'pluralize';
import PropTypes from 'prop-types';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  UncontrolledTooltip,
} from 'reactstrap';

import { Link } from '../../modules/Link';
import {
  LoanAlert,
  useLoans,
  useLoansHasPending,
  useLoansWalletBalanceCents,
} from '../../modules/Loan';
import { PaymentTransaction } from '../../modules/Payment';
import { useRolesContext } from '../../modules/Profile';
import { PropertyUserIcon } from '../../modules/Property';
import {
  adjustIntention,
  destroyIntention,
  fetchIntentionsCompleted,
  fetchIntentionsPayable,
} from '../../redux/intention';
import { fetchLease, getLease } from '../../redux/lease';
import { hasError as hasErrorSelector, showAlert } from '../../redux/notifier';
import { getPagination } from '../../redux/pagination';
import { canApplyCredit as canApplyCreditSelector } from '../../redux/profile';
import { fetchProperty } from '../../redux/property';
import { fetchTenant } from '../../redux/users';
import { centsToDollar, formatDate } from '../../utils';
import { useIntentionPaymentStatus } from './useIntentionPaymentStatus';
import useIntentions, { PAGE_SIZE } from './useIntentions';

const FREQUENCY_SHOW_TOOLTIP = ['weekly_withdrawal', 'monthly_withdrawal'];

export const PropertyTransactions = ({ history, location, property }) => {
  const dispatch = useDispatch();
  const toolTipRef = useRef();

  // redux state
  const payablePagination = useSelector((state) =>
    getPagination(state.pagination, 'details')
  );
  const completedPagination = useSelector((state) =>
    getPagination(state.pagination, 'intentions')
  );

  const match = location.search.match(/leaseId=(\d+)/);
  const leaseId = parseInt((match && match[1]) || property.leaseId);
  const lease = useSelector((state) => getLease(state.lease, leaseId));
  const canApplyCredit = useSelector((state) =>
    canApplyCreditSelector(state.profile)
  );
  const hasError = useSelector((state) => hasErrorSelector(state));

  const isLatestLease = leaseId === property.leaseId;

  const primaryTenantId = lease?.primaryTenant?.id;

  const { isManager, isPrincipal, isCorporateUser, isOwner } =
    useRolesContext();

  const [payableState, { onLoadMore: onLoadMorePayable }] = useIntentions({
    property,
    leaseId,
  });

  const [completedState, { onLoadMore: onLoadMoreCompleted }] = useIntentions({
    type: 'completed',
    property,
    leaseId,
  });

  // check if theres intention processing
  const processingIntention = useMemo(
    () =>
      payableState.list.length
        ? payableState.list.find((a) => a.isProcessing)
        : undefined,
    [payableState.list]
  );

  const { isSuccess, data } = useIntentionPaymentStatus(
    processingIntention?.id
  );

  useEffect(() => {
    if (isSuccess && data) {
      if (data.status === 'completed') {
        // calling updated property will trigger refetch of payable/completed intentions
        dispatch(fetchProperty({ propertyId: property.id }));
        dispatch(
          showAlert({
            color: 'success',
            message: `<strong>Success:</strong> ${
              data.message || 'Your payment is completed.'
            }`,
          })
        );
      } else if (data.status === 'processing') {
        dispatch(
          showAlert({
            color: 'warning',
            message:
              'A payment is currently processing. You will be able to process further payments as soon as it completes.',
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dispatch, isSuccess, payableState.list]);

  const handleRemoveIntention = useCallback(
    (intentionId, taskId) =>
      dispatch(
        destroyIntention({
          intentionId,
          taskId,
          leaseId: lease.id,
          propertyId: property.id,
          currentPage: payableState.page,
        })
      ),
    [dispatch, lease.id, property.id, payableState.page]
  );

  const handleSubmit = useCallback(
    ({ intentionId, ...values }) =>
      dispatch(
        adjustIntention({
          ...values,
          intentionId,
          leaseId: lease.id,
          propertyId: property.id,
        })
      ),
    [dispatch, lease.id, property.id]
  );

  const [loans] = useLoans(isOwner && property);
  const loanWalletsBalance = useLoansWalletBalanceCents(loans);
  const hasPendingLoans = useLoansHasPending(loans);

  const totalAvailable = useMemo(() => {
    if (loans && !isNaN(property.floatBalanceAmountCents)) {
      return loanWalletsBalance + property.floatBalanceAmountCents;
    }
  }, [loans, loanWalletsBalance, property]);

  const totalPayable = useMemo(() => {
    if (property?.floatCents > 0) {
      return property.floatCents;
    }
  }, [property]);

  const isLoanAlertOpen = useMemo(() => {
    if (
      isOwner &&
      property.canApplyForLoans &&
      !isNaN(totalPayable) &&
      !isNaN(totalAvailable)
    ) {
      return totalPayable > totalAvailable;
    }

    return false;
  }, [property, isOwner, totalAvailable, totalPayable]);

  // Side effects

  useEffect(() => {
    if (leaseId && !lease.id) {
      dispatch(fetchLease({ leaseId }));
    }
  }, [dispatch, lease.id, leaseId]);

  useEffect(() => {
    if (lease && lease?.primaryTenant && primaryTenantId) {
      dispatch(fetchTenant({ tenantId: primaryTenantId }));
    }
  }, [dispatch, lease, primaryTenantId]);

  const tenant = useSelector(
    (state) => state.users.tenant.data[lease.primaryTenant?.id]
  );

  const handleClickPayment = useCallback(
    (property, intention) => {
      const url = `/payments/${intention.id}?leaseId=${intention.leaseId}&propertyId=${property.id}`;

      history.push(url);
    },
    [history]
  );

  useEffect(() => {
    if (property.id) {
      const intentionProps = {
        ...(!isLatestLease && { leaseId }),
        propertyId: property.id,
        property,
        page: 1,
        perPage: PAGE_SIZE,
      };

      // NOTE: Initial load for payable is 5,
      // BE limitation: per_page should be fixed value
      dispatch(fetchIntentionsPayable(intentionProps));

      dispatch(fetchIntentionsCompleted(intentionProps));
    }
  }, [dispatch, isLatestLease, leaseId, property, property.id]);

  const withdrawalFrequency = property?.primaryOwner?.withdrawalFrequency
    ? property.primaryOwner.withdrawalFrequency.split('_')[0]
    : 'instant';

  return (
    <Container>
      {!isLatestLease ? (
        <Alert
          color="warning"
          className="d-flex justify-content-between h6-font-size mb-3">
          <div>
            <p className="mb-0">
              <strong>
                You are viewing the transactions for a terminated lease
              </strong>
            </p>
            <p className="mb-0">Start Date: {formatDate(lease?.startDate)}</p>
            <p className="mb-0">
              Termination Date: {formatDate(lease?.terminationDate)}
            </p>
            <p className="mb-0">
              <span>
                {`${startCase(lease.payFrequency)} Rent`}:{' '}
                {lease.amountDollars && lease.amountDollars[lease.payFrequency]}
              </span>
            </p>
          </div>
          {lease.primaryTenant && (
            <div className="text-right">
              <strong>Tenant for this lease</strong>
              <PropertyUserIcon user={lease.primaryTenant} role="tenant" />
            </div>
          )}
          {lease.secondaryTenants && lease.secondaryTenants.length > 0 && (
            <div className="text-right">
              <strong>Secondary tenants</strong>
              {lease.secondaryTenants.map((tenant, index) => (
                <PropertyUserIcon key={index} user={tenant} role="tenant" />
              ))}
            </div>
          )}
        </Alert>
      ) : (
        <Card className="mb-3 h5-font-size">
          <CardBody>
            <Row>
              <Col md={7}>
                {`${startCase(lease.payFrequency)} Rent`}:{' '}
                {lease.amountDollars && lease.amountDollars[lease.payFrequency]}
                <small className="d-block">
                  {lease.rentPaidUpUntil && (
                    <span>
                      Paid up until: {formatDate(lease.rentPaidUpUntil)}
                    </span>
                  )}{' '}
                  {lease.arrears?.rentOverdueDays > 0 && (
                    <span className="d-block text-danger">
                      ({lease.arrears?.rentOverdueDays}{' '}
                      {pluralize('day', lease.arrears?.rentOverdueDays)}{' '}
                      overdue)
                    </span>
                  )}
                </small>
              </Col>
              {(isPrincipal || isCorporateUser || isManager || isOwner) && (
                <Col
                  md={5}
                  className="d-flex flex-column mt-2 mt-md-0 align-items-md-end">
                  {property.paysViaRent && (
                    <span>Required: {centsToDollar(property.floatCents)}</span>
                  )}
                  <span
                    className={`small ${
                      property.paysViaRent && 'text-muted text-md-right'
                    }`}>
                    {property?.agency?.isWalletTransactionReportEnabled && (
                      <Link
                        to={`/property/${property.id}/transactions/walletReport`}>
                        {FREQUENCY_SHOW_TOOLTIP.includes(
                          property?.primaryOwner?.withdrawalFrequency
                        )
                          ? 'Funds being held'
                          : 'Wallet Balance'}
                      </Link>
                    )}
                    {FREQUENCY_SHOW_TOOLTIP.includes(
                      property?.primaryOwner?.withdrawalFrequency
                    ) ? (
                      <>
                        {!property?.agency?.isWalletTransactionReportEnabled &&
                          'Funds being held'}
                        {`:${centsToDollar(property.floatBalanceAmountCents)}`}
                        <span ref={toolTipRef} className="text-left ml-1">
                          <FontAwesomeIcon icon={['fas', 'circle-question']} />
                        </span>
                        <UncontrolledTooltip
                          id="disbursement_tooltip"
                          target={toolTipRef}
                          placement="top">
                          {`Funds are being held till the end of the ${withdrawalFrequency.slice(
                            0,
                            withdrawalFrequency.length - 2
                          )}. Funds that are not needed for bills will be paid out to the owner on the first day of the new ${withdrawalFrequency.slice(
                            0,
                            withdrawalFrequency.length - 2
                          )}.`}
                        </UncontrolledTooltip>
                      </>
                    ) : (
                      <>
                        {!property?.agency?.isWalletTransactionReportEnabled &&
                          'Wallet Balance'}
                        :{centsToDollar(property.floatBalanceAmountCents)}
                      </>
                    )}
                  </span>
                  {loanWalletsBalance > 0 && (
                    <span className="small text-muted">
                      Available Loans Balance:{' '}
                      {centsToDollar(loanWalletsBalance)}
                    </span>
                  )}
                  {hasPendingLoans && (
                    <span className="d-flex align-items-center small text-muted">
                      <FontAwesomeIcon
                        icon={['far', 'clock']}
                        className="mr-2"
                      />
                      Loan application in progress!
                    </span>
                  )}
                </Col>
              )}
            </Row>
            <LoanAlert
              isOpen={isLoanAlertOpen}
              property={property}
              className="mt-3 mb-0"
            />
          </CardBody>
        </Card>
      )}

      <PaymentTransaction
        canApplyCredit={isLatestLease && canApplyCredit}
        intentions={payableState.list}
        message="No upcoming payments."
        title={isLatestLease ? 'Upcoming' : 'Incomplete'}
        hasError={hasError}
        property={property}
        onClickPayment={handleClickPayment}
        onClickRemove={handleRemoveIntention}
        onSubmit={handleSubmit}
        isLoading={payableState.initialLoad}
        tenantWalletBalance={tenant?.walletBalanceAmountCents}
      />

      <LoadMoreButton
        loadMore={onLoadMorePayable}
        isFetching={payableState.isFetching}
        canLoadMore={
          !!(
            payableState.list.length &&
            payableState.list.length < payablePagination.total
          )
        }
      />

      <PaymentTransaction
        isCompleted={true}
        intentions={completedState.list}
        message="No completed payments."
        title="Completed"
        canApplyCredit={canApplyCredit}
        hasError={hasError}
        property={property}
        isLoading={completedState.initialLoad}
      />

      <LoadMoreButton
        loadMore={onLoadMoreCompleted}
        isFetching={completedState.isFetching}
        canLoadMore={
          !!(
            completedState.list.length &&
            completedState.list.length < completedPagination.total
          )
        }
      />
    </Container>
  );
};

PropertyTransactions.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
};

export default memo(PropertyTransactions);

// TODO: extract this component
const LoadMoreButton = ({
  isFetching = false,
  canLoadMore = false,
  loadMore,
}) => {
  if (!canLoadMore) {
    return null;
  }

  return (
    <div className="d-flex justify-content-center mb-5">
      <Button color="primary" onClick={loadMore} disabled={isFetching}>
        {isFetching ? 'Loading...' : 'Load more'}
      </Button>
    </div>
  );
};

LoadMoreButton.propTypes = {
  isFetching: PropTypes.bool,
  canLoadMore: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
};
