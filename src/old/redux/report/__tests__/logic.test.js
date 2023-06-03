import reducer, { reportLogic as logic } from '..';
import { mockHttpClient, mockReduxLogic } from '../../__mocks__';
import report, { initialState } from '../reducer';

const {
  error,
  fetchAggregate,
  fetchAggregateSuccess,
  fetchLeasesDetail,
  fetchLeasesDetailSuccess,
  fetchManagement,
  fetchManagementSuccess,
  fetchManagementsDetail,
  fetchManagementsDetailSuccess,
  fetchRent,
  fetchRentSuccess,
  fetchTask,
  fetchTaskSuccess,
  fetchTasksDetail,
  fetchTasksDetailSuccess,
  exportRevenueCSV,
  exportExpensesCSV,
  exportCSVSuccess,
} = report.actions;

describe('report/logic', () => {
  let params;
  let request;
  let store;

  const requestError = () =>
    error(new Error('Request failed with status code 500'));

  beforeEach(() => {
    store = mockReduxLogic({ initialState, logic, reducer });
  });

  describe('fetchAggregateLogic', () => {
    beforeEach(() => {
      params = { startsAt: 'startsAt', endsAt: 'endsAt' };
      request = mockHttpClient.onGet('reports/aggregate_income', {
        params: {
          page: undefined,
          paidAtGteq: params.startsAt,
          paidAtLteq: params.endsAt,
          resourceId: undefined,
          resourceType: undefined,
          reportType: undefined,
        },
      });
    });

    it('should handle success', (done) => {
      store.dispatch(fetchAggregate({ params }));
      request.reply(200, 'response');

      store.whenComplete(() => {
        const received = store.actions;
        const expected = fetchAggregateSuccess({ data: 'response' });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(fetchAggregate({ params }));
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('fetchLeasesDetailLogic', () => {
    beforeEach(() => {
      params = {
        scope: 'arrears',
        startsAt: 'startsAt',
        endsAt: 'endsAt',
      };
      request = mockHttpClient.onGet('reports/leases', {
        params: {
          fromDate: params.startsAt,
          toDate: params.endsAt,
          page: undefined,
          'q[arrears]': true,
          resourceId: undefined,
          resourceType: undefined,
        },
      });
    });

    it('should handle success', (done) => {
      store.dispatch(fetchLeasesDetail(params));
      request.reply(200, 'response');

      store.whenComplete(() => {
        const received = store.actions;
        const expected = fetchLeasesDetailSuccess({ data: 'response' });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(fetchLeasesDetail(params));
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('fetchManagementLogic', () => {
    beforeEach(() => {
      params = { startsAt: 'startsAt', endsAt: 'endsAt' };
      request = mockHttpClient.onGet('reports/management', {
        params: {
          page: undefined,
          fromDate: params.startsAt,
          toDate: params.endsAt,
          'q[type_of_eq]': undefined,
          resourceId: undefined,
          resourceType: undefined,
        },
      });
    });

    it('should handle success', (done) => {
      store.dispatch(fetchManagement(params));
      request.reply(200, 'response');

      store.whenComplete(() => {
        const received = store.actions;
        const expected = fetchManagementSuccess({ data: 'response' });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(fetchManagement(params));
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('fetchManagementsDetailLogic', () => {
    beforeEach(() => {
      params = {
        category: 'lost',
        type: 'test reason',
        startsAt: 'startsAt',
        endsAt: 'endsAt',
      };
      request = mockHttpClient.onGet('reports/property_managements', {
        params: {
          fromDate: params.startsAt,
          toDate: params.endsAt,
          page: undefined,
          'q[lost_reason_type_eq]': params.type,
          'q[type_of_eq]': params.category,
          resourceId: undefined,
          resourceType: undefined,
        },
      });
    });

    it('should handle success', (done) => {
      store.dispatch(fetchManagementsDetail(params));
      request.reply(200, 'response');

      store.whenComplete(() => {
        const received = store.actions;
        const expected = fetchManagementsDetailSuccess({ data: 'response' });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(fetchManagementsDetail(params));
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('fetchRentLogic', () => {
    beforeEach(() => {
      params = { startsAt: 'startsAt', endsAt: 'endsAt' };
      request = mockHttpClient.onGet('reports/income', {
        params: {
          page: undefined,
          paidAtGteq: params.startsAt,
          paidAtLteq: params.endsAt,
          'q[type_of_in]': ['rent', 'deposit'],
          resourceId: undefined,
          resourceType: undefined,
          reportType: undefined,
        },
      });
    });

    it('should handle success', (done) => {
      store.dispatch(fetchRent({ params }));
      request.reply(200, { properties: [] });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = fetchRentSuccess({ data: { properties: [] } });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(fetchRent({ params }));
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('fetchTaskLogic Revenue', () => {
    let feeType;

    beforeEach(() => {
      params = {
        startsAt: 'startsAt',
        endsAt: 'endsAt',
      };
      feeType = 'revenue';
      request = mockHttpClient.onGet('reports/income', {
        params: {
          page: undefined,
          paidAtGteq: params.startsAt,
          paidAtLteq: params.endsAt,
          'q[invoices_category_eq]': undefined,
          'q[type_of_in]': ['task'],
          resourceId: undefined,
          resourceType: undefined,
          reportType: undefined,
        },
        props: {
          feeType,
        },
      });
    });

    it('should handle success', (done) => {
      store.dispatch(
        fetchTask({
          params,
          feeType,
        })
      );
      request.reply(200, { properties: [] });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = fetchTaskSuccess({
          data: { properties: [] },
          props: {
            feeType,
          },
        });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(
        fetchTask({
          params,
          feeType,
        })
      );
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('fetchTaskLogic Expenses', () => {
    let feeType;

    beforeEach(() => {
      params = {
        startsAt: 'startsAt',
        endsAt: 'endsAt',
      };
      feeType = 'expenses';
      request = mockHttpClient.onGet('reports/expense', {
        params: {
          page: undefined,
          paidAtGteq: params.startsAt,
          paidAtLteq: params.endsAt,
          'q[invoices_category_eq]': undefined,
          'q[type_of_in]': ['task'],
          resourceId: undefined,
          resourceType: undefined,
          reportType: undefined,
        },
        props: {
          feeType,
        },
      });
    });

    it('should handle success', (done) => {
      store.dispatch(
        fetchTask({
          params,
          feeType,
        })
      );
      request.reply(200, { properties: [] });

      store.whenComplete(() => {
        const received = store.actions;
        const expected = fetchTaskSuccess({
          data: { properties: [] },
          props: { feeType },
        });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(
        fetchTask({
          params,
          feeType,
        })
      );
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('fetchTasksDetailLogic', () => {
    beforeEach(() => {
      params = {
        scope: 'completed',
        resourceId: '1',
        resourceType: 'agency',
        startsAt: 'startsAt',
        endsAt: 'endsAt',
      };
      request = mockHttpClient.onGet('reports/property_tasks', {
        params: {
          page: undefined,
          resourceId: '1',
          resourceType: 'agency',
          'q[completed]': true,
          fromDate: 'startsAt',
          toDate: 'endsAt',
        },
      });
    });

    it('should handle success', (done) => {
      store.dispatch(fetchTasksDetail(params));
      request.reply(200, 'response');

      store.whenComplete(() => {
        const received = store.actions;
        const expected = fetchTasksDetailSuccess({ data: 'response' });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(fetchTasksDetail(params));
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('exportRevenueCSVLogic', () => {
    beforeEach(() => {
      params = {
        startsAt: 'startsAt',
        endsAt: 'endsAt',
      };
      request = mockHttpClient.onGet('reports/export-revenue-csv', {
        params: {
          page: undefined,
          paidAtGteq: params.startsAt,
          paidAtLteq: params.endsAt,
          resourceId: undefined,
          resourceType: undefined,
          reportType: undefined,
        },
      });
    });

    it('should handle success', (done) => {
      store.dispatch(
        exportRevenueCSV({
          params,
        })
      );
      request.reply(200, 'response');

      store.whenComplete(() => {
        const received = store.actions;
        const expected = exportCSVSuccess({
          data: 'response',
          message: 'CSV exported, please check your inbox',
        });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(
        exportRevenueCSV({
          params,
        })
      );
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('exportExpenseCSVLogic', () => {
    beforeEach(() => {
      params = {
        startsAt: 'startsAt',
        endsAt: 'endsAt',
      };
      request = mockHttpClient.onGet('reports/export-expense-csv', {
        params: {
          page: undefined,
          paidAtGteq: params.startsAt,
          paidAtLteq: params.endsAt,
          resourceId: undefined,
          resourceType: undefined,
          reportType: undefined,
        },
      });
    });

    it('should handle success', (done) => {
      store.dispatch(
        exportExpensesCSV({
          params,
        })
      );
      request.reply(200, 'response');

      store.whenComplete(() => {
        const received = store.actions;
        const expected = exportCSVSuccess({
          data: 'response',
          message: 'CSV exported, please check your inbox',
        });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(
        exportExpensesCSV({
          params,
        })
      );
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });
});
