import flow from 'lodash/fp/flow';
import { createLogic } from 'redux-logic';

import {
  getData,
  getDataWithProps,
  processGet,
  processGetWithProps,
  processSuccess,
  setMessage,
} from '../helpers/logic';
import report from './reducer';

const {
  error,
  exportArrearsCSV,
  exportLeaseCSV,
  exportManagementCSV,
  exportManagerCSV,
  exportPropertyCSV,
  exportDataPropertyCSV,
  exportRentCSV,
  exportRevenueCSV,
  exportExpensesCSV,
  exportTaskCSV,
  exportCSVSuccess,
  fetchAggregate,
  fetchAggregateExpenses,
  fetchEfficiency,
  fetchLeasesDetail,
  fetchManagement,
  fetchManagementsDetail,
  fetchManagersDetail,
  fetchOverview,
  fetchPropertiesDetail,
  fetchRent,
  fetchTask,
  fetchData,
  fetchTasksDetail,
  fetchAggregateSuccess,
  fetchAggregateExpensesSuccess,
  fetchEfficiencySuccess,
  fetchLeasesDetailSuccess,
  fetchManagementSuccess,
  fetchManagementsDetailSuccess,
  fetchManagersDetailSuccess,
  fetchOverviewSuccess,
  fetchPropertiesDetailSuccess,
  fetchRentSuccess,
  fetchTaskSuccess,
  fetchTasksDetailSuccess,
  fetchDataSuccess,
} = report.actions;

const process = flow(processGet, getData);

const processExport = flow(
  processGet,
  getData,
  setMessage('CSV exported, please check your inbox')
);

// Ransack query objects
const ransackRevenueReport = (type, params = {}, reportType) => {
  const { startsAt, endsAt, page, resourceId, resourceType } = params;
  const result = {};

  if (type === 'rent') {
    result['q[type_of_in]'] = ['rent', 'deposit'];
  } else if (type === 'task') {
    result['q[invoices_category_eq]'] = reportType;

    switch (reportType) {
      case 'revenue_share_charge':
        result['q[type_of_in]'] = ['revenue_share_charge'];
        break;
      case 'platform_costs':
        result['q[type_of_in]'] = ['platform_cost'];
        break;
      default:
        result['q[type_of_in]'] = ['task'];
    }
  }

  return {
    ...result,
    page,
    paidAtGteq: startsAt,
    paidAtLteq: endsAt,
    resourceId,
    resourceType,
    reportType,
  };
};

const ransackPropertyManagementReport = ({
  category,
  type,
  resourceId,
  resourceType,
  startsAt,
  endsAt,
  page,
}) => {
  const reasonTypeParam = category
    ? `q[${category}_reason_type_eq]`
    : undefined;

  return {
    page,
    resourceId,
    resourceType,
    'q[type_of_eq]': category,
    ...(category && { [reasonTypeParam]: type }),
    ...(startsAt && { fromDate: startsAt }),
    ...(endsAt && { toDate: endsAt }),
  };
};

const ransackReport = ({
  page,
  resourceId,
  resourceType,
  scope,
  startsAt,
  endsAt,
  ...otherParams
}) => {
  const scopeParam = scope ? `q[${scope}]` : undefined;

  return {
    page,
    resourceId,
    resourceType,
    ...otherParams,
    ...(scopeParam && { [scopeParam]: true }),
    ...(startsAt && { fromDate: startsAt }),
    ...(endsAt && { toDate: endsAt }),
  };
};

// Transform action
const transformRevenueReport =
  (endpoint, type) =>
  ({ action }, next) => {
    const { reportType, params } = action.payload;
    next({
      ...action,
      payload: {
        endpoint: `reports/${
          reportType && reportType === 'revenue_share_charge'
            ? 'revenue_share_charge_intentions'
            : endpoint
        }`,
        params: ransackRevenueReport(type, params, reportType),
      },
    });
  };

const transformRevenueReportWithFeeType =
  (incomeEndpoint, expenseEndpoint, type) =>
  ({ action }, next) => {
    const { reportType, feeType, params } = action.payload;
    next({
      ...action,
      payload: {
        endpoint: `reports/${
          feeType === 'revenue' ? incomeEndpoint : expenseEndpoint
        }`,
        params: ransackRevenueReport(type, params, reportType),
        props: {
          feeType,
        },
      },
    });
  };

const transformPropertyManagementReport =
  (endpoint) =>
  ({ action }, next) =>
    next({
      ...action,
      payload: {
        endpoint: `reports/${endpoint}`,
        params: ransackPropertyManagementReport(action.payload),
      },
    });

const transformReport =
  (endpoint) =>
  ({ action }, next) =>
    next({
      ...action,
      payload: {
        endpoint: `reports/${endpoint}`,
        params: ransackReport(action.payload),
      },
    });

//
// Fetch logic actions
export const fetchAggregateLogic = createLogic({
  type: fetchAggregate,
  processOptions: {
    successType: fetchAggregateSuccess,
    failType: error,
  },
  transform: transformRevenueReport('aggregate_income'),
  process,
});

export const fetchAggregateExpensesLogic = createLogic({
  type: fetchAggregateExpenses,
  processOptions: {
    successType: fetchAggregateExpensesSuccess,
    failType: error,
  },
  transform: transformRevenueReport('aggregate_expense'),
  process,
});

export const fetchEfficiencyLogic = createLogic({
  type: fetchEfficiency,
  processOptions: {
    successType: fetchEfficiencySuccess,
    failType: error,
  },
  transform: transformReport('efficiency'),
  process,
});

export const fetchLeasesDetailLogic = createLogic({
  type: fetchLeasesDetail,
  processOptions: {
    successType: fetchLeasesDetailSuccess,
    failType: error,
  },
  transform: transformReport('leases'),
  process,
});

export const fetchManagementLogic = createLogic({
  type: fetchManagement,
  processOptions: {
    successType: fetchManagementSuccess,
    failType: error,
  },
  transform: transformPropertyManagementReport('management'),
  process,
});

export const fetchManagementsDetailLogic = createLogic({
  type: fetchManagementsDetail,
  processOptions: {
    successType: fetchManagementsDetailSuccess,
    failType: error,
  },
  transform: transformPropertyManagementReport('property_managements'),
  process,
});

export const fetchManagersDetailLogic = createLogic({
  type: fetchManagersDetail,
  processOptions: {
    successType: fetchManagersDetailSuccess,
    failType: error,
  },
  transform: transformReport('managers'),
  process,
});

export const fetchOverviewLogic = createLogic({
  type: fetchOverview,
  processOptions: {
    successType: fetchOverviewSuccess,
    failType: error,
  },
  transform: transformReport('overview'),
  process,
});

export const fetchPropertiesDetailLogic = createLogic({
  type: fetchPropertiesDetail,
  processOptions: {
    successType: fetchPropertiesDetailSuccess,
    failType: error,
  },
  transform: transformReport('properties'),
  process,
});

export const fetchRentLogic = createLogic({
  type: fetchRent,
  processOptions: {
    successType: fetchRentSuccess,
    failType: error,
  },
  transform: transformRevenueReport('income', 'rent'),
  process,
});

export const fetchTaskLogic = createLogic({
  type: fetchTask,
  processOptions: {
    successType: fetchTaskSuccess,
    failType: error,
  },
  transform: transformRevenueReportWithFeeType('income', 'expense', 'task'),
  process: flow(processGetWithProps, getDataWithProps),
});

export const fetchTasksDetailLogic = createLogic({
  type: fetchTasksDetail,
  processOptions: {
    successType: fetchTasksDetailSuccess,
    failType: error,
  },
  transform: transformReport('property_tasks'),
  process,
});

//
// CSV export logic actions
export const exportArrearsCSVLogic = createLogic({
  type: exportArrearsCSV,
  processOptions: {
    successType: exportCSVSuccess,
    failType: error,
  },
  transform: transformReport('export-arrears-csv'),
  process: processExport,
});

export const exportLeaseCSVLogic = createLogic({
  type: exportLeaseCSV,
  processOptions: {
    successType: exportCSVSuccess,
    failType: error,
  },
  transform: transformReport('export-lease-csv'),
  process: processExport,
});

export const exportManagementCSVLogic = createLogic({
  type: exportManagementCSV,
  processOptions: {
    successType: exportCSVSuccess,
    failType: error,
  },
  transform: transformPropertyManagementReport('export-management-csv'),
  process: processExport,
});

export const exportManagerCSVLogic = createLogic({
  type: exportManagerCSV,
  processOptions: {
    successType: exportCSVSuccess,
    failType: error,
  },
  transform: transformPropertyManagementReport('export-manager-csv'),
  process: processExport,
});

export const exportPropertyCSVLogic = createLogic({
  type: exportPropertyCSV,
  processOptions: {
    successType: exportCSVSuccess,
    failType: error,
  },
  transform: transformReport('export-property-csv'),
  process: processExport,
});

export const fetchDataLogic = createLogic({
  type: fetchData,
  processOptions: {
    successType: fetchDataSuccess,
    failType: error,
  },
  transform({ action }, next) {
    const {
      page,
      view,
      address,
      agencyId,
      managerId,
      noPagination,
      propertyId,
      sort,
      withArchived,
      propertyType,
      leaseStatus,
      tenantStatus,
      ownerStatus,
      isOnboarded,
      filterType,
    } = action.payload;
    const params = { page, view, noPagination };

    if (filterType) {
      params['filterType'] = filterType;
    }

    if (address) {
      params['q[addressStreetOrAddressSuburbMatches]'] = `%${address}%`;
    }

    if (agencyId) {
      params['q[agencyIdIn]'] = agencyId;
    }

    if (managerId) {
      params['q[managerIdEq]'] = managerId;
    }

    if (propertyId) {
      params['q[idEq]'] = propertyId;
    }

    if (sort) {
      params['q[sorts]'] = sort;
    }

    if (propertyType && propertyType !== 'all') {
      params['q[propertyTypeEq]'] = propertyType;
    }

    if (leaseStatus) {
      params['q[statusesIn]'] = leaseStatus;
    }

    if (ownerStatus) {
      params['q[ownerStatus]'] = ownerStatus;
    }

    if (tenantStatus) {
      params['q[tenantStatus]'] = tenantStatus;
    }

    if (isOnboarded) {
      params['q[onboardedStatus]'] = isOnboarded;
    }

    if (withArchived) {
      params['withArchived'] = withArchived;
    }

    next({
      ...action,
      payload: {
        endpoint: `reports/search_data`,
        params,
      },
    });
  },

  process,
});

export const exportDataPropertyCSVLogic = createLogic({
  debounce: 500,
  latest: true,
  type: exportDataPropertyCSV,
  processOptions: {
    successType: exportCSVSuccess,
    failType: error,
  },
  transform({ action }, next) {
    const {
      page,
      view,
      address,
      agencyId,
      managerId,
      noPagination,
      propertyId,
      sort,
      withArchived,
      propertyType,
      leaseStatus,
      tenantStatus,
      ownerStatus,
      isOnboarded,
      filterType,
    } = action.payload;
    const params = { page, view, noPagination };

    if (filterType) {
      params['filterType'] = filterType;
    }

    if (address) {
      params['q[addressStreetOrAddressSuburbMatches]'] = `%${address}%`;
    }

    if (agencyId) {
      params['q[agencyIdIn]'] = agencyId;
    }

    if (managerId) {
      params['q[managerIdEq]'] = managerId;
    }

    if (propertyId) {
      params['q[idEq]'] = propertyId;
    }

    if (sort) {
      params['q[sorts]'] = sort;
    }

    if (propertyType && propertyType !== 'all') {
      params['q[propertyTypeEq]'] = propertyType;
    }

    if (leaseStatus) {
      params['q[statusesIn]'] = leaseStatus;
    }

    if (ownerStatus) {
      params['q[ownerStatus]'] = ownerStatus;
    }

    if (tenantStatus) {
      params['q[tenantStatus]'] = tenantStatus;
    }

    if (isOnboarded) {
      params['q[onboardedStatus]'] = isOnboarded;
    }

    if (withArchived) {
      params['withArchived'] = withArchived;
    }

    next({
      ...action,
      payload: {
        endpoint: `reports/export-data-property-csv`,
        params,
      },
    });
  },
  process: processExport,
});

export const exportRentCSVLogic = createLogic({
  type: exportRentCSV,
  processOptions: {
    successType: exportCSVSuccess,
    failType: error,
  },
  transform: transformRevenueReport('export-revenue-csv', 'rent'),
  process: processExport,
});

export const exportRevenueCSVLogic = createLogic({
  type: exportRevenueCSV,
  processOptions: {
    successType: exportCSVSuccess,
    failType: error,
  },
  transform: transformRevenueReport('export-revenue-csv', 'export'),
  process: processExport,
});

export const exportExpensesCSVLogic = createLogic({
  type: exportExpensesCSV,
  processOptions: {
    successType: exportCSVSuccess,
    failType: error,
  },
  transform: transformRevenueReport('export-expense-csv', 'export'),
  process: processExport,
});

export const exportTaskCSVLogic = createLogic({
  type: exportTaskCSV,
  processOptions: {
    successType: exportCSVSuccess,
    failType: error,
  },
  transform: transformRevenueReportWithFeeType(
    'export-revenue-csv',
    'export-expense-csv',
    'task'
  ),
  process: processExport,
});

export const exportCSVSuccessLogic = createLogic({
  warnTimeout: 0,
  type: exportCSVSuccess,
  process: processSuccess,
});
