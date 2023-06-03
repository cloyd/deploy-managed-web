import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import { CardLight } from '@app/modules/Card';
import { InspectionReportDetails } from '@app/modules/Inspection';
import { JobDetails } from '@app/modules/Marketplace';
import { NavOverlay } from '@app/modules/Nav';
import { useRolesContext } from '@app/modules/Profile';
import {
  TaskActions,
  TaskBillSummary,
  TaskFormMessage,
  TaskMessage,
  TaskOverview,
  TaskStatusBar,
  useTaskFetchActivities,
} from '@app/modules/Task';
import {
  createInspectionReport,
  fetchInspectionReport,
  getInspectionReport,
} from '@app/redux/inspection';
import { fetchLease, getLease } from '@app/redux/lease';
import { fetchJob, getJob } from '@app/redux/marketplace';
import { getProfile, getRole, isDebtor } from '@app/redux/profile';
import {
  createTaskMessage,
  fetchTaskActivities,
  getTaskActivities,
  getTaskLastReplyingRole,
  getTaskMessages,
  sendTask,
  updateTask,
} from '@app/redux/task';

const PropertyTaskOverviewComponent = ({
  activities,
  createInspectionReport,
  inspectionReport,
  isDebtor,
  isLoading,
  isMarketplaceEnabled,
  fetchInspectionReport,
  fetchJob,
  fetchLease,
  fetchTaskActivities,
  job,
  lease,
  property,
  sendTask,
  task,
  taskMeta,
  createTaskMessage,
  updateTask,
  ...props
}) => {
  const { isManager, isOwner, isTenant } = useRolesContext();
  const [isMessaging, setIsMessaging] = useState(false);

  const isBillable = useMemo(() => {
    if (isManager || isOwner || isDebtor) {
      return task.isBillable;
    }

    return false;
  }, [task.isBillable, isManager, isOwner, isDebtor]);

  const replyTo = useMemo(() => {
    if (props.replyTo) {
      return props.replyTo;
    }

    return isManager ? 'all' : 'agency';
  }, [props.replyTo, isManager]);

  const handleCreateInspection = useCallback(
    (values) => {
      createInspectionReport({
        propertyId: property.id,
        propertyTaskId: task.id,
        ...values,
      });
    },
    [createInspectionReport, property.id, task.id]
  );

  const handleSend = useCallback(() => {
    sendTask({ id: task.id, propertyId: task.propertyId });
  }, [sendTask, task.id, task.propertyId]);

  const toggleCanMessage = useCallback(() => {
    setIsMessaging((state) => !state);
  }, [setIsMessaging]);

  const handleSubmitMessage = useCallback(
    (values) => {
      let replyTo = {
        all: values.replyTo === 'all' && isManager,
      };

      replyTo = {
        ...replyTo,
        owners:
          isOwner || replyTo.all || (values.replyTo === 'owners' && isManager),
        tenants:
          isTenant ||
          replyTo.all ||
          (values.replyTo === 'tenants' && isManager),
      };

      createTaskMessage({
        ...values,
        propertyId: task.propertyId,
        taskId: task.id,
        toAgency: true,
        toOwner: replyTo.owners,
        toTenant: replyTo.tenants,
      });

      toggleCanMessage();
    },
    [
      createTaskMessage,
      isManager,
      isOwner,
      isTenant,
      task.id,
      task.propertyId,
      toggleCanMessage,
    ]
  );

  const handleUpdateTask = useCallback(
    (status) => {
      updateTask({
        status,
        propertyId: task.propertyId,
        taskId: task.id,
      });
    },
    [task, updateTask]
  );

  useTaskFetchActivities({
    fetchTaskActivities,
    propertyId: task.propertyId,
    taskId: task.id,
  });

  useEffect(() => {
    if (
      task.inspectionReportId &&
      task.inspectionReportId !== inspectionReport.id
    ) {
      fetchInspectionReport({ reportId: task.inspectionReportId });
    }
  }, [fetchInspectionReport, task.inspectionReportId, inspectionReport.id]);

  useEffect(() => {
    if (task.leaseId && task.leaseId !== lease.id) {
      fetchLease({ leaseId: task.leaseId });
    }
  }, [fetchLease, task.leaseId, lease.id]);

  useEffect(() => {
    if (task.tradieJobId && task.tradieJobId !== job.id) {
      fetchJob(task.tradieJobId);
    }
  }, [fetchJob, task.tradieJobId, job.id]);

  return task.id ? (
    <Container className="wrapper">
      <Row>
        <Col className="mb-4">
          <TaskStatusBar
            task={task}
            taskMeta={taskMeta}
            onClick={handleUpdateTask}
          />
          <TaskOverview task={task} />
        </Col>
      </Row>
      <Row>
        {task.inspectionReportId && (
          <Col md={6} className="mb-4">
            <CardLight title="Condition report">
              <InspectionReportDetails
                pathname={`/property/${task.propertyId}/condition`}
                report={inspectionReport}
              />
            </CardLight>
          </Col>
        )}
        {task.tradieJobId && !isTenant && (
          <Col md={6} className="mb-4">
            <CardLight title="Job request">
              <JobDetails isCompactView={true} job={job} />
            </CardLight>
          </Col>
        )}
        {isBillable && (
          <Col md={6} className="mb-4">
            <CardLight title="Invoice">
              <TaskBillSummary task={task} />
            </CardLight>
          </Col>
        )}
      </Row>
      {activities.map((activity) => (
        <TaskMessage
          key={`activity-${activity.id}`}
          activity={activity}
          creatorType={task.creatorType}
          isManager={isManager}
          isMarketplaceEnabled={isMarketplaceEnabled}
        />
      ))}
      {isMessaging ? (
        <div className="card bg-white p-3 mt-3">
          <TaskFormMessage
            hasError={false}
            isLoading={isLoading}
            isManager={isManager}
            isOverlayed={false}
            onCancel={toggleCanMessage}
            onSubmit={handleSubmitMessage}
            replyTo={replyTo}
          />
        </div>
      ) : (
        <NavOverlay>
          <Row>
            <Col md={{ size: 8, offset: 2 }} lg={{ size: 6, offset: 3 }}>
              <TaskActions
                isDebtor={isDebtor}
                isMarketplaceEnabled={isMarketplaceEnabled}
                lease={lease}
                property={property}
                task={task}
                onCreateInspection={handleCreateInspection}
                onSend={handleSend}
                onReply={toggleCanMessage}
                onUpdateTask={handleUpdateTask}
              />
            </Col>
          </Row>
        </NavOverlay>
      )}
    </Container>
  ) : null;
};

PropertyTaskOverviewComponent.propTypes = {
  activities: PropTypes.array,
  createInspectionReport: PropTypes.func,
  fetchInspectionReport: PropTypes.func,
  fetchLease: PropTypes.func,
  fetchJob: PropTypes.func,
  fetchTaskActivities: PropTypes.func,
  inspectionReport: PropTypes.object,
  isDebtor: PropTypes.bool,
  isLoading: PropTypes.bool,
  isMarketplaceEnabled: PropTypes.bool,
  job: PropTypes.object,
  lease: PropTypes.object,
  messages: PropTypes.array,
  property: PropTypes.object,
  sendTask: PropTypes.func,
  task: PropTypes.object,
  taskMeta: PropTypes.object,
  createTaskMessage: PropTypes.func.isRequired,
  replyTo: PropTypes.string.isRequired,
  updateTask: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { task }) => {
  const profile = getProfile(state.profile);
  const activities = getTaskActivities(state.task, task);

  return {
    activities,
    inspectionReport: getInspectionReport(
      state.inspection,
      task?.inspectionReportId
    ),
    isLoading: !!state.task.isLoading,
    isDebtor: isDebtor(state.profile, task),
    isMarketplaceEnabled: profile.isMarketplaceEnabled,
    job: getJob(state.marketplace, task?.tradieJobId),
    lease: getLease(state.lease, task.leaseId),
    messages: getTaskMessages(state.task, task),
    replyTo: getTaskLastReplyingRole(activities, getRole(state.profile)),
  };
};

const mapDispatchToProps = {
  createInspectionReport,
  fetchInspectionReport,
  fetchJob,
  fetchLease,
  fetchTaskActivities,
  sendTask,
  createTaskMessage,
  updateTask,
};

export const PropertyTaskOverview = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyTaskOverviewComponent);
