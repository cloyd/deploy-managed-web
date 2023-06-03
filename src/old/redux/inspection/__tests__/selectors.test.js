/* eslint-disable no-undef */
import { initialState } from '..';
import {
  getInspectionArea,
  getInspectionAreaItems,
  getInspectionAreasById,
  getInspectionCondition,
  getInspectionConditionByProperty,
  getInspectionConditionPrevAndNextArea,
  getInspectionProperty,
  getInspectionPropertyReports,
  getInspectionReport,
  getInspectionReportPrevAndNextArea,
  getInspectionReportsByLease,
} from '../selectors';

describe('inspection/selectors', () => {
  const state = {
    ...initialState,
    areas: {
      data: {
        3: { id: 3, items: [5, 7] },
        4: { id: 4, items: [6] },
        555: {
          id: 555,
          itemsCount: {
            total: 2,
            overallChecked: 3, // 2 area items + 1 overall area
            overallAgreed: 2,
            overallDisagreed: 1,
          },
        },
        666: {
          id: 666,
          itemsCount: {
            total: 3,
            overallChecked: 4, // 3 area items + 1 overall area
            overallAgreed: 2,
            overallDisagreed: 1,
          },
        },
      },
      ids: [3, 4, 555, 666],
    },
    conditions: {
      data: {
        8: { id: 8, areas: [3, 4] },
        9: { id: 9 },
      },
      ids: [8, 9],
    },
    items: {
      data: {
        5: { id: 5 },
        6: { id: 6 },
        7: { id: 7 },
      },
      ids: [5, 6, 7],
    },
    properties: {
      data: {
        1: { id: 1, propertyConditionId: 8, reports: [123, 456, 789] },
        2: { id: 2, propertyConditionId: 9, reports: [456, 789] },
      },
      ids: [1, 2],
    },
    reports: {
      data: {
        123: {
          id: 123,
          type: 'ingoing',
          status: 'pending_agency',
          areas: [555, 666],
          lease: {
            id: 77,
            leaseData: 'test',
          },
        },
        456: {
          id: 456,
          type: 'outgoing',
          status: 'completed',
          areas: [],
          lease: {
            id: 77,
            leaseData: 'test',
          },
        },
        789: {
          id: 789,
          type: 'routine',
          status: 'pending_upload',
          areas: [],
          lease: {
            id: 88,
            leaseData: 'foo bar',
          },
        },
      },
      ids: [123, 456, 789],
    },
  };

  describe('getInspectionArea', () => {
    it('should get area data', () => {
      const received = getInspectionArea(state, 3);
      const expected = { id: 3, items: [5, 7] };
      expect(received).toEqual(expected);
    });
  });

  describe('getInspectionAreaItems', () => {
    it('should get area items data', () => {
      const received = getInspectionAreaItems(state, 3);
      const expected = [{ id: 5 }, { id: 7 }];
      expect(received).toEqual(expected);
    });
  });

  describe('getInspectionAreasById', () => {
    it('should get area data', () => {
      const received = getInspectionAreasById(state, [3, 4]);
      const expected = [
        { id: 3, items: [5, 7] },
        { id: 4, items: [6] },
      ];
      expect(received).toEqual(expected);
    });
  });

  describe('getInspectionCondition', () => {
    it('should get condition data', () => {
      const received = getInspectionCondition(state, 8);
      const expected = { id: 8, areas: [3, 4] };
      expect(received).toEqual(expected);
    });
  });

  describe('getInspectionConditionPrevAndNextArea', () => {
    const conditionId = 8;

    it('should get id of next area', () => {
      const received = getInspectionConditionPrevAndNextArea(
        state,
        conditionId,
        3
      );
      const expected = [null, 4];
      expect(received).toEqual(expected);
    });

    it('should get id of previous area', () => {
      const received = getInspectionConditionPrevAndNextArea(
        state,
        conditionId,
        4
      );
      const expected = [3, null];
      expect(received).toEqual(expected);
    });
  });

  describe('getInspectionProperty', () => {
    it('should get property data', () => {
      const received = getInspectionProperty(state, 2);
      const expected = { id: 2, propertyConditionId: 9, reports: [456, 789] };
      expect(received).toEqual(expected);
    });
  });

  describe('getInspectionConditionByProperty', () => {
    it('should get condition data', () => {
      const received = getInspectionConditionByProperty(state, 2);
      const expected = { id: 9 };
      expect(received).toEqual(expected);
    });
  });

  describe('getInspectionPropertyReports', () => {
    it('should get reports data', () => {
      const received = getInspectionPropertyReports(state, 1);
      const expected = [
        state.reports.data[123],
        state.reports.data[456],
        state.reports.data[789],
      ];
      expect(received).toEqual(expected);
    });
  });

  describe('getInspectionReport', () => {
    it('should get report data', () => {
      const received = getInspectionReport(state, 123);
      const expected = state.reports.data[123];
      expect(received).toEqual(expected);
    });
  });

  describe('getInspectionReportPrevAndNextArea', () => {
    const reportId = 123;

    it('should get id of previous area', () => {
      const received = getInspectionReportPrevAndNextArea(state, reportId, 666);
      const expected = [555, null];
      expect(received).toEqual(expected);
    });

    it('should get id of next area', () => {
      const received = getInspectionReportPrevAndNextArea(state, reportId, 555);
      const expected = [null, 666];
      expect(received).toEqual(expected);
    });
  });

  describe('getInspectionReportsByLease', () => {
    it('should get reports and group by lease', () => {
      const received = getInspectionReportsByLease(state, 1);
      const expected = {
        77: {
          id: 77,
          leaseData: 'test',
          reports: [state.reports.data[123], state.reports.data[456]],
        },
        88: {
          id: 88,
          leaseData: 'foo bar',
          reports: [state.reports.data[789]],
        },
      };
      expect(received).toEqual(expected);
    });
  });
});
