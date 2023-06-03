/* eslint-disable no-undef */
import { inspectionLogic } from '../';
import { mockHttpClient, mockReduxLogic } from '../../__mocks__';
import inspection, { initialState } from '../reducer';

const {
  createArea,
  createAreaSuccess,
  createAreaItem,
  createAreaItemSuccess,
  createReport,
  createReportSuccess,
  deleteArea,
  deleteAreaSuccess,
  deleteAreaItem,
  deleteAreaItemSuccess,
  deleteReport,
  deleteReportSuccess,
  error,
  fetchArea,
  fetchAreaSuccess,
  fetchCondition,
  fetchConditionSuccess,
  fetchReport,
  fetchReportSuccess,
  fetchReports,
  fetchReportsSuccess,
  sendToTenant,
  updateArea,
  updateAreaSuccess,
  updateAreaItem,
  updateAreaItemSuccess,
  updateReport,
  updateReportSuccess,
} = inspection.actions;

describe('task/logic', () => {
  let params;
  let request;
  let store;

  const testLogicError = error(
    new Error('Request failed with status code 500')
  );

  beforeEach(() => {
    store = mockReduxLogic({
      initialState,
      logic: inspectionLogic,
      reducer: inspection.reducer,
    });
  });

  afterEach(() => {
    params = undefined;
    request = undefined;
    store = undefined;
  });

  describe('Create logic', () => {
    describe('createArea', () => {
      const propertyConditionId = 11;
      const areaId = 22;

      beforeEach(() => {
        params = { name: 'Test name' };
        request = mockHttpClient.onPost(
          `/property_conditions/${propertyConditionId}/areas`,
          params
        );
      });

      it('should dispatch createAreaSuccess on success', (done) => {
        const response = {
          ...params,
          id: areaId,
        };

        store.dispatch(createArea({ propertyConditionId, params }));
        request.reply(200, response);

        store.whenComplete(() => {
          const received = store.actions;
          const expected = createAreaSuccess({
            data: response,
            props: { propertyConditionId, message: 'area has been created.' },
          });
          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should dispatch error on fail', (done) => {
        store.dispatch(createArea({ propertyConditionId, params }));
        request.reply(500, {});

        store.whenComplete(() => {
          const received = store.actions;
          const expected = testLogicError;
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });

    describe('createAreaItem', () => {
      const areaId = 22;
      const areaItemId = 33;

      beforeEach(() => {
        params = { name: 'Test name' };
        request = mockHttpClient.onPost(
          `/property_condition_areas/${areaId}/items`,
          params
        );
      });

      it('should dispatch createAreaItemSuccess on success', (done) => {
        const response = {
          ...params,
          id: areaItemId,
        };

        store.dispatch(createAreaItem({ areaId, params }));
        request.reply(200, response);

        store.whenComplete(() => {
          const received = store.actions;
          const expected = createAreaItemSuccess({
            data: response,
            props: { areaId, message: 'area item has been created.' },
          });
          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should dispatch error on fail', (done) => {
        store.dispatch(createAreaItem({ areaId, params }));
        request.reply(500, {});

        store.whenComplete(() => {
          const received = store.actions;
          const expected = testLogicError;
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });

    describe('createReport', () => {
      const propertyId = 1;
      const leaseId = 2;
      const reportId = 3;

      beforeEach(() => {
        params = {
          inspectionDate: '1st January 2020',
          leaseId,
          typeOf: 'ingoing',
        };
        request = mockHttpClient.onPost(`/property_inspection_reports`, params);
      });

      it('should dispatch createReportSuccess on success', (done) => {
        const response = {
          ...params,
          id: reportId,
        };

        store.dispatch(createReport({ propertyId, ...params }));
        request.reply(200, response);

        store.whenComplete(() => {
          const received = store.actions;
          const expected = createReportSuccess({
            data: response,
            props: { propertyId, message: 'report has been created.' },
          });
          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should dispatch ERROR on fail', (done) => {
        store.dispatch(createReport({ propertyId, ...params }));
        request.reply(500, {});

        store.whenComplete(() => {
          const received = store.actions;
          const expected = testLogicError;
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });
  });

  describe('Delete logic', () => {
    describe('deleteArea', () => {
      const reportId = 11;
      const propertyConditionId = 22;
      const areaId = 33;

      beforeEach(() => {
        params = { areaId, propertyConditionId, params: { reportId } };
        request = mockHttpClient.onDelete(
          `/property_condition_areas/${areaId}`
        );
      });

      it('should dispatch deleteAreaSuccess on success', (done) => {
        const response = {
          id: areaId,
          areas: [],
        };

        store.dispatch(deleteArea({ ...params }));
        request.reply(200, response);

        store.whenComplete(() => {
          const received = store.actions;
          const expected = deleteAreaSuccess({
            data: response,
            props: {
              message: 'area has been deleted.',
              propertyConditionId,
              reportId,
            },
          });
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });

    describe('deleteAreaItem', () => {
      const areaItemId = 11;

      beforeEach(() => {
        params = { areaItemId };
        request = mockHttpClient.onDelete(
          `/property_condition_items/${areaItemId}`
        );
      });

      it('should dispatch deleteAreaItemSuccess on success', (done) => {
        const response = {};

        store.dispatch(deleteAreaItem({ ...params }));
        request.reply(200, response);

        store.whenComplete(() => {
          const received = store.actions;
          const expected = deleteAreaItemSuccess({
            data: response,
            props: {
              message: 'area item has been deleted.',
              areaItemId,
            },
          });
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });

    describe('deleteReport', () => {
      const propertyId = 11;
      const reportId = 22;

      beforeEach(() => {
        params = { propertyId, reportId };
        request = mockHttpClient.onDelete(
          `/property_inspection_reports/${reportId}`
        );
      });

      it('should dispatch deleteReportSuccess on success', (done) => {
        const response = { test: 'data ' };

        store.dispatch(deleteReport({ ...params }));
        request.reply(200, response);

        store.whenComplete(() => {
          const received = store.actions;
          const expected = deleteReportSuccess({
            data: response,
            props: {
              message: 'report has been deleted.',
              propertyId,
            },
          });
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });
  });

  describe('Fetch logic', () => {
    describe('fetchArea', () => {
      const areaId = 11;

      beforeEach(() => {
        params = { areaId };
        request = mockHttpClient.onGet(`/property_condition_areas/${areaId}`);
      });

      it('should dispatch fetchAreaSuccess on success', (done) => {
        const response = {
          id: areaId,
          items: ['item 1', 'item 2'],
        };

        store.dispatch(fetchArea({ ...params }));
        request.reply(200, response);

        store.whenComplete(() => {
          const received = store.actions;
          const expected = fetchAreaSuccess({ data: response });
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });

    describe('fetchCondition', () => {
      const propertyId = 11;
      const propertyConditionId = 22;

      beforeEach(() => {
        params = { propertyId };
        request = mockHttpClient.onGet(`/properties/${propertyId}/condition`);
      });

      it('should dispatch fetchConditionSuccess on success', (done) => {
        const response = {
          id: propertyConditionId,
          areas: [{ id: 11 }, { id: 1 }, { id: 2 }],
        };

        store.dispatch(fetchCondition({ ...params }));
        request.reply(200, response);

        store.whenComplete(() => {
          const received = store.actions;
          const expected = fetchConditionSuccess({
            data: {
              id: propertyConditionId,
              areas: [{ id: 11 }, { id: 1 }, { id: 2 }],
            },
            props: { propertyId },
          });
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });

    describe('fetchReport', () => {
      const reportId = 11;

      beforeEach(() => {
        params = { reportId };
        request = mockHttpClient.onGet(
          `/property_inspection_reports/${reportId}`
        );
      });

      it('should dispatch fetchReportSuccess on success', (done) => {
        const response = {
          id: reportId,
          areas: [{ id: 11 }, { id: 1 }, { id: 2 }],
        };

        store.dispatch(fetchReport({ ...params }));
        request.reply(200, response);

        store.whenComplete(() => {
          const received = store.actions;
          const expected = fetchReportSuccess({
            data: {
              id: reportId,
              areas: [{ id: 11 }, { id: 1 }, { id: 2 }],
            },
          });
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });

    describe('fetchReports', () => {
      const propertyId = 11;

      beforeEach(() => {
        params = { propertyId };
        request = mockHttpClient.onGet(`/property_inspection_reports`, {
          params,
        });
      });

      it('should dispatch fetchReportsSuccess and sort by inspectionDate on success', (done) => {
        const response = {
          inspectionReports: [
            { id: 11, inspectionDate: '2020-04-02' },
            { id: 1, inspectionDate: '2020-04-04' },
            { id: 2, inspectionDate: '2020-04-03' },
          ],
        };

        store.dispatch(fetchReports({ ...params }));
        request.reply(200, response);

        store.whenComplete(() => {
          const received = store.actions;
          const expected = fetchReportsSuccess({
            data: {
              inspectionReports: [
                { id: 1, inspectionDate: '2020-04-04' },
                { id: 2, inspectionDate: '2020-04-03' },
                { id: 11, inspectionDate: '2020-04-02' },
              ],
            },
            props: { propertyId },
          });
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });
  });

  describe('Update logic', () => {
    describe('updateArea', () => {
      const areaId = 11;

      beforeEach(() => {
        params = { manager: { note: 'testing update' } };
        request = mockHttpClient.onPatch(
          `/property_condition_areas/${areaId}`,
          params
        );
      });

      it('should dispatch updateAreaSuccess on success', (done) => {
        const response = {
          id: areaId,
          manager: { note: 'testing update' },
        };

        store.dispatch(updateArea({ areaId, params }));
        request.reply(200, response);

        store.whenComplete(() => {
          const received = store.actions;
          const expected = updateAreaSuccess({ data: response });
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });

    describe('updateAreaItem', () => {
      const areaItemId = 11;

      beforeEach(() => {
        params = { manager: { note: 'testing update' } };
        request = mockHttpClient.onPatch(
          `/property_condition_items/${areaItemId}`,
          params
        );
      });

      it('should dispatch updateAreaItemSuccess on success', (done) => {
        const response = {
          id: areaItemId,
          manager: { note: 'testing update' },
        };

        store.dispatch(updateAreaItem({ areaItemId, params }));
        request.reply(200, response);

        store.whenComplete(() => {
          const received = store.actions;
          const expected = updateAreaItemSuccess({ data: response });
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });

    describe('updateReport', () => {
      const reportId = 11;

      beforeEach(() => {
        params = { status: 'pending_tenant' };
        request = mockHttpClient.onPatch(
          `/property_inspection_reports/${reportId}`
        );
      });

      it('should dispatch UPDATE_REPORT_SUCCESS on success', (done) => {
        const response = {
          id: reportId,
          status: 'pending_tenant',
        };

        store.dispatch(updateReport({ reportId, params }));
        request.reply(200, response);

        store.whenComplete(() => {
          const received = store.actions;
          const expected = updateReportSuccess({ data: response });
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });
  });

  describe('sendToTenant', () => {
    const reportId = 11;

    beforeEach(() => {
      request = mockHttpClient.onPost(
        `/property_inspection_reports/${reportId}/send_to_tenant`
      );
    });

    it('should dispatch updateReportSuccess on success', (done) => {
      const response = {
        id: reportId,
        status: 'pending_tenant',
      };

      store.dispatch(sendToTenant({ reportId }));
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = updateReportSuccess({ data: response });
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });
});
