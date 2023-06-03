import { waitFor } from '@testing-library/dom';
import {
  getAllByTestId,
  getByTestId,
  queryByTestId,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {
  INSPECTION_STATUS,
  INSPECTION_TYPE,
  createInspectionReport,
  createUploadedInspectionReport,
  deleteInspectionReport,
  fetchPropertyInspectionReports,
} from '../../../redux/inspection';
import { fetchLeases } from '../../../redux/lease';
import {
  getStateAsManager,
  getStateAsPrimaryTenant,
} from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { InspectionReportList } from '../ReportList';

describe('InspectionReportList', () => {
  const testConditions = { 11: { id: 11 } };
  const testProfile = { id: 123 };
  const testLeases = {
    23: {
      id: 23,
      isPending: false,
      propertyId: 1,
      startDate: '2020-02-25',
      endDate: '2020-10-01',
      primaryTenant: {
        id: 999,
        firstName: 'Tim',
        lastName: 'Tam',
      },
    },
    45: {
      id: 45,
      isPending: true,
      propertyId: 2,
      startDate: '2020-10-02',
      endDate: '2021-01-01',
    },
  };
  const testReports = {
    11: {
      id: 11,
      propertyConditionId: 11,
      status: INSPECTION_STATUS.PENDING_AGENCY,
      typeOf: INSPECTION_TYPE.INGOING,
      lease: testLeases[23],
    },
    22: {
      id: 22,
      status: INSPECTION_STATUS.COMPLETED,
      typeOf: INSPECTION_TYPE.INGOING,
      lease: testLeases[23],
    },
    33: {
      id: 33,
      propertyConditionId: 11,
      status: INSPECTION_STATUS.PENDING_AGENCY,
      typeOf: INSPECTION_TYPE.ROUTINE,
      lease: testLeases[23],
    },
    44: {
      id: 44,
      tenant: { id: testProfile.id },
      status: INSPECTION_STATUS.PENDING_AGENCY,
      typeOf: INSPECTION_TYPE.ROUTINE,
      lease: testLeases[45],
    },
  };
  const testProperties = {
    1: { id: 1, reports: [11, 22, 33] },
    2: { id: 2, reports: [44] },
  };
  const testStoreState = {
    inspection: {
      conditions: { data: testConditions },
      properties: { data: testProperties },
      reports: { data: testReports },
    },
    lease: {
      leases: testLeases,
    },
  };

  describe('as a manager', () => {
    it('should fetch reports and leases', async () => {
      const [{ container }, store] = renderWithStore(
        <InspectionReportList property={testProperties[1]} />,
        { initialState: getStateAsManager({ ...testStoreState, lease: {} }) }
      );

      expect(queryByTestId(container, 'inspection-report-list')).toBeTruthy();

      const reports = getAllByTestId(container, 'inspection-report-list-item');
      expect(reports.length).toEqual(3);

      const report = reports[0];
      expect(queryByTestId(report, 'button-delete-report')).toBeTruthy();
      expect(queryByTestId(report, 'report-link').href).toContain(
        `/report/${testReports[11].id}`
      );

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          fetchPropertyInspectionReports({ propertyId: testProperties[1].id })
        );
        expect(store.actions).toContainEqual(
          fetchLeases({ propertyId: testProperties[1].id })
        );
      });
    });

    // TODO: re-enable tests, BE returns date and not date string
    it.skip('should create an outgoing report', async () => {
      const testFormParams = {
        type: INSPECTION_TYPE.OUTGOING,
        leaseId: `${testLeases[23].id}`,
        inspectionDate: '10-10-2020',
      };

      const [{ container }, store] = renderWithStore(
        <InspectionReportList
          canStartReport={true}
          property={testProperties[1]}
        />,
        { initialState: getStateAsManager(testStoreState) }
      );

      const wrapper = getByTestId(
        container,
        'inspection-report-create-dropdown'
      );

      userEvent.click(getByTestId(wrapper, 'dropdown-toggle'));
      userEvent.click(getByTestId(wrapper, 'dropdown-item-2')); // option for outgoing inspection

      const confirmModal = screen.getByTestId('modal-confirm');
      const form = getByTestId(confirmModal, 'form-inspection-report-create');

      await userEvent.selectOptions(
        getByTestId(form, 'form-field-leaseId'),
        testFormParams.leaseId
      );

      await userEvent.type(
        getByTestId(form, 'field-date-picker').querySelector('input'),
        testFormParams.inspectionDate
      );

      userEvent.click(getByTestId(form, 'form-submit-btn'));

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          createInspectionReport({
            leaseId: testFormParams.leaseId,
            propertyId: testProperties[1].id,
            inspectionDate:
              'Sat Oct 10 2020 00:00:00 GMT+1100 (Australian Eastern Daylight Time)',
            type: testFormParams.type,
          })
        );
      });
    });

    it.skip('can only create a routine inspection if there are no tenants on leases', async () => {
      const testFormParams = {
        type: INSPECTION_TYPE.ROUTINE,
        leaseId: `${testLeases[45].id}`,
        inspectionDate: '10-10-2020',
      };

      const [{ container }, store] = renderWithStore(
        <InspectionReportList
          canStartReport={true}
          property={testProperties[2]}
        />,
        { initialState: getStateAsManager(testStoreState) }
      );

      const wrapper = getByTestId(
        container,
        'inspection-report-create-dropdown'
      );
      userEvent.click(getByTestId(wrapper, 'dropdown-toggle'));

      expect(queryByTestId(wrapper, 'dropdown-item-1')).toBeFalsy();
      expect(queryByTestId(wrapper, 'dropdown-item-2')).toBeFalsy();
      userEvent.click(getByTestId(wrapper, 'dropdown-item-0')); // only routine inspection should be available

      const confirmModal = screen.getByTestId('modal-confirm');
      const form = getByTestId(confirmModal, 'form-inspection-report-create');

      await userEvent.selectOptions(
        getByTestId(form, 'form-field-leaseId'),
        testFormParams.leaseId
      );

      await userEvent.type(
        getByTestId(form, 'field-date-picker').querySelector('input'),
        testFormParams.inspectionDate
      );

      userEvent.click(getByTestId(form, 'form-submit-btn'));

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          createInspectionReport({
            leaseId: testFormParams.leaseId,
            propertyId: testProperties[2].id,
            inspectionDate:
              'Sat Oct 10 2020 00:00:00 GMT+1100 (Australian Eastern Daylight Time)',
            type: testFormParams.type,
          })
        );
      });
    });

    it.skip('should create an uploaded outgoing report', async () => {
      const testFormParams = {
        type: INSPECTION_TYPE.OUTGOING,
        leaseId: `${testLeases[23].id}`,
        inspectionDate: '10-10-2020',
      };

      const [{ container }, store] = renderWithStore(
        <InspectionReportList
          canStartReport={true}
          property={testProperties[1]}
        />,
        { initialState: getStateAsManager(testStoreState) }
      );

      userEvent.click(getByTestId(container, 'button-report-new-upload'));

      const confirmModal = screen.getByTestId('modal-confirm');
      const form = getByTestId(confirmModal, 'form-inspection-report-create');

      await userEvent.selectOptions(
        getByTestId(form, 'form-field-type'),
        testFormParams.type
      );

      await userEvent.selectOptions(
        getByTestId(form, 'form-field-leaseId'),
        testFormParams.leaseId
      );

      await userEvent.type(
        getByTestId(form, 'field-date-picker').querySelector('input'),
        testFormParams.inspectionDate
      );

      userEvent.click(getByTestId(form, 'form-submit-btn'));

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          createUploadedInspectionReport({
            leaseId: testFormParams.leaseId,
            propertyId: testProperties[1].id,
            inspectionDate:
              'Sat Oct 10 2020 00:00:00 GMT+1100 (Australian Eastern Daylight Time)',
            type: testFormParams.type,
          })
        );
      });
    });

    it('should delete a report', async () => {
      const [{ container }, store] = renderWithStore(
        <InspectionReportList
          canStartReport={true}
          property={testProperties[1]}
        />,
        { initialState: getStateAsManager(testStoreState) }
      );

      const report = getAllByTestId(
        container,
        'inspection-report-list-item'
      )[0]; // select first report
      userEvent.click(getByTestId(report, 'button-delete-report'));

      const confirmModal = screen.getByTestId('modal-confirm');
      userEvent.click(getByTestId(confirmModal, 'form-submit-btn'));

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          deleteInspectionReport({
            propertyId: testProperties[1].id,
            reportId: testReports[11].id,
          })
        );
      });
    });
  });

  describe('as a tenant', () => {
    it('should fetch reports and leases', async () => {
      const [{ container }, store] = renderWithStore(
        <InspectionReportList property={testProperties[1]} />,
        {
          initialState: getStateAsPrimaryTenant({
            ...testStoreState,
            lease: {},
          }),
        }
      );

      expect(queryByTestId(container, 'inspection-report-list')).toBeTruthy();

      const reports = getAllByTestId(container, 'inspection-report-list-item');
      expect(reports.length).toEqual(3);

      expect(queryByTestId(reports[0], 'button-delete-report')).toBeFalsy(); // pending report
      expect(queryByTestId(reports[0], 'report-link')).toBeFalsy();

      expect(queryByTestId(reports[1], 'button-delete-report')).toBeFalsy(); // completed report
      expect(queryByTestId(reports[1], 'report-link').href).toContain(
        `/report/${testReports[22].id}`
      );

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          fetchPropertyInspectionReports({ propertyId: testProperties[1].id })
        );
        expect(store.actions).toContainEqual(
          fetchLeases({ propertyId: testProperties[1].id })
        );
      });
    });
  });
});
