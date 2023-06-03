import isEmpty from 'lodash/fp/isEmpty';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import { useRolesContext } from '../../modules/Profile';
import { TaskFormEdit } from '../../modules/Task';
import { useTaskParties } from '../../modules/Task/hooks';
import {
  fetchLease,
  getLease,
  getLeaseUpcoming,
  getLeasesExpired,
} from '../../redux/lease';
import { fetchQuote, getQuote } from '../../redux/marketplace';
import { hasError } from '../../redux/notifier';
import { getProfile } from '../../redux/profile';
import {
  fetchBpayBillers,
  updateTask,
  updateTaskAttachments,
} from '../../redux/task';
import {
  fetchBpayOutProviders,
  getBpayBillers,
  getBpayOutProviders,
  getManagerPrimaryAgency,
} from '../../redux/users';

const PropertyTaskEditComponent = ({
  acceptedQuote,
  bpayBillers,
  bpayOutProviders,
  expiredLeases,
  fetchBpayBillers,
  fetchBpayOutProviders,
  fetchLease,
  fetchQuote,
  hasAllowedBpayBillerAsCreditor,
  hasError,
  history,
  isBill,
  isMarketplaceEnabled,
  isBpayOutEnabled,
  isLoading,
  lease,
  property,
  task,
  tenant,
  taskMeta,
  updateTask,
  updateTaskAttachments,
  userAgency,
  upcomingLease,
}) => {
  const { isManager } = useRolesContext();

  const { creditors, debtors, pastTenants, upcomingTenants } = useTaskParties({
    acceptedQuote,
    bpayBillers,
    bpayOutProviders,
    expiredLeases,
    property,
    tenant,
    userAgency,
    upcomingLease,
    hasAllowedBpayBillerAsCreditor,
  });

  const isBpayOut = useMemo(
    () => (isManager ? userAgency?.isBpayOutViaAssembly : isBpayOutEnabled),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isBpayOutEnabled, isManager, userAgency?.isBpayOutViaAssembly]
  );

  const handleCancel = useCallback(() => history.goBack(), [history]);

  const handleOnComplete = useCallback(() => {
    if (task.id) {
      history.push(`/property/${property.id}/tasks/${task.id}`);
    }
  }, [history, property.id, task.id]);

  const handleSubmit = useCallback(
    (values) => values.taskId && updateTask({ ...values, status: undefined }), // Task status should not be updated via form
    [updateTask]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (task.acceptedQuoteId) {
      fetchQuote(task.acceptedQuoteId);
    }
  }, [task.acceptedQuoteId]);

  useEffect(() => {
    if (isManager) {
      fetchBpayOutProviders();

      if (task.leaseId) {
        fetchLease({ leaseId: task.leaseId });
      }
    }
  }, [task.id]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div className="wrapper">
      <Container>
        {property && !isEmpty(taskMeta) ? (
          <TaskFormEdit
            acceptedQuote={acceptedQuote}
            creditorList={creditors}
            debtorList={debtors}
            fetchBpayBillers={fetchBpayBillers}
            hasAllowedBpayBillerAsCreditor={hasAllowedBpayBillerAsCreditor}
            hasError={hasError}
            isBill={isBill}
            isBpayOut={isBpayOut}
            isLoading={isLoading}
            isMarketplaceEnabled={isMarketplaceEnabled}
            leases={[lease]}
            pastTenants={pastTenants}
            upcomingTenants={upcomingTenants}
            property={property}
            task={task}
            taskMeta={taskMeta}
            onCancel={handleCancel}
            onComplete={handleOnComplete}
            onSubmit={handleSubmit}
            onUploaderComplete={updateTaskAttachments}
          />
        ) : null}
      </Container>
    </div>
  );
};

PropertyTaskEditComponent.propTypes = {
  acceptedQuote: PropTypes.object,
  bpayBillers: PropTypes.array,
  bpayOutProviders: PropTypes.array,
  expiredLeases: PropTypes.array,
  fetchBpayBillers: PropTypes.func,
  fetchBpayOutProviders: PropTypes.func,
  fetchLease: PropTypes.func,
  fetchQuote: PropTypes.func,
  hasAllowedBpayBillerAsCreditor: PropTypes.bool,
  hasError: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  isBill: PropTypes.bool.isRequired,
  isBpayOutEnabled: PropTypes.bool,
  isMarketplaceEnabled: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  lease: PropTypes.object,
  property: PropTypes.object.isRequired,
  task: PropTypes.object,
  taskMeta: PropTypes.object,
  tenant: PropTypes.object.isRequired,
  updateTask: PropTypes.func.isRequired,
  updateTaskAttachments: PropTypes.func.isRequired,
  userAgency: PropTypes.object,
  upcomingLease: PropTypes.object,
};

const mapStateToProps = (state, props) => {
  const { property, task } = props;
  const profile = getProfile(state.profile);

  return {
    acceptedQuote: getQuote(state.marketplace, task?.acceptedQuoteId),
    bpayBillerList: getBpayBillers(state.users),
    bpayOutProviders: getBpayOutProviders(state.users),
    expiredLeases: getLeasesExpired(state.lease, property.id),
    hasAllowedBpayBillerAsCreditor: state.settings.allowBpayBillerAsCreditor,
    hasError: hasError(state),
    isLoading: state.task.isLoading || state.users.isLoading,
    isBpayOutEnabled: profile.isBpayOutEnabled,
    isMarketplaceEnabled: profile.isMarketplaceEnabled,
    lease: getLease(state.lease, task?.leaseId),
    userAgency: getManagerPrimaryAgency(state.users, profile.id),
    upcomingLease: getLeaseUpcoming(state.lease, property.id),
  };
};

const mapDispatchToProps = {
  fetchBpayBillers,
  fetchBpayOutProviders,
  fetchLease,
  fetchQuote,
  updateTask,
  updateTaskAttachments,
};

export const PropertyTaskEdit = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyTaskEditComponent);
