import isEmpty from 'lodash/fp/isEmpty';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import { useRolesContext } from '@app/modules/Profile';
import {
  TaskFormCreate,
  TaskFormCreateSteps,
  useTaskParties,
} from '@app/modules/Task';
import {
  fetchLeases,
  getLeaseUpcoming,
  getLeasesByProperty,
  getLeasesExpired,
} from '@app/redux/lease';
import { hasError } from '@app/redux/notifier';
import { getProfile } from '@app/redux/profile';
import { createTask, fetchBpayBillers } from '@app/redux/task';
import {
  fetchBpayOutProviders,
  getBpayBillers,
  getBpayOutProviders,
  getManagerPrimaryAgency,
} from '@app/redux/users';

import { ATTACHMENT_CATEGORIES, httpClient } from '../../utils';

const PropertyTaskCreateComponent = ({
  bpayBillers,
  bpayOutProviders,
  createTask,
  expiredLeases,
  fetchBpayBillers,
  fetchBpayOutProviders,
  fetchLeases,
  hasAllowedBpayBillerAsCreditor,
  hasError,
  history,
  isBill,
  isBpayOutEnabled,
  isLoading,
  isMarketplaceEnabled,
  leases,
  newTaskId,
  attachmentIds,
  property,
  tenant,
  taskMeta,
  userAgency,
  upcomingLease,
}) => {
  const { isManager, isTenant } = useRolesContext();

  const { creditors, debtors, pastTenants, upcomingTenants } = useTaskParties({
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
    [isBpayOutEnabled, isManager, userAgency]
  );

  const canCreate = useMemo(() => {
    return property && !isEmpty(taskMeta);
  }, [property, taskMeta]);

  const handleCancel = useCallback(() => history.goBack(), [history]);

  const handleOnComplete = useCallback(() => {
    if (newTaskId) {
      if (attachmentIds?.length) {
        httpClient
          .post('/attachments/attach', {
            attachableId: newTaskId,
            attachableType: 'PropertyTask',
            attachableCategory: ATTACHMENT_CATEGORIES.taskAttachment,
            attachmentIds,
          })
          .then(() => {
            history.push(`/property/${property.id}/tasks/${newTaskId}`);
          });
      } else {
        history.push(`/property/${property.id}/tasks/${newTaskId}`);
      }
    }
  }, [attachmentIds, history, newTaskId, property.id]);

  const handleSubmit = useCallback(
    (values) => {
      createTask(values);
    },
    [createTask]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (isManager && property.id) {
      fetchLeases({ propertyId: property.id });
      fetchBpayOutProviders();
    }
  }, [property.id]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return canCreate ? (
    <div className="wrapper">
      <Container>
        {isTenant ? (
          <TaskFormCreateSteps
            taskMeta={taskMeta}
            onCancel={handleCancel}
            property={property}
            taskId={newTaskId}
          />
        ) : (
          <TaskFormCreate
            creditorList={creditors}
            debtorList={debtors}
            fetchBpayBillers={fetchBpayBillers}
            hasAllowedBpayBillerAsCreditor={hasAllowedBpayBillerAsCreditor}
            hasError={hasError}
            isBill={isBill}
            isBpayOut={isBpayOut}
            isLoading={isLoading}
            isMarketplaceEnabled={isMarketplaceEnabled}
            leases={leases}
            pastTenants={pastTenants}
            upcomingTenants={upcomingTenants}
            property={property}
            taskMeta={taskMeta}
            onCancel={handleCancel}
            onComplete={handleOnComplete}
            onSubmit={handleSubmit}
          />
        )}
      </Container>
    </div>
  ) : null;
};

PropertyTaskCreateComponent.propTypes = {
  bpayBillers: PropTypes.array,
  bpayOutProviders: PropTypes.array,
  createTask: PropTypes.func.isRequired,
  expiredLeases: PropTypes.array,
  fetchBpayOutProviders: PropTypes.func,
  fetchLeases: PropTypes.func,
  fetchBpayBillers: PropTypes.func,
  hasAllowedBpayBillerAsCreditor: PropTypes.bool,
  hasError: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  isBill: PropTypes.bool.isRequired,
  isBpayOutEnabled: PropTypes.bool,
  isMarketplaceEnabled: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  leases: PropTypes.array,
  newTaskId: PropTypes.number,
  property: PropTypes.object.isRequired,
  taskMeta: PropTypes.object,
  tenant: PropTypes.object.isRequired,
  userAgency: PropTypes.object,
  upcomingLease: PropTypes.object,
  attachmentIds: PropTypes.array,
};

const mapStateToProps = (state, props) => {
  const { property } = props;
  const profile = getProfile(state.profile);
  const newTaskId = state.task.result;

  return {
    bpayBillerList: getBpayBillers(state.users),
    bpayOutProviders: getBpayOutProviders(state.users),
    expiredLeases: getLeasesExpired(state.lease, property.id),
    hasAllowedBpayBillerAsCreditor: state.settings.allowBpayBillerAsCreditor,
    hasError: hasError(state),
    isLoading: state.task.isLoading || state.users.isLoading,
    isBpayOutEnabled: profile.isBpayOutEnabled,
    isMarketplaceEnabled: profile.isMarketplaceEnabled,
    leases: getLeasesByProperty(state.lease, property.id, true),
    userAgency: getManagerPrimaryAgency(state.users, profile.id),
    upcomingLease: getLeaseUpcoming(state.lease, property.id),
    newTaskId,
    attachmentIds: state?.task?.data?.[newTaskId]?.attachmentIds || [],
  };
};

const mapDispatchToProps = {
  createTask,
  fetchBpayBillers,
  fetchBpayOutProviders,
  fetchLeases,
};

export const PropertyTaskCreate = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyTaskCreateComponent);
