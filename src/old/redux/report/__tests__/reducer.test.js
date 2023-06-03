import { mockReduxLogic } from '../../__mocks__';
import report, { initialState } from '../reducer';

const {
  error,
  fetchAggregate,
  fetchAggregateExpenses,
  fetchAggregateSuccess,
  fetchAggregateExpensesSuccess,
  fetchEfficiency,
  fetchEfficiencySuccess,
  fetchManagementsDetailSuccess,
  fetchManagersDetailSuccess,
  fetchOverview,
  fetchOverviewSuccess,
  fetchRent,
  fetchRentSuccess,
  fetchTask,
  fetchTaskSuccess,
  fetchTasksDetail,
  fetchTasksDetailSuccess,
} = report.actions;

describe('report/reducer', () => {
  const isLoadingState = {
    ...initialState,
    isLoading: true,
  };
  let store;

  beforeEach(() => {
    store = mockReduxLogic({
      initialState: isLoadingState,
      logic: [],
      reducer: report.reducer,
    });
  });

  it('should define the initialState', () => {
    const received = store.getState();
    const expected = isLoadingState;
    expect(received).toEqual(expected);
  });

  it('should handle error', () => {
    store.dispatch(error());
    const received = store.getState().isLoading;
    const expected = false;
    expect(received).toEqual(expected);
  });

  it('should handle fetchAggregate', () => {
    store.dispatch(fetchAggregate());
    const received = store.getState().isLoading;
    const expected = true;
    expect(received).toEqual(expected);
  });

  it('should handle fetchAggregateExpenses', () => {
    store.dispatch(fetchAggregateExpenses());
    const received = store.getState().isLoading;
    const expected = true;
    expect(received).toEqual(expected);
  });

  it('should handle fetchEfficiency', () => {
    store.dispatch(fetchEfficiency());
    const received = store.getState().isLoading;
    const expected = true;
    expect(received).toEqual(expected);
  });

  it('should handle fetchOverview', () => {
    store.dispatch(fetchOverview());
    const received = store.getState().isLoading;
    const expected = true;
    expect(received).toEqual(expected);
  });

  it('should handle fetchRent', () => {
    store.dispatch(fetchRent());
    const received = store.getState().isLoading;
    const expected = true;
    expect(received).toEqual(expected);
  });

  it('should handle fetchTask', () => {
    store.dispatch(fetchTask());
    const received = store.getState().isLoading;
    const expected = true;
    expect(received).toEqual(expected);
  });

  it('should handle fetchTasksDetail', () => {
    store.dispatch(fetchTasksDetail());
    const received = store.getState().isLoading;
    const expected = true;
    expect(received).toEqual(expected);
  });

  describe('fetchAggregateSuccess', () => {
    const task = {
      label: 'label',
      type: 'type',
      totalCents: 6,
      gstCents: 7,
    };

    const data = {
      totalAgencyFeeCents: 1,
      totalAgencyFeeGstCents: 2,
      totalAgencyNetCents: 3,
      totalManagementCents: 4,
      totalManagementGstCents: 5,
      tasksByInvoiceCategories: [task],
    };

    beforeEach(() => {
      store.dispatch(fetchAggregateSuccess({ data }));
    });

    it('should set isLoading to false', () => {
      const received = store.getState().isLoading;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should set aggregate', () => {
      const received = store.getState().aggregate;
      const expected = {
        ...isLoadingState.aggregate,
        report: {
          total: data.totalManagementCents + data.totalTaskCents,
          totalGst: data.totalManagementGstCents + data.totalTaskGstCents,
        },
      };

      expect(received).toEqual(expected);
    });

    it('should set transaction', () => {
      const received = store.getState().transaction;
      const expected = {
        ...isLoadingState.transaction,
        report: {
          total: data.totalAgencyFeeCents,
          totalGst: data.totalAgencyFeeGstCents,
        },
      };

      expect(received).toEqual(expected);
    });

    it('should set net', () => {
      const received = store.getState().net;
      const expected = {
        ...isLoadingState.net,
        total: data.totalAgencyNetCents,
      };

      expect(received).toEqual(expected);
    });

    it('should set rent', () => {
      const received = store.getState().rent;
      const expected = {
        ...isLoadingState.rent,
        report: {
          total: data.totalManagementCents,
          totalGst: data.totalManagementGstCents,
        },
      };

      expect(received).toEqual(expected);
    });

    it('should set tasks', () => {
      const received = store.getState().tasks;
      const expected = {
        label: 'label',
        type: 'type',
        report: {
          total: task.totalCents,
          totalGst: task.gstCents,
        },
        properties: [],
      };

      expect(received[task.type]).toEqual(expected);
    });
  });

  describe('fetchAggregateExpensesSuccess', () => {
    const task = {
      label: 'label',
      type: 'type',
      totalCents: 6,
      gstCents: 7,
    };

    const data = {
      totalAgencyFeeCents: 1,
      totalAgencyFeeGstCents: 2,
      totalAgencyNetCents: 3,
      totalTaskCents: 4,
      totalTaskGstCents: 5,
      tasksByInvoiceCategories: [task],
    };

    beforeEach(() => {
      store.dispatch(fetchAggregateExpensesSuccess({ data }));
    });

    it('should set isLoading to false', () => {
      const received = store.getState().isLoading;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should set aggregate', () => {
      const received = store.getState().aggregate;
      const expected = {
        ...isLoadingState.aggregate,
        report: {
          total: 0,
          totalExpenses: data.totalTaskCents,
          totalGst: 0,
          totalGstExpenses: data.totalTaskGstCents,
        },
      };

      expect(received).toEqual(expected);
    });

    it('should set transaction', () => {
      const received = store.getState().transaction;
      const expected = {
        ...isLoadingState.transaction,
        report: {
          total: 0,
          totalExpenses: data.totalAgencyFeeCents,
          totalGst: 0,
          totalGstExpenses: data.totalAgencyFeeGstCents,
        },
      };

      expect(received).toEqual(expected);
    });

    it('should set net', () => {
      const received = store.getState().net;
      const expected = {
        ...isLoadingState.net,
        total: 0,
        totalExpenses: data.totalAgencyNetCents,
      };

      expect(received).toEqual(expected);
    });

    it('should set tasksExpenses', () => {
      const received = store.getState().tasksExpenses;
      const expected = {
        label: 'label',
        type: 'type',
        report: {
          total: task.totalCents,
          totalGst: task.gstCents,
        },
        properties: [],
      };

      expect(received[task.type]).toEqual(expected);
    });
  });

  describe('fetchEfficiencySuccess', () => {
    const data = {
      rent_roll_valuation: 1080,
      average_weekly_rent_cents: 24638,
      average_managment_fee: '4.385294117647058824',
      average_properties_per_manager: 52,
      total_properties_count: 52,
      active_properties: 17,
      expired_properties: 23,
      vacant_properties: 12,
      properties_in_arrears: 24,
      vacancy_rate: 23.076923076923077,
      landlord_concentration_1_property: 47,
      landlord_concentration_2_properties: 4,
      landlord_concentration_3_properties: 0,
      landlord_concentration_4_properties_plus: 1,
    };

    beforeEach(() => {
      store.dispatch(fetchEfficiencySuccess({ data }));
    });

    it('should set isLoading to false', () => {
      const received = store.getState().isLoading;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should set efficiency report', () => {
      const received = store.getState();
      const expected = {
        ...data,
      };

      expect(received.efficiency).toEqual(expected);
    });
  });

  describe('fetchManagementsDetailSuccess', () => {
    const data = { propertyManagements: [{ id: 123 }, { id: 456 }] };

    it('should set isLoading to false', () => {
      store.dispatch(fetchManagementsDetailSuccess({ data }));

      const received = store.getState().isLoading;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should set detail.managements with payload data', () => {
      store.dispatch(fetchManagementsDetailSuccess({ data }));

      const received = store.getState().detail.managements;
      const expected = [...data.propertyManagements];
      expect(received).toEqual(expected);
    });
  });

  describe('fetchManagersDetailSuccess', () => {
    it('should set isLoading to false', () => {
      const data = { id: 123 };
      store.dispatch(fetchManagersDetailSuccess({ data }));

      const received = store.getState().isLoading;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should set detail.managers when data is an object', () => {
      const data = {
        id: 123,
        foo: 'bar',
      };
      store.dispatch(fetchManagersDetailSuccess({ data }));

      const received = store.getState().detail.managers;
      const expected = [data];
      expect(received).toEqual(expected);
    });

    it('should set detail.managers when data is an array', () => {
      const data = [
        {
          id: 123,
          foo: 'bar',
        },
        {
          id: 456,
          hello: 'world',
        },
      ];
      store.dispatch(fetchManagersDetailSuccess({ data }));

      const received = store.getState().detail.managers;
      const expected = [...data];
      expect(received).toEqual(expected);
    });
  });

  describe('fetchOverviewSuccess', () => {
    const data = {
      rent_roll_valuation: 1080,
      average_weekly_rent_cents: 24638,
      average_managment_fee: '4.385294117647058824',
      average_properties_per_manager: 52,
      total_properties_count: 52,
      active_properties: 17,
      expired_properties: 23,
      vacant_properties: 12,
      properties_in_arrears: 24,
      vacancy_rate: 23.076923076923077,
      landlord_concentration_1_property: 47,
      landlord_concentration_2_properties: 4,
      landlord_concentration_3_properties: 0,
      landlord_concentration_4_properties_plus: 1,
    };

    beforeEach(() => {
      store.dispatch(fetchOverviewSuccess({ data }));
    });

    it('should set isLoading to false', () => {
      const received = store.getState().isLoading;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should set overview report', () => {
      const received = store.getState();
      const expected = {
        ...data,
      };

      expect(received.overview).toEqual(expected);
    });
  });

  describe('fetchRentSuccess', () => {
    const data = {
      type: 'rent',
      properties: [{ agencyAmountCents: 100, agencyAmountGstCents: 9 }],
    };

    beforeEach(() => {
      store.dispatch(fetchRentSuccess({ data }));
    });

    it('should set isLoading to false', () => {
      const received = store.getState().isLoading;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should set rent', () => {
      const received = store.getState().rent;
      const expected = {
        ...isLoadingState.rent,
        properties: data.properties,
        report: {
          total: 100,
          totalGst: 9,
        },
      };
      expect(received).toEqual(expected);
    });
  });

  describe('fetchTaskSuccess', () => {
    const data = {
      type: 'type',
      properties: [{ agencyAmountCents: 1000, agencyAmountGstCents: 500 }],
    };

    beforeEach(() => {
      store.dispatch(
        fetchTaskSuccess({
          data,
          props: {
            feeType: 'revenue',
          },
        })
      );
    });

    it('should set isLoading to false', () => {
      const received = store.getState().isLoading;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should set task', () => {
      const received = store.getState().tasks;
      const expected = {
        properties: data.properties,
        report: {
          total: 1000,
          totalGst: 500,
        },
        type: 'type',
      };
      expect(received['type']).toEqual(expected);
    });
  });

  describe('fetchTasksDetailSuccess', () => {
    const data = {
      tasks: [1, 2, 5],
    };

    beforeEach(() => {
      store.dispatch(fetchTasksDetailSuccess({ data }));
    });

    it('should set isLoading to false', () => {
      const received = store.getState().isLoading;
      const expected = false;
      expect(received).toEqual(expected);
    });

    it('should set detail.tasks', () => {
      const received = store.getState().detail.tasks;
      const expected = data.tasks;
      expect(received).toEqual(expected);
    });
  });
});
