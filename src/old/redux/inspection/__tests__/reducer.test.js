/* eslint-disable no-undef */
import { mockReduxLogic } from '../../__mocks__';
import inspection, { initialState } from '../reducer';

const {
  createArea,
  createAreaSuccess,
  createAreaItem,
  createAreaItemSuccess,
  createReportSuccess,
  deleteArea,
  deleteAreaSuccess,
  deleteAreaItem,
  deleteAreaItemSuccess,
  deleteReport,
  deleteReportSuccess,
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
  updateAttachments,
  updateReport,
  updateReportSuccess,
} = inspection.actions;

describe('inspection/reducer', () => {
  let store;

  beforeEach(() => {
    store = mockReduxLogic({
      initialState,
      logic: [],
      reducer: inspection.reducer,
    });
  });

  it('should define the initialState', () => {
    const received = initialState;
    const expected = {
      isLoading: false,
      areas: { data: {}, ids: [] },
      items: { data: {}, ids: [] },
      conditions: { data: {}, ids: [] },
      properties: { data: {}, ids: [] },
      reports: { data: {}, ids: [], result: null },
    };

    expect(received).toEqual(expected);
  });

  [
    createArea,
    createAreaItem,
    deleteArea,
    deleteAreaItem,
    deleteReport,
    fetchArea,
    fetchCondition,
    fetchReport,
    fetchReports,
    sendToTenant,
    updateArea,
    updateAreaItem,
    updateReport,
  ].map((type) => {
    it(`should handle ${type.name}`, () => {
      store.dispatch(type());

      const received = store.getState();
      const expected = { ...initialState, isLoading: true };

      expect(received).toEqual(expected);
    });
  });

  describe('Create actions', () => {
    describe('createAreaSuccess', () => {
      const propertyConditionId = 11;
      const areaId = 22;
      const reportId = 33;

      const state = {
        ...initialState,
        isLoading: true,
        areas: {
          ...initialState.areas,
          data: {
            1: { id: 1, name: 'Live condition area' },
            333: { id: 333, name: 'Report area' },
          },
          ids: [1],
        },
        conditions: {
          ...initialState.conditions,
          data: {
            [propertyConditionId]: { areas: [1] },
          },
        },
        reports: {
          ...initialState.reports,
          data: {
            [reportId]: { areas: [333] },
          },
        },
      };
      const testAreaData = {
        id: areaId,
        name: 'TEST area',
      };

      beforeEach(() => {
        store = mockReduxLogic({
          initialState: state,
          logic: [],
          reducer: inspection.reducer,
        });
      });

      it('should create an area in a Live Condition', () => {
        store.dispatch(
          createAreaSuccess({
            data: testAreaData,
            props: { propertyConditionId },
          })
        );

        const received = store.getState();
        const expected = {
          ...state,
          isLoading: false,
          areas: {
            ...state.areas,
            data: {
              ...state.areas.data,
              [areaId]: testAreaData,
            },
            ids: [1, areaId],
          },
          conditions: {
            ...state.conditions,
            data: {
              [propertyConditionId]: { areas: [1, areaId] },
            },
          },
        };

        expect(received).toEqual(expected);
      });

      it('should create an area in a Report when given reportId', () => {
        store.dispatch(
          createAreaSuccess({
            data: testAreaData,
            props: {
              propertyConditionId,
              reportId,
            },
          })
        );

        const received = store.getState();
        const expected = {
          ...state,
          isLoading: false,
          areas: {
            ...state.areas,
            data: {
              ...state.areas.data,
              [areaId]: {
                id: areaId,
                name: 'TEST area',
              },
            },
            ids: [1, areaId],
          },
          conditions: {
            ...initialState.conditions,
            data: {
              [propertyConditionId]: { areas: [1, areaId] },
            },
          },
          reports: {
            ...state.reports,
            data: {
              [reportId]: {
                areas: [333, areaId],
              },
            },
          },
        };

        expect(received).toEqual(expected);
      });
    });

    describe('createAreaItemSuccess', () => {
      it('should create area item and attach to area', () => {
        const areaId = 22;
        const areaItemId = 33;

        store.dispatch(
          createAreaItemSuccess({
            data: {
              id: areaItemId,
              name: 'TEST item',
            },
            props: { areaId },
          })
        );

        const received = store.getState();
        const expected = {
          ...initialState,
          isLoading: false,
          areas: {
            ...initialState.areas,
            data: {
              [areaId]: { items: [areaItemId] },
            },
          },
          items: {
            data: {
              [areaItemId]: {
                id: areaItemId,
                name: 'TEST item',
              },
            },
            ids: [areaItemId],
          },
        };

        expect(received).toEqual(expected);
      });
    });

    describe('createReportSuccess', () => {
      const propertyId = 22;
      const reportId = 33;
      const data = {
        id: reportId,
        foo: 'bar',
      };

      it('should create report and attach to property', () => {
        store.dispatch(
          createReportSuccess({
            data,
            props: {
              propertyId,
              isUploadedReport: false,
            },
          })
        );

        const received = store.getState();
        const expected = {
          ...initialState,
          isLoading: false,
          reports: {
            ...initialState.reports,
            data: {
              [reportId]: { ...data },
            },
            ids: [reportId],
            result: null,
          },
          properties: {
            ...initialState.properties,
            data: {
              [propertyId]: {
                reports: [reportId],
              },
            },
          },
        };

        expect(received).toEqual(expected);
      });

      it('should create report and set result when isUploadedReport', () => {
        store.dispatch(
          createReportSuccess({
            data,
            props: {
              propertyId,
              isUploadedReport: true,
            },
          })
        );

        const received = store.getState();
        const expected = {
          ...initialState,
          isLoading: false,
          reports: {
            ...initialState.reports,
            data: {
              [reportId]: { ...data },
            },
            ids: [reportId],
            result: reportId,
          },
          properties: {
            ...initialState.properties,
            data: {
              [propertyId]: {
                reports: [reportId],
              },
            },
          },
        };

        expect(received).toEqual(expected);
      });
    });
  });

  describe('Delete actions', () => {
    describe('deleteAreaSuccess', () => {
      const areaId = 1;
      const propertyConditionId = 2;
      const reportId = 3;

      const state = {
        ...initialState,
        isLoading: true,
        areas: {
          data: {
            [areaId]: { id: areaId },
            444: { manager: {} },
            555: { manager: {} },
          },
          ids: [areaId, 444, 555],
        },
        conditions: {
          ...initialState.conditions,
          data: {
            [propertyConditionId]: {
              areas: [areaId, 444, 555],
            },
          },
        },
        reports: {
          ...initialState.reports,
          data: {
            [reportId]: {
              areas: [12, 34, areaId],
            },
          },
        },
      };

      beforeEach(() => {
        store = mockReduxLogic({
          initialState: state,
          logic: [],
          reducer: inspection.reducer,
        });
      });

      it('should delete area and remove from condition', () => {
        store.dispatch(
          deleteAreaSuccess({
            data: { id: areaId },
            props: { propertyConditionId },
          })
        );

        const received = store.getState();
        const expected = {
          ...state,
          isLoading: false,
          areas: {
            ...state.areas,
            data: { 444: { manager: {} }, 555: { manager: {} } },
            ids: [444, 555],
          },
          conditions: {
            ...state.conditions,
            data: {
              [propertyConditionId]: { areas: [444, 555] },
            },
          },
        };

        expect(received).toEqual(expected);
      });

      it('should delete area and remove from report if given reportId', () => {
        store.dispatch(
          deleteAreaSuccess({
            data: { id: areaId },
            props: { propertyConditionId, reportId },
          })
        );

        const received = store.getState();
        const expected = {
          ...state,
          isLoading: false,
          areas: {
            ...state.areas,
            data: { 444: { manager: {} }, 555: { manager: {} } },
            ids: [444, 555],
          },
          conditions: {
            ...state.conditions,
            data: {
              [propertyConditionId]: { areas: [444, 555] },
            },
          },
          reports: {
            ...state.reports,
            data: {
              [reportId]: {
                areas: [12, 34],
              },
            },
          },
        };

        expect(received).toEqual(expected);
      });
    });

    describe('deleteAreaItemSuccess', () => {
      const areaItemId = 33;

      const state = {
        ...initialState,
        isLoading: true,
        items: {
          data: { [areaItemId]: { id: areaItemId }, 444: {}, 555: {} },
          ids: [areaItemId, 444, 555],
        },
      };

      beforeEach(() => {
        store = mockReduxLogic({
          initialState: state,
          logic: [],
          reducer: inspection.reducer,
        });
      });

      it('should delete area item and remove from area', () => {
        store.dispatch(
          deleteAreaItemSuccess({
            props: { areaItemId },
          })
        );

        const received = store.getState();
        const expected = {
          ...initialState,
          isLoading: false,
          items: {
            data: { 444: {}, 555: {} },
            ids: [444, 555],
          },
        };

        expect(received).toEqual(expected);
      });
    });

    describe('deleteReportSuccess', () => {
      const reportId = 3;
      const propertyConditionId = 44;
      const propertyId = 555;

      const state = {
        ...initialState,
        isLoading: true,
        conditions: {
          data: {
            33: { id: 33, updateBlockedByReportId: 2 },
            [propertyConditionId]: {
              id: propertyConditionId,
              updateBlockedByReportId: reportId,
            },
          },
          ids: [33, propertyConditionId],
        },
        properties: {
          ...initialState.properties,
          data: {
            [propertyId]: {
              reports: [1, 2, reportId],
            },
          },
          ids: [propertyId],
        },
        reports: {
          ...initialState.reports,
          data: {
            1: { id: 1, updateBlockedByReportId: reportId },
            2: { id: 2, updateBlockedByReportId: 5 },
            [reportId]: { id: reportId },
          },
          ids: [1, 2, reportId],
        },
      };

      beforeEach(() => {
        store = mockReduxLogic({
          initialState: state,
          logic: [],
          reducer: inspection.reducer,
        });
      });

      it('should delete report and reset updateBlockedByReportId', () => {
        store.dispatch(
          deleteReportSuccess({
            data: { id: reportId },
            props: { propertyId },
          })
        );

        const received = store.getState();
        const expected = {
          ...state,
          isLoading: false,
          conditions: {
            ...state.conditions,
            data: {
              33: { id: 33, updateBlockedByReportId: 2 },
              [propertyConditionId]: { id: propertyConditionId },
            },
          },
          properties: {
            ...state.properties,
            data: {
              [propertyId]: {
                reports: [1, 2],
              },
            },
          },
          reports: {
            ...state.reports,
            data: {
              1: { id: 1 },
              2: { id: 2, updateBlockedByReportId: 5 },
            },
            ids: [1, 2],
          },
        };

        expect(received).toEqual(expected);
      });
    });
  });

  describe('Fetch actions', () => {
    describe('fetchAreaSuccess', () => {
      const areaId = 22;

      const state = {
        ...initialState,
        isLoading: true,
        items: {
          data: { 444: {}, 555: {} },
          ids: [444, 555],
        },
      };

      beforeEach(() => {
        store = mockReduxLogic({
          initialState: state,
          logic: [],
          reducer: inspection.reducer,
        });
      });

      it('should fetch area and add its items', () => {
        store.dispatch(
          fetchAreaSuccess({
            data: {
              id: areaId,
              name: 'TEST area',
              items: [
                { id: 111, name: 'item 1' },
                { id: 222, name: 'item 2' },
                { id: 333, name: 'item 3' },
              ],
            },
          })
        );

        const received = store.getState();
        const expected = {
          ...initialState,
          isLoading: false,
          areas: {
            ...initialState.areas,
            data: {
              [areaId]: {
                id: areaId,
                name: 'TEST area',
                items: [111, 222, 333],
              },
            },
            ids: [areaId],
          },
          items: {
            data: {
              ...state.items.data,
              111: { id: 111, name: 'item 1' },
              222: { id: 222, name: 'item 2' },
              333: { id: 333, name: 'item 3' },
            },
            ids: [...state.items.ids, 111, 222, 333],
          },
        };

        expect(received).toEqual(expected);
      });
    });

    describe('fetchConditionSuccess', () => {
      const propertyId = 11;
      const propertyConditionId = 44;

      const state = {
        ...initialState,
        isLoading: true,
        areas: {
          data: { 444: { manager: {} }, 555: { manager: {} } },
          ids: [444, 555],
        },
      };

      beforeEach(() => {
        store = mockReduxLogic({
          initialState: state,
          logic: [],
          reducer: inspection.reducer,
        });
      });

      it('should fetch property condition and add its areas', () => {
        store.dispatch(
          fetchConditionSuccess({
            data: {
              id: propertyConditionId,
              areas: [
                { id: 111, name: 'item 1', manager: {} },
                { id: 222, name: 'item 2', manager: {} },
                { id: 333, name: 'item 3', manager: {} },
              ],
            },
            props: { propertyId },
          })
        );

        const received = store.getState();
        const expected = {
          ...initialState,
          isLoading: false,
          conditions: {
            ...initialState.areas,
            data: {
              [propertyConditionId]: {
                id: propertyConditionId,
                areas: [111, 222, 333],
              },
            },
            ids: [propertyConditionId],
          },
          properties: {
            data: {
              [propertyId]: {
                propertyConditionId,
              },
            },
            ids: [propertyId],
          },
          areas: {
            data: {
              ...state.areas.data,
              111: { id: 111, name: 'item 1', manager: {} },
              222: { id: 222, name: 'item 2', manager: {} },
              333: { id: 333, name: 'item 3', manager: {} },
            },
            ids: [...state.areas.ids, 111, 222, 333],
          },
        };

        expect(received).toEqual(expected);
      });
    });

    describe('fetchReportSuccess', () => {
      const reportId = 1;
      const state = {
        ...initialState,
        isLoading: true,
        reports: {
          data: { 123: {}, 456: {} },
          ids: [123, 456],
        },
      };

      beforeEach(() => {
        store = mockReduxLogic({
          initialState: state,
          logic: [],
          reducer: inspection.reducer,
        });
      });

      it('should fetch property condition and add its areas', () => {
        const reportData = {
          id: reportId,
          areas: [
            { id: 111, name: 'area 1', manager: {} },
            { id: 222, name: 'area 2', manager: {} },
            { id: 333, name: 'area 3', manager: {} },
          ],
        };

        store.dispatch(fetchReportSuccess({ data: reportData }));

        const received = store.getState();
        const expected = {
          ...initialState,
          isLoading: false,
          reports: {
            data: {
              123: {},
              456: {},
              [reportId]: {
                id: reportId,
                areas: [111, 222, 333],
              },
            },
            ids: [123, 456, reportId],
          },
          areas: {
            data: {
              111: { id: 111, name: 'area 1', manager: {} },
              222: { id: 222, name: 'area 2', manager: {} },
              333: { id: 333, name: 'area 3', manager: {} },
            },
            ids: [111, 222, 333],
          },
        };

        expect(received).toEqual(expected);
      });
    });

    describe('fetchReportsSuccess', () => {
      const propertyId = 1;

      const state = {
        ...initialState,
        isLoading: true,
        properties: {
          data: {
            2: {},
            [propertyId]: { hello: 'world' },
          },
          ids: [2, propertyId],
        },
      };

      beforeEach(() => {
        store = mockReduxLogic({
          initialState: state,
          logic: [],
          reducer: inspection.reducer,
        });
      });

      it('should fetch reports and add to property', () => {
        store.dispatch(
          fetchReportsSuccess({
            data: {
              inspectionReports: [{ id: 11 }, { id: 22 }, { id: 33 }],
            },
            props: { propertyId },
          })
        );

        const received = store.getState();
        const expected = {
          ...state,
          isLoading: false,
          reports: {
            data: { 11: { id: 11 }, 22: { id: 22 }, 33: { id: 33 } },
            ids: [11, 22, 33],
            result: null,
          },
          properties: {
            ...state.properties,
            data: {
              ...state.properties.data,
              [propertyId]: {
                hello: 'world',
                reports: [11, 22, 33],
              },
            },
          },
        };

        expect(received).toEqual(expected);
      });
    });
  });

  describe('Update actions', () => {
    describe('updateAreaSuccess', () => {
      const areaId = 22;
      const state = {
        ...initialState,
        isLoading: true,
        areas: {
          data: {
            11: { id: 11, items: [] },
            [areaId]: { id: areaId, name: 'RENAME THIS', items: [] },
            999: { id: 999, items: [] },
          },
          ids: [11, areaId, 999],
        },
      };

      beforeEach(() => {
        store = mockReduxLogic({
          initialState: state,
          logic: [],
          reducer: inspection.reducer,
        });
      });

      it('should update an area', () => {
        store.dispatch(
          updateAreaSuccess({
            data: {
              id: areaId,
              name: 'Area renamed',
              manager: { note: 'some note' },
            },
            props: { areaId },
          })
        );

        const received = store.getState();
        const expected = {
          ...initialState,
          isLoading: false,
          areas: {
            ...state.areas,
            data: {
              ...state.areas.data,
              [areaId]: {
                id: areaId,
                name: 'Area renamed',
                items: [],
                manager: { note: 'some note' },
              },
            },
          },
        };

        expect(received).toEqual(expected);
      });
    });

    describe('updateAreaItemSuccess', () => {
      const areaItemId = 33;

      const state = {
        ...initialState,
        isLoading: true,
        items: {
          data: {
            11: { id: 11 },
            [areaItemId]: { id: areaItemId, name: 'RENAME THIS' },
            999: { id: 999 },
          },
          ids: [11, areaItemId, 999],
        },
      };

      beforeEach(() => {
        store = mockReduxLogic({
          initialState: state,
          logic: [],
          reducer: inspection.reducer,
        });
      });

      it('should update an area item', () => {
        store.dispatch(
          updateAreaItemSuccess({
            data: {
              id: areaItemId,
              name: 'Area Item renamed',
              manager: { note: 'some note' },
            },
            props: { areaItemId },
          })
        );

        const received = store.getState();
        const expected = {
          ...initialState,
          isLoading: false,
          items: {
            ...state.items,
            data: {
              ...state.items.data,
              [areaItemId]: {
                id: areaItemId,
                name: 'Area Item renamed',
                manager: { note: 'some note' },
              },
            },
          },
        };

        expect(received).toEqual(expected);
      });
    });

    describe('updateAttachments', () => {
      const areaId = 1;
      const itemId = 2;
      const testAttachments = ['test', 'attachment'];
      const testState = {
        ...initialState,
        isLoading: true,
        areas: {
          data: {
            1: {
              id: 1,
              items: [2],
              manager: { attachments: ['abc', 'xyz'] },
              tenant: { attachments: ['qwe', 'asd'] },
            },
          },
          ids: [1, 22],
        },
        items: {
          data: {
            2: {
              id: 2,
              manager: { attachments: [567, 789] },
              tenant: { attachments: [12, 34] },
            },
          },
          ids: [2],
        },
      };

      beforeEach(() => {
        store = mockReduxLogic({
          initialState: testState,
          logic: [],
          reducer: inspection.reducer,
        });
      });

      it("should update a manager's area attachment", () => {
        store.dispatch(
          updateAttachments({
            attachableId: 1234,
            attachments: testAttachments,
            role: 'manager',
            storeKey: 'areas',
            storeId: areaId,
          })
        );

        const received = store.getState();
        const expected = {
          ...testState,
          isLoading: false,
          areas: {
            ...testState.areas,
            data: {
              ...testState.areas.data,
              [areaId]: {
                ...testState.areas.data[areaId],
                manager: { attachments: testAttachments },
              },
            },
          },
        };

        expect(received).toEqual(expected);
      });

      it("should update a tenant's area item attachment", () => {
        store.dispatch(
          updateAttachments({
            attachableId: 1234,
            attachments: testAttachments,
            role: 'tenant',
            storeKey: 'items',
            storeId: itemId,
          })
        );

        const received = store.getState();
        const expected = {
          ...testState,
          isLoading: false,
          items: {
            ...testState.items,
            data: {
              ...testState.items.data,
              [itemId]: {
                ...testState.items.data[itemId],
                tenant: { attachments: testAttachments },
              },
            },
          },
        };

        expect(received).toEqual(expected);
      });

      it('should update using storeId', () => {
        const storeId = 2;

        store.dispatch(
          updateAttachments({
            attachableId: 1234,
            attachments: testAttachments,
            role: 'tenant',
            storeKey: 'items',
            storeId,
          })
        );

        const received = store.getState();
        const expected = {
          ...testState,
          isLoading: false,
          items: {
            ...testState.items,
            data: {
              ...testState.items.data,
              [storeId]: {
                ...testState.items.data[storeId],
                tenant: { attachments: testAttachments },
              },
            },
          },
        };

        expect(received).toEqual(expected);
      });
    });

    describe('updateReportSuccess', () => {
      const reportId = 1;
      const state = {
        ...initialState,
        isLoading: true,
        reports: {
          data: {
            1: {
              status: 'pending_agency',
              areas: [],
            },
            2: {
              status: 'completed',
              areas: [],
            },
          },
          ids: [1, 2],
        },
      };

      beforeEach(() => {
        store = mockReduxLogic({
          initialState: state,
          logic: [],
          reducer: inspection.reducer,
        });
      });

      it('should update report', () => {
        const reportData = {
          id: reportId,
          status: 'pending_tenant',
        };

        store.dispatch(updateReportSuccess({ data: reportData }));

        const received = store.getState();
        const expected = {
          ...state,
          isLoading: false,
          reports: {
            ...state.reports,
            data: {
              ...state.reports.data,
              [reportId]: { ...state.reports.data[reportId], ...reportData },
            },
          },
        };

        expect(received).toEqual(expected);
      });
    });
  });
});
