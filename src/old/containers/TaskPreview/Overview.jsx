import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';

import { useOnce } from '@app/hooks';
import { ButtonEdit } from '@app/modules/Button';
import { CardLight } from '@app/modules/Card';
import {
  IconInspectionReport,
  InspectionReportDetails,
} from '@app/modules/Inspection';
import { Link } from '@app/modules/Link';
import { IconJob, JobDetails } from '@app/modules/Marketplace';
import { TaskBillSummary, TaskStatusBar } from '@app/modules/Task';
import {
  fetchInspectionReport,
  getInspectionReport,
} from '@app/redux/inspection';
import { fetchJob, getJob } from '@app/redux/marketplace';
import { fetchTaskMeta, getTaskMeta, updateTask } from '@app/redux/task';

const TaskPreviewOverviewComponent = (props) => {
  const { task, taskMeta, updateTask } = props;
  const arrears = task.arrears || {};

  const handleChangeStatus = useCallback(
    (status) =>
      updateTask({
        status,
        propertyId: task.propertyId,
        taskId: task.id,
      }),
    [task.id, task.propertyId, updateTask]
  );

  useOnce(() => {
    if (Object.keys(taskMeta).length === 0) {
      props.fetchTaskMeta({
        propertyId: task.propertyId,
      });
    }
  });

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (task.inspectionReportId) {
      props.fetchInspectionReport({ reportId: task.inspectionReportId });
    }
  }, [task.inspectionReportId]);

  useEffect(() => {
    if (task.tradieJobId) {
      props.fetchJob(task.tradieJobId);
    }
  }, [task.tradieJobId]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div className="mt-2">
      <TaskStatusBar
        task={task}
        taskMeta={taskMeta}
        onClick={handleChangeStatus}
      />
      <div className="d-flex justify-content-between align-items-center">
        <Link
          to={`/property/${task.propertyId}/tasks/${task.id}`}
          className="text-left mt-1">
          <h4>
            <IconInspectionReport
              className="mr-1"
              inspectionReportId={task.inspectionReportId}
              size="xs"
            />
            <IconJob
              className="mr-1"
              hasWorkOrder={task.hasWorkOrder}
              size="xs"
              tradieJobId={task.tradieJobId}
            />{' '}
            {task.title.length > 40
              ? task.title.slice(0, 37) + '...'
              : task.title}
          </h4>
        </Link>
        <Link to={`/property/${task.propertyId}/tasks/${task.id}/edit`}>
          <ButtonEdit>Edit</ButtonEdit>
        </Link>
      </div>
      <p className="my-0">
        {task.propertyAddress && (
          <Link
            to={`/property/${task.propertyId}`}
            className="text-dark text-left">
            <small>
              {task.propertyAddress.street}, {task.propertyAddress.suburb}
            </small>
          </Link>
        )}
      </p>
      <p className="small mb-0">
        {task.taskType.custom ? `${startCase(task.type)} - ` : ''}
        {task.isArrear ? 'Arrears' : startCase(task.taskType.key)}
        {task?.taskCategory?.key
          ? ` - ${startCase(task?.taskCategory?.key)}`
          : ''}
      </p>
      {arrears.rentOverdueDays > 0 && (
        <p className="small mb-0">
          Payment is overdue by: {arrears.rentOverdueDays} days
        </p>
      )}
      <p className="mt-3">{task.description}</p>
      {task.inspectionReportId && (
        <CardLight className="mt-4" title="Condition report">
          <InspectionReportDetails
            pathname={`/property/${task.propertyId}/condition`}
            report={props.inspectionReport}
          />
        </CardLight>
      )}
      {task.tradieJobId && (
        <CardLight className="mt-4" title="Job request">
          <JobDetails
            isCompactView={true}
            link={`/property/${task.propertyId}/tasks/${task.id}/job`}
            job={props.job}
          />
        </CardLight>
      )}
      {task.isBillable && (
        <CardLight className="mt-4" title="Invoice">
          <TaskBillSummary task={task} />
        </CardLight>
      )}
    </div>
  );
};

TaskPreviewOverviewComponent.propTypes = {
  fetchInspectionReport: PropTypes.func,
  fetchJob: PropTypes.func,
  fetchTaskMeta: PropTypes.func.isRequired,
  inspectionReport: PropTypes.object,
  isLoading: PropTypes.bool,
  job: PropTypes.object,
  task: PropTypes.object,
  taskId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  taskMeta: PropTypes.object,
  updateTask: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  inspectionReport: getInspectionReport(
    state.inspection,
    props.task?.inspectionReportId
  ),
  job: getJob(state.marketplace, props.task?.tradieJobId),
  isLoading: state.task.isLoading,
  taskMeta: getTaskMeta(state.task),
});

const mapDispatchToProps = {
  fetchInspectionReport,
  fetchJob,
  fetchTaskMeta,
  updateTask,
};

export const TaskPreviewOverview = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskPreviewOverviewComponent);
