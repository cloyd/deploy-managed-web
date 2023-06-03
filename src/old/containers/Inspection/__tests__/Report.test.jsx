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
  createArea,
  deleteArea,
  fetchInspectionReport,
  sendInspectionReportToTenant,
} from '../../../redux/inspection';
import {
  getStateAsManager,
  getStateAsPrimaryTenant,
} from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { InspectionReport } from '../Report';

describe('InspectionReport', () => {
  const testAreaItems = {
    23: { id: 23, name: 'Door' },
    45: { id: 45, name: 'Walls' },
  };
  const testAreas = {
    111: {
      id: 111,
      name: 'Entrance/Hall',
      itemsCount: {
        total: 2,
        overallChecked: 3,
        overallAgreed: 1,
        overallDisagreed: 1,
      },
    },
    222: {
      id: 222,
      name: 'Living Room',
      items: [23, 45],
      itemsCount: {
        total: 1,
        overallChecked: 2,
        overallAgreed: 1,
        overallDisagreed: 0,
      },
    },
    333: {
      id: 333,
      name: 'Bedroom',
      itemsCount: {
        total: 1,
        overallChecked: 1,
        overallAgreed: 0,
        overallDisagreed: 0,
      }, // area not fully checked
    },
    444: {
      id: 444,
      name: 'Bedroom',
      itemsCount: {
        total: 0,
        overallChecked: 0,
        overallAgreed: 0,
        overallDisagreed: 0,
      }, // area not checked
    },
  };
  const testConditions = { 11: { id: 11 } };
  const testProfile = { id: 123 };
  const testReports = {
    11: {
      id: 11,
      propertyConditionId: 11,
      areas: [111, 222],
      status: INSPECTION_STATUS.PENDING_AGENCY,
      typeOf: INSPECTION_TYPE.INGOING,
    },
    22: {
      id: 22,
      areas: [111, 222, 333],
      status: INSPECTION_STATUS.PENDING_TENANT,
      typeOf: INSPECTION_TYPE.INGOING,
    },
    33: {
      id: 33,
      propertyConditionId: 11,
      areas: [111, 222, 444],
      status: INSPECTION_STATUS.PENDING_AGENCY,
      typeOf: INSPECTION_TYPE.ROUTINE,
    },
    44: {
      id: 44,
      areas: [111, 222, 444],
      tenant: { id: testProfile.id },
      status: INSPECTION_STATUS.PENDING_TENANT,
      typeOf: INSPECTION_TYPE.INGOING,
    },
  };
  const testProperties = { 1: { id: 1 } };
  const testStoreState = {
    inspection: {
      areas: { data: testAreas },
      conditions: { data: testConditions },
      items: { data: testAreaItems },
      properties: { data: testProperties },
      reports: { data: testReports },
    },
  };

  it('should fetch report', async () => {
    const testMatch = { params: { reportId: 11 } };

    const [{ container }, store] = renderWithStore(
      <InspectionReport match={testMatch} property={testProperties[1]} />,
      { initialState: getStateAsManager(testStoreState) }
    );

    expect(queryByTestId(container, 'report-area-actions')).toBeTruthy();
    expect(queryByTestId(container, 'inspection-area-list')).toBeTruthy();

    await waitFor(() => {
      expect(store.actions).toContainEqual(
        fetchInspectionReport({ reportId: 11 })
      );
    });
  });

  describe('as a manager', () => {
    describe('on a completed pending_agency ingoing report', () => {
      const testReportId = 11;
      const testMatch = { params: { reportId: testReportId } };

      it('should show correct areas and show actions', () => {
        const [{ container }] = renderWithStore(
          <InspectionReport match={testMatch} property={testProperties[1]} />,
          { initialState: getStateAsManager(testStoreState, testProfile) }
        );

        const areas = getAllByTestId(container, 'inspection-area-list-item');
        expect(areas.length).toEqual(2);

        expect(
          getByTestId(areas[0], 'inspection-area-name').textContent
        ).toEqual(testAreas[111].name);
        expect(queryByTestId(areas[0], 'content-progress-bar')).toBeTruthy();
        expect(queryByTestId(areas[0], 'badge-checked')).toBeFalsy();
        expect(queryByTestId(areas[0], 'dropdown-toggle')).toBeTruthy();
      });

      it('should be able to create an area', async () => {
        const testAreaName = 'Basement';

        const [{ container }, store] = renderWithStore(
          <InspectionReport match={testMatch} property={testProperties[1]} />,
          { initialState: getStateAsManager(testStoreState, testProfile) }
        );

        userEvent.click(getByTestId(container, 'button-area-item-create'));

        const confirmModal = screen.getByTestId('modal-create-area');

        await userEvent.type(
          getByTestId(confirmModal, 'form-field-name'),
          testAreaName
        );

        userEvent.click(getByTestId(confirmModal, 'form-submit-btn'));

        await waitFor(() => {
          expect(store.actions).toContainEqual(
            createArea({
              name: testAreaName,
              propertyConditionId:
                testReports[testReportId].propertyConditionId,
              reportId: testReports[testReportId].id,
            })
          );
        });
      });

      it('should be able to delete an area', async () => {
        const [{ container }, store] = renderWithStore(
          <InspectionReport match={testMatch} property={testProperties[1]} />,
          { initialState: getStateAsManager(testStoreState, testProfile) }
        );

        const listItem = getAllByTestId(
          container,
          'inspection-area-list-item'
        )[0]; // select first area to delete

        userEvent.click(getByTestId(listItem, 'dropdown-toggle'));
        userEvent.click(getByTestId(listItem, 'dropdown-item-0'));

        const confirmModal = screen.getByTestId('modal-delete-area');
        userEvent.click(getByTestId(confirmModal, 'form-submit-btn'));

        await waitFor(() => {
          expect(store.actions).toContainEqual(
            deleteArea({
              areaId: testReports[testReportId].areas[0],
              propertyConditionId:
                testReports[testReportId].propertyConditionId,
              reportId: testReports[testReportId].id,
            })
          );
        });
      });

      it('should show signature module', () => {
        const [{ container }] = renderWithStore(
          <InspectionReport match={testMatch} property={testProperties[1]} />,
          { initialState: getStateAsManager(testStoreState, testProfile) }
        );

        expect(queryByTestId(container, 'signature-module')).toBeTruthy();
        const button = getByTestId(container, 'button-signature-module');
        expect(button.textContent).toEqual('Sign Report');
        userEvent.click(button);

        const confirmModal = screen.getByTestId('modal-signature-module');
        expect(queryByTestId(confirmModal, 'signature-canvas')).toBeTruthy();
      });
    });

    describe('on an incomplete pending_agency ingoing report', () => {
      const testReportId = 22;
      const testMatch = { params: { reportId: testReportId } };

      it('should hide create/delete actions', () => {
        const [{ container }] = renderWithStore(
          <InspectionReport match={testMatch} property={testProperties[1]} />,
          { initialState: getStateAsManager(testStoreState, testProfile) }
        );

        expect(queryByTestId(container, 'button-area-item-create')).toBeFalsy();

        const listItem = getAllByTestId(
          container,
          'inspection-area-list-item'
        )[0]; // select first area
        expect(queryByTestId(listItem, 'dropdown-toggle')).toBeFalsy();
      });
    });

    describe('on a completed pending_agency routine inspection', () => {
      const testReportId = 33;
      const testMatch = { params: { reportId: testReportId } };

      it('should show correct areas and hide actions', () => {
        const [{ container }] = renderWithStore(
          <InspectionReport match={testMatch} property={testProperties[1]} />,
          { initialState: getStateAsManager(testStoreState, testProfile) }
        );

        expect(
          queryByTestId(container, 'button-area-item-create')
        ).toBeTruthy();

        const areas = getAllByTestId(container, 'inspection-area-list-item');
        expect(areas.length).toEqual(3);

        expect(
          getByTestId(areas[0], 'inspection-area-name').textContent
        ).toEqual(testAreas[111].name);
        expect(queryByTestId(areas[0], 'content-progress-bar')).toBeFalsy();
        expect(getByTestId(areas[0], 'badge-checked').textContent).toEqual(
          `${testAreas[111].itemsCount.overallChecked} items checked`
        );
        expect(queryByTestId(areas[0], 'dropdown-toggle')).toBeTruthy();
      });

      it('should show signature module', () => {
        const [{ container }] = renderWithStore(
          <InspectionReport match={testMatch} property={testProperties[1]} />,
          { initialState: getStateAsManager(testStoreState, testProfile) }
        );

        expect(queryByTestId(container, 'signature-module')).toBeTruthy();
        const button = getByTestId(container, 'button-signature-module');
        expect(button.textContent).toEqual('Complete Report');
        userEvent.click(button);

        const confirmModal = screen.getByTestId('modal-signature-module');
        expect(queryByTestId(confirmModal, 'signature-canvas')).toBeTruthy();
      });
    });

    describe('on a pending_tenant ingoing report', () => {
      const testReportId = 44;
      const testMatch = { params: { reportId: testReportId } };

      it('should show correct areas and hide actions', () => {
        const [{ container }] = renderWithStore(
          <InspectionReport match={testMatch} property={testProperties[1]} />,
          { initialState: getStateAsManager(testStoreState, testProfile) }
        );

        expect(queryByTestId(container, 'button-area-item-create')).toBeFalsy();

        const areas = getAllByTestId(container, 'inspection-area-list-item');
        expect(areas.length).toEqual(2);

        expect(
          getByTestId(areas[0], 'inspection-area-name').textContent
        ).toEqual(testAreas[111].name);
        expect(queryByTestId(areas[0], 'content-progress-bar')).toBeTruthy();
        expect(queryByTestId(areas[0], 'badge-checked')).toBeFalsy();
        expect(queryByTestId(areas[0], 'dropdown-toggle')).toBeFalsy();
      });

      it('should send report to tenant', async () => {
        const [{ container }, store] = renderWithStore(
          <InspectionReport match={testMatch} property={testProperties[1]} />,
          { initialState: getStateAsManager(testStoreState, testProfile) }
        );

        userEvent.click(getByTestId(container, 'button-send-tenant'));

        const confirmModal = screen.getByTestId('modal-confirm');
        userEvent.click(getByTestId(confirmModal, 'form-submit-btn'));

        await waitFor(() => {
          expect(store.actions).toContainEqual(
            sendInspectionReportToTenant({
              reportId: testReports[testReportId].id,
            })
          );
        });
      });
    });
  });

  describe('as a tenant', () => {
    describe('on a completed pending_tenant ingoing report', () => {
      const testReportId = 44;
      const testMatch = { params: { reportId: testReportId } };

      it('should show correct areas and hide actions', () => {
        const [{ container }] = renderWithStore(
          <InspectionReport match={testMatch} property={testProperties[1]} />,
          { initialState: getStateAsPrimaryTenant(testStoreState, testProfile) }
        );

        expect(queryByTestId(container, 'button-area-item-create')).toBeFalsy();

        const areas = getAllByTestId(container, 'inspection-area-list-item');
        expect(areas.length).toEqual(2);

        expect(
          getByTestId(areas[0], 'inspection-area-name').textContent
        ).toEqual(testAreas[111].name);
        expect(queryByTestId(areas[0], 'content-progress-bar')).toBeTruthy();
        expect(queryByTestId(areas[0], 'badge-checked')).toBeFalsy();
        expect(queryByTestId(areas[0], 'dropdown-toggle')).toBeFalsy();
      });

      it('should show signature module', () => {
        const [{ container }] = renderWithStore(
          <InspectionReport match={testMatch} property={testProperties[1]} />,
          { initialState: getStateAsPrimaryTenant(testStoreState, testProfile) }
        );

        expect(queryByTestId(container, 'signature-module')).toBeTruthy();
        const button = getByTestId(container, 'button-signature-module');
        expect(button.textContent).toEqual('Complete Report');
        userEvent.click(button);

        const confirmModal = screen.getByTestId('modal-signature-module');
        expect(queryByTestId(confirmModal, 'signature-canvas')).toBeTruthy();
      });
    });
  });
});
