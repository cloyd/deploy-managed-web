import { createSlice } from '@reduxjs/toolkit';

import { isLoading } from '../helpers/reducer';

const initialReport = {
  report: {
    total: 0,
    totalGst: 0,
  },
  properties: [],
};

export const initialState = {
  aggregate: {
    ...initialReport,
    label: 'Total',
  },
  detail: {
    leases: [],
    managements: [],
    managers: [],
    properties: [],
    tasks: [],
  },
  efficiency: {},
  data: [],
  isLoading: false,
  management: {},
  net: {
    total: 0,
  },
  overview: {},
  rent: {
    ...initialReport,
    type: 'rent',
    label: 'Management fees',
  },
  tasks: {},
  tasksExpenses: {},
  transaction: {
    ...initialReport,
    label: 'Total transaction fees paid',
  },
};

const resetReport = (state) => {
  return {
    ...state,
    ...initialState,
  };
};

const fetchAggregateSuccess = (state, action) => {
  const { data } = action.payload;

  state.isLoading = false;

  state.aggregate = {
    ...state.aggregate,
    report: {
      ...state.aggregate.report,
      total: data.totalManagementCents + data.totalTaskCents,
      totalGst: data.totalManagementGstCents + data.totalTaskGstCents,
    },
  };

  state.transaction = {
    ...state.transaction,
    report: {
      ...state.transaction.report,
      total: data.totalAgencyFeeCents,
      totalGst: data.totalAgencyFeeGstCents,
    },
  };

  state.net = {
    total: data.totalAgencyNetCents,
  };

  state.rent = {
    ...state.rent,
    report: {
      total: data.totalManagementCents,
      totalGst: data.totalManagementGstCents,
    },
  };

  // Reset tasks on fetch
  state.tasks = {};
  (data.tasksByInvoiceCategories || []).forEach((task) => {
    const { label, type, totalCents, gstCents } = task;
    state.tasks[type] = {
      label,
      type,
      report: {
        total: totalCents,
        totalGst: gstCents,
      },
      properties: [],
    };
  });
};

const fetchAggregateExpensesSuccess = (state, action) => {
  const { data } = action.payload;

  state.isLoading = false;

  state.aggregate = {
    ...state.aggregate,
    report: {
      ...state.aggregate.report,
      totalExpenses: data.totalTaskCents,
      totalGstExpenses: data.totalTaskGstCents,
    },
  };

  state.transaction = {
    ...state.transaction,
    report: {
      ...state.transaction.report,
      totalExpenses: data.totalAgencyFeeCents,
      totalGstExpenses: data.totalAgencyFeeGstCents,
    },
  };

  state.net = {
    ...state.net,
    totalExpenses: data.totalAgencyNetCents,
  };

  // Reset tasks on fetch
  state.tasksExpenses = {};
  (data.tasksByInvoiceCategories || []).forEach((task) => {
    const { label, type, totalCents, gstCents } = task;
    state.tasksExpenses[type] = {
      label,
      type,
      report: {
        total: totalCents,
        totalGst: gstCents,
      },
      properties: [],
    };
  });
};

const fetchEfficiencySuccess = (state, action) => {
  state.isLoading = false;
  state.efficiency = {
    ...action.payload.data,
  };
};

const fetchLeasesDetailSuccess = (state, action) => {
  const { payload } = action;

  state.isLoading = false;
  state.detail.leases = payload.data ? [...payload.data] : [];
};

const fetchManagementSuccess = (state, action) => {
  state.isLoading = false;
  state.management = {
    ...state.Management,
    ...action.payload.data,
  };
};

const fetchManagementsDetailSuccess = (state, action) => {
  const { payload } = action;
  const { propertyManagements } = payload.data;

  state.isLoading = false;
  state.detail.managements = propertyManagements || [];
};

const fetchManagersDetailSuccess = (state, action) => {
  const { data } = action.payload || {};

  state.isLoading = false;

  if (Array.isArray(data)) {
    state.detail.managers = [...data];
  } else if (data.id) {
    state.detail.managers = [data];
  } else {
    state.detail.managers = [];
  }
};

const fetchOverviewSuccess = (state, action) => {
  state.isLoading = false;
  state.overview = {
    ...action.payload.data,
  };
};

const fetchPropertiesDetailSuccess = (state, action) => {
  const { payload } = action;

  state.isLoading = false;
  state.detail.properties = payload.data || [];
};

const fetchRentSuccess = (state, action) => {
  state.isLoading = false;
  const { properties } = action.payload.data;
  state.rent = {
    ...state.rent,
    properties,
    report: {
      total: properties.reduce(
        (total, property) => total + property.agencyAmountCents,
        0
      ),
      totalGst: properties.reduce(
        (total, property) => total + property.agencyAmountGstCents,
        0
      ),
    },
  };
};

const fetchTaskSuccess = (state, action) => {
  const { payload } = action;
  const { type, properties } = payload.data;
  const { feeType } = payload.props;

  state.isLoading = false;
  if (feeType === 'revenue') {
    state.tasks[type] = {
      ...state.tasks[type],
      properties,
      type,
      report: {
        total: properties.reduce(
          (total, property) => total + property.agencyAmountCents,
          0
        ),
        totalGst: properties.reduce(
          (total, property) => total + property.agencyAmountGstCents,
          0
        ),
      },
    };
  } else {
    state.tasksExpenses[type] = {
      ...state.tasksExpenses[type],
      properties,
      type,
      report: {
        total: properties.reduce(
          (total, property) => total + property.agencyAmountCents,
          0
        ),
        totalGst: properties.reduce(
          (total, property) => total + property.agencyAmountGstCents,
          0
        ),
      },
    };
  }
};

const fetchTasksDetailSuccess = (state, action) => {
  const { payload } = action;
  const { tasks } = payload.data;

  state.isLoading = false;
  state.detail.tasks = tasks || [];
};

const fetchDataSuccess = (state, action) => {
  state.isLoading = false;
  state.data = action.payload.data;
};

export default createSlice({
  name: 'report',
  initialState,
  reducers: {
    fetchAggregateSuccess,
    fetchAggregateExpensesSuccess,
    fetchEfficiencySuccess,
    fetchOverviewSuccess,
    fetchLeasesDetailSuccess,
    fetchManagementSuccess,
    fetchManagementsDetailSuccess,
    fetchManagersDetailSuccess,
    fetchRentSuccess,
    fetchPropertiesDetailSuccess,
    fetchTaskSuccess,
    fetchTasksDetailSuccess,
    fetchDataSuccess,
    resetReport,
    error: isLoading(false),
    fetchData: isLoading(true),
    exportCSVSuccess: isLoading(false),
    exportArrearsCSV: isLoading(true),
    exportLeaseCSV: isLoading(true),
    exportManagementCSV: isLoading(true),
    exportManagerCSV: isLoading(true),
    exportPropertyCSV: isLoading(true),
    exportDataPropertyCSV: isLoading(true),
    exportRentCSV: isLoading(true),
    exportRevenueCSV: isLoading(true),
    exportExpensesCSV: isLoading(true),
    exportTaskCSV: isLoading(true),
    fetchAggregate: isLoading(true),
    fetchAggregateExpenses: isLoading(true),
    fetchEfficiency: isLoading(true),
    fetchLeasesDetail: isLoading(true),
    fetchManagement: isLoading(true),
    fetchManagementsDetail: isLoading(true),
    fetchManagersDetail: isLoading(true),
    fetchOverview: isLoading(true),
    fetchPropertiesDetail: isLoading(true),
    fetchRent: isLoading(true),
    fetchTask: isLoading(true),
    fetchTasksDetail: isLoading(true),
  },
});
