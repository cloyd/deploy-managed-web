/* eslint-disable no-undef */
import {
  createArea,
  createAreaItem,
  createInspectionReport,
  createUploadedInspectionReport,
  deleteArea,
  deleteAreaItem,
  deleteInspectionReport,
  fetchInspectionArea,
  fetchInspectionPropertyCondition,
  fetchInspectionReport,
  fetchPropertyInspectionReports,
  sendInspectionReportToTenant,
  updateArea,
  updateAreaItem,
  updateInspectionAttachments,
  updateInspectionReport,
} from '../actions';

describe('inspection/actions', () => {
  // Create Actions
  describe('create', () => {
    it('should return action for createArea', () => {
      const received = createArea({ name: 'test area' });
      const expected = {
        type: 'inspection/createArea',
        payload: { params: { name: 'test area' } },
      };

      expect(received).toEqual(expected);
    });

    it('should return action for createAreaItem', () => {
      const received = createAreaItem({ areaId: 1, name: 'test area' });
      const expected = {
        type: 'inspection/createAreaItem',
        payload: { areaId: 1, params: { name: 'test area' } },
      };

      expect(received).toEqual(expected);
    });

    it('should return action for createInspectionReport', () => {
      const received = createInspectionReport({
        inspectionDate: 1,
        leaseId: 2,
        propertyId: 3,
        type: 'some type',
      });
      const expected = {
        type: 'inspection/createReport',
        payload: {
          inspectionDate: 1,
          leaseId: 2,
          propertyId: 3,
          typeOf: 'some type',
        },
      };

      expect(received).toEqual(expected);
    });

    it('should return action for createUploadedInspectionReport', () => {
      const received = createUploadedInspectionReport({
        inspectionDate: 1,
        leaseId: 2,
        propertyId: 3,
        type: 'some type',
      });
      const expected = {
        type: 'inspection/createReport',
        payload: {
          inspectionDate: 1,
          isUploadedReport: true,
          leaseId: 2,
          propertyId: 3,
          typeOf: 'some type',
          status: 'pending_upload',
        },
      };

      expect(received).toEqual(expected);
    });
  });

  // Delete Actions
  describe('delete', () => {
    it('should return action for deleteArea', () => {
      const received = deleteArea({ areaId: 1 });
      const expected = {
        type: 'inspection/deleteArea',
        payload: { areaId: 1, params: {} },
      };

      expect(received).toEqual(expected);
    });

    it('should return action for deleteAreaItem', () => {
      const received = deleteAreaItem({ areaItemId: 2 });
      const expected = {
        type: 'inspection/deleteAreaItem',
        payload: { areaItemId: 2, params: {} },
      };

      expect(received).toEqual(expected);
    });

    it('should return action for deleteInspectionReport', () => {
      const received = deleteInspectionReport({ propertyId: 1, reportId: 2 });
      const expected = {
        type: 'inspection/deleteReport',
        payload: { propertyId: 1, reportId: 2 },
      };

      expect(received).toEqual(expected);
    });
  });

  // Fetch Actions
  describe('fetch', () => {
    it('should return action for fetchInspectionArea', () => {
      const received = fetchInspectionArea({ areaId: 1 });
      const expected = {
        type: 'inspection/fetchArea',
        payload: { areaId: 1, params: {} },
      };

      expect(received).toEqual(expected);
    });

    it('should return action for fetchInspectionPropertyCondition', () => {
      const received = fetchInspectionPropertyCondition({ propertyId: 3 });
      const expected = {
        type: 'inspection/fetchCondition',
        payload: { propertyId: 3 },
      };

      expect(received).toEqual(expected);
    });

    it('should return action for fetchInspectionReport', () => {
      const received = fetchInspectionReport({ reportId: 4 });
      const expected = {
        type: 'inspection/fetchReport',
        payload: { reportId: 4 },
      };

      expect(received).toEqual(expected);
    });

    it('should return action for fetchPropertyInspectionReports', () => {
      const received = fetchPropertyInspectionReports({ propertyId: 3 });
      const expected = {
        type: 'inspection/fetchReports',
        payload: { propertyId: 3 },
      };

      expect(received).toEqual(expected);
    });
  });

  // Send Actions
  describe('send', () => {
    it('should return action for sendInspectionReportToTenant', () => {
      const received = sendInspectionReportToTenant({ reportId: 1 });
      const expected = {
        type: 'inspection/sendToTenant',
        payload: { reportId: 1 },
      };

      expect(received).toEqual(expected);
    });
  });

  // Update Actions
  describe('update', () => {
    describe('updateArea', () => {
      const areaId = 1;
      const userId = 456;

      it('should return action', () => {
        const received = updateArea({ areaId, hello: 'world' });
        const expected = {
          type: 'inspection/updateArea',
          payload: { areaId, params: { hello: 'world' } },
        };

        expect(received).toEqual(expected);
      });

      it('should return formatted params when given a role', () => {
        const received = updateArea({
          areaId,
          userId,
          role: 'tenant',
          note: 'this is a tenant note',
        });
        const expected = {
          type: 'inspection/updateArea',
          payload: {
            areaId,
            params: { tenant: { id: userId, note: 'this is a tenant note' } },
          },
        };

        expect(received).toEqual(expected);
      });

      it('should return formatted params when setting isAgreed', () => {
        const received = updateArea({
          areaId,
          role: 'tenant',
          isAgreed: true,
        });
        const expected = {
          type: 'inspection/updateArea',
          payload: {
            areaId,
            params: { tenant: { isAgreed: true } },
          },
        };

        expect(received).toEqual(expected);
      });

      it('should return formatted params when setting isChecked', () => {
        const received = updateArea({
          areaId,
          role: 'manager',
          isChecked: true,
        });
        const expected = {
          type: 'inspection/updateArea',
          payload: {
            areaId,
            params: { manager: { isChecked: true } },
          },
        };

        expect(received).toEqual(expected);
      });
    });

    it('should return action for updateAreaItem', () => {
      const received = updateAreaItem({ areaItemId: 3, hello: 'world' });
      const expected = {
        type: 'inspection/updateAreaItem',
        payload: { areaItemId: 3, params: { hello: 'world' } },
      };

      expect(received).toEqual(expected);
    });

    it('should return action for updateInspectionAttachments', () => {
      const received = updateInspectionAttachments({
        attachableId: 1,
        attachments: [1, 2, 3],
        role: 'manager',
        storeKey: 'items',
      });
      const expected = {
        type: 'inspection/updateAttachments',
        payload: {
          attachableId: 1,
          attachments: [1, 2, 3],
          role: 'manager',
          storeKey: 'items',
        },
      };

      expect(received).toEqual(expected);
    });

    it('should return action for updateInspectionReport', () => {
      const received = updateInspectionReport({
        reportId: 1,
        role: 'manager',
        signature: 'xyz',
      });
      const expected = {
        type: 'inspection/updateReport',
        payload: {
          reportId: 1,
          params: {
            manager: { signature: 'xyz' },
          },
        },
      };

      expect(received).toEqual(expected);
    });
  });
});
