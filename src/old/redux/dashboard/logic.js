import flow from 'lodash/fp/flow';
import { createLogic } from 'redux-logic';

import { getData, processGet } from '../helpers/logic';
import dashboard from './reducer';

const { error, fetchDashboardData, fetchDashboardDataSuccess } =
  dashboard.actions;

// Fetch logic actions
export const fetchDashboardDataLogic = createLogic({
  type: fetchDashboardData,
  processOptions: {
    successType: fetchDashboardDataSuccess,
    failType: error,
  },
  transform: ({ action }, next) =>
    next({
      ...action,
      payload: {
        endpoint: 'reports/manager_dashboard',
      },
    }),
  process: flow(processGet, getData),
});
