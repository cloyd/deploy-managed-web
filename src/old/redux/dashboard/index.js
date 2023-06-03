import { fetchDashboardDataLogic } from './logic';
import dashboard from './reducer';

// Logic
export const dashboardLogic = [fetchDashboardDataLogic];

export const fetchDashboardData = dashboard.actions.fetchDashboardData;

// Reducer
export default dashboard.reducer;
