import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { TaskJobOverview } from '@app/containers/TaskJob';
import {
  MarketplaceFormJob,
  useJobPermissions,
} from '@app/modules/Marketplace';
import {
  fetchJob,
  fetchQuotesByJobId,
  selectJob,
} from '@app/redux/marketplace';

export const TaskJob = ({ task }) => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();

  const job = useSelector((state) => {
    return selectJob(state, task.tradieJobId);
  });

  const { canCreateJob, canViewJob } = useJobPermissions({ task, job });

  useEffect(() => {
    const isRedirect = history.location.pathname.match(/create/)
      ? !canCreateJob
      : !canViewJob;

    if (isRedirect && task?.id) {
      history.replace(`/property/${task.propertyId}/tasks/${task.id}`);
    }
  }, [canCreateJob, canViewJob, history, job, task]);

  useEffect(() => {
    if (task.tradieJobId) {
      dispatch(fetchJob(task.tradieJobId));
      dispatch(fetchQuotesByJobId(task.tradieJobId));
    }
  }, [dispatch, task.tradieJobId]);

  return (
    <Switch>
      {canCreateJob && (
        <Route
          data-testid="task-job-form"
          path={`${match.url}/create/:jobType(work-order|quote)?/:step?`}>
          <MarketplaceFormJob job={job} task={task} />
        </Route>
      )}
      {canViewJob && (
        <Route
          data-testid="task-job-overview"
          path={`${match.url}/:tab?/:quoteId?`}>
          <TaskJobOverview job={job} task={task} />
        </Route>
      )}
    </Switch>
  );
};

TaskJob.propTypes = {
  task: PropTypes.object,
};

TaskJob.defaultProps = {
  task: {},
};
