import { waitFor } from '@testing-library/dom';
import {
  getAllByTestId,
  getByTestId,
  queryAllByTestId,
  queryByTestId,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {
  INSPECTION_STATUS,
  createAreaItem,
  deleteAreaItem,
  fetchInspectionArea,
  updateArea,
  updateAreaItem,
} from '../../../redux/inspection';
import {
  getStateAsManager,
  getStateAsPrimaryTenant,
} from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { InspectionArea } from '../Area';

describe('InspectionArea', () => {
  const testPermissions = {
    action: {
      canEditArea: true,
      canEditAreaItem: true,
      canAgreeReportItem: true,
      canCheckReportItem: true,
      canCommentOnArea: true,
      canCompleteReport: true,
      canDeleteReport: true,
      canMarkNeedsWork: true,
      canMarkPotentialBondClaim: true,
      canSendToTenant: true,
      canSignReport: true,
      canStartReport: true,
      canUploadPendingTenant: true,
      canUploadReport: true,
      canViewReport: true,
    },
    status: {},
    type: {},
  };

  const testAreaId = 222;
  const defaultItemValues = {
    isClean: true,
    isPotentialBondClaim: null,
    isUndamaged: true,
    isWorkNeeded: null,
    isWorking: true,
  };
  const testAreaItems = {
    23: {
      ...defaultItemValues,
      id: 23,
      name: 'Door',
      manager: { isChecked: null },
      position: 1,
    },
    45: {
      ...defaultItemValues,
      id: 45,
      name: 'Walls',
      manager: { note: 'old note', isChecked: null },
      position: 2,
    },
    67: {
      ...defaultItemValues,
      id: 67,
      name: 'Carpets',
      position: 3,
    },
    89: {
      ...defaultItemValues,
      id: 89,
      name: 'Windows',
      position: 4,
    },
  };
  const testAreas = {
    111: { id: 111, name: 'Entrance/Hall' },
    222: {
      id: 222,
      name: 'Living Room',
      items: [23, 45, 67, 89],
      manager: { note: 'Needs some cleaning' },
    },
  };
  const testReports = {
    11: { id: 11, areas: [111, 222], status: INSPECTION_STATUS.PENDING_AGENCY },
    22: { id: 22, areas: [111, 222], status: INSPECTION_STATUS.PENDING_TENANT },
  };
  const testProperties = { 1: { id: 1 } };
  const testStoreState = {
    inspection: {
      areas: { data: testAreas },
      items: { data: testAreaItems },
      properties: { data: testProperties },
      reports: { data: testReports },
    },
  };

  it('should fetch area', async () => {
    const [{ container }, store] = renderWithStore(
      <InspectionArea
        areaId={testAreaId}
        isTestMode={true}
        permissions={testPermissions}
        property={testProperties[1]}
      />,
      { initialState: getStateAsManager(testStoreState) }
    );

    expect(queryAllByTestId(container, 'inspection-area-item').length).toEqual(
      4
    );

    await waitFor(() => {
      expect(store.actions).toContainEqual(
        fetchInspectionArea({ areaId: testAreaId })
      );
    });
  });

  it('should update area name', async () => {
    const testProfile = { id: 123 };
    const testAreaName = 'Attic';

    const [{ container }, store] = renderWithStore(
      <InspectionArea
        areaId={testAreaId}
        isTestMode={true}
        permissions={testPermissions}
        property={testProperties[1]}
        reportId={testReports[11].id}
      />,
      { initialState: getStateAsManager(testStoreState, testProfile) }
    );

    const header = getByTestId(container, 'inspection-header');
    userEvent.click(getByTestId(header, 'button-update-name'));

    const form = getByTestId(header, 'form-inspection-field-name');
    await userEvent.type(
      getByTestId(form, 'form-field-name'),
      `{selectall}{backspace}${testAreaName}`
    );
    userEvent.click(getByTestId(form, 'form-submit-btn'));

    await waitFor(() => {
      expect(store.actions).toContainEqual(
        updateArea({
          areaId: testAreaId,
          reportId: testReports[11].id,
          name: testAreaName,
        })
      );
    });
  });

  it('should update an area', async () => {
    const testProfile = { id: 123 };
    const testFormParams = { note: 'It is clean!' };

    const [{ container }, store] = renderWithStore(
      <InspectionArea
        areaId={testAreaId}
        isTestMode={true}
        permissions={testPermissions}
        property={testProperties[1]}
        reportId={testReports[11].id}
      />,
      { initialState: getStateAsManager(testStoreState, testProfile) }
    );

    const area = getByTestId(container, 'inspection-area-overview');
    expect(queryByTestId(area, 'form-inspection-area-item')).toBeFalsy();

    userEvent.click(getByTestId(area, 'button-area-item-toggle'));

    const form = getByTestId(area, 'form-inspection-area-overview');

    await userEvent.type(
      getByTestId(form, 'form-field-note'),
      `{selectall}{backspace}${testFormParams.note}`
    );

    userEvent.click(getByTestId(form, 'form-submit-btn'));

    await waitFor(() => {
      expect(store.actions).toContainEqual(
        updateArea({
          areaId: testAreaId,
          reportId: testReports[11].id,
          manager: {
            id: testProfile.id,
            isChecked: true,
            note: testFormParams.note,
          },
        })
      );
    });
  });

  it('should create an area item', async () => {
    const testAreaItemName = 'Carpet';

    const [{ container }, store] = renderWithStore(
      <InspectionArea
        areaId={testAreaId}
        isTestMode={true}
        permissions={testPermissions}
        property={testProperties[1]}
        reportId={testReports[11].id}
      />,
      { initialState: getStateAsManager(testStoreState) }
    );

    userEvent.click(getByTestId(container, 'button-add-area-item'));

    await userEvent.type(
      getByTestId(container, 'form-field-name'),
      testAreaItemName
    );

    userEvent.click(getByTestId(container, 'form-submit-btn'));

    await waitFor(() => {
      expect(store.actions).toContainEqual(
        createAreaItem({
          areaId: testAreaId,
          name: testAreaItemName,
          reportId: testReports[11].id,
        })
      );
    });
  });

  it('should delete an area item', async () => {
    const [{ container }, store] = renderWithStore(
      <InspectionArea
        areaId={testAreaId}
        isTestMode={true}
        permissions={testPermissions}
        property={testProperties[1]}
        reportId={testReports[11].id}
      />,
      { initialState: getStateAsManager(testStoreState) }
    );

    const areaItem = getAllByTestId(container, 'inspection-area-item')[0]; // select first area item
    userEvent.click(getByTestId(areaItem, 'button-destroy-area-item'));

    const confirmModal = screen.getByTestId('modal-confirm');
    userEvent.click(getByTestId(confirmModal, 'form-submit-btn'));

    await waitFor(() => {
      expect(store.actions).toContainEqual(
        deleteAreaItem({
          areaItemId: testAreas[testAreaId].items[0],
          reportId: testReports[11].id,
        })
      );
    });
  });

  it('should mark area item has potential bond claim', async () => {
    const [{ container }, store] = renderWithStore(
      <InspectionArea
        areaId={testAreaId}
        isTestMode={true}
        permissions={testPermissions}
        property={testProperties[1]}
        reportId={testReports[11].id}
      />,
      { initialState: getStateAsManager(testStoreState) }
    );

    const areaItem = getAllByTestId(container, 'inspection-area-item')[1]; // select second area item
    userEvent.click(getByTestId(areaItem, 'checkbox-isPotentialBondClaim'));

    await waitFor(() => {
      expect(store.actions).toContainEqual(
        updateAreaItem({
          areaItemId: testAreas[testAreaId].items[1],
          isPotentialBondClaim: true,
          reportId: testReports[11].id,
        })
      );
    });
  });

  it('should mark area item has work needed', async () => {
    const [{ container }, store] = renderWithStore(
      <InspectionArea
        areaId={testAreaId}
        isTestMode={true}
        permissions={testPermissions}
        property={testProperties[1]}
        reportId={testReports[11].id}
      />,
      { initialState: getStateAsManager(testStoreState) }
    );

    const areaItem = getAllByTestId(container, 'inspection-area-item')[1]; // select second area item
    userEvent.click(getByTestId(areaItem, 'checkbox-isWorkNeeded'));

    await waitFor(() => {
      expect(store.actions).toContainEqual(
        updateAreaItem({
          areaItemId: testAreas[testAreaId].items[1],
          isWorkNeeded: true,
          reportId: testReports[11].id,
        })
      );
    });
  });

  describe('update area positions', () => {
    it('should show correct elements', () => {
      const [{ container }] = renderWithStore(
        <InspectionArea
          areaId={testAreaId}
          isTestMode={true}
          permissions={testPermissions}
          property={testProperties[1]}
          reportId={testReports[11].id}
        />,
        { initialState: getStateAsManager(testStoreState) }
      );

      const button = getByTestId(container, 'button-sort');
      expect(button.textContent).toEqual('Sort Items');
      userEvent.click(button);
      expect(queryByTestId(container, 'card-sortable-list')).toBeTruthy();

      const sortableItems = getAllByTestId(container, 'sortable-item');
      expect(sortableItems.length).toEqual(4);
      expect(queryAllByTestId(container, 'button-top').length).toEqual(3);
      expect(queryAllByTestId(container, 'button-bottom').length).toEqual(3);
      expect(queryAllByTestId(container, 'button-up').length).toEqual(3);
      expect(queryAllByTestId(container, 'button-down').length).toEqual(3);
    });

    it('should element to top of list', async () => {
      const [{ container }, store] = renderWithStore(
        <InspectionArea
          areaId={testAreaId}
          isTestMode={true}
          permissions={testPermissions}
          property={testProperties[1]}
          reportId={testReports[11].id}
        />,
        { initialState: getStateAsManager(testStoreState) }
      );

      userEvent.click(getByTestId(container, 'button-sort'));

      const sortableItem = getAllByTestId(container, 'sortable-item')[1];
      userEvent.click(getByTestId(sortableItem, 'button-top'));

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateAreaItem({
            areaId: testAreaId,
            areaItemId: testAreaItems[45].id,
            position: 1,
            reportId: testReports[11].id,
          })
        );
      });
    });

    it('should element to bottom of list', async () => {
      const [{ container }, store] = renderWithStore(
        <InspectionArea
          areaId={testAreaId}
          isTestMode={true}
          permissions={testPermissions}
          property={testProperties[1]}
          reportId={testReports[11].id}
        />,
        { initialState: getStateAsManager(testStoreState) }
      );

      userEvent.click(getByTestId(container, 'button-sort'));

      const sortableItem = getAllByTestId(container, 'sortable-item')[1];
      userEvent.click(getByTestId(sortableItem, 'button-bottom'));

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateAreaItem({
            areaId: testAreaId,
            areaItemId: testAreaItems[45].id,
            position: 4,
            reportId: testReports[11].id,
          })
        );
      });
    });

    it('should element up', async () => {
      const [{ container }, store] = renderWithStore(
        <InspectionArea
          areaId={testAreaId}
          isTestMode={true}
          permissions={testPermissions}
          property={testProperties[1]}
          reportId={testReports[11].id}
        />,
        { initialState: getStateAsManager(testStoreState) }
      );

      userEvent.click(getByTestId(container, 'button-sort'));

      const sortableItem = getAllByTestId(container, 'sortable-item')[1];
      userEvent.click(getByTestId(sortableItem, 'button-up'));

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateAreaItem({
            areaId: testAreaId,
            areaItemId: testAreaItems[45].id,
            position: 1,
            reportId: testReports[11].id,
          })
        );
      });
    });

    it('should element down', async () => {
      const [{ container }, store] = renderWithStore(
        <InspectionArea
          areaId={testAreaId}
          isTestMode={true}
          permissions={testPermissions}
          property={testProperties[1]}
          reportId={testReports[11].id}
        />,
        { initialState: getStateAsManager(testStoreState) }
      );

      userEvent.click(getByTestId(container, 'button-sort'));

      const sortableItem = getAllByTestId(container, 'sortable-item')[1];
      userEvent.click(getByTestId(sortableItem, 'button-down'));

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateAreaItem({
            areaId: testAreaId,
            areaItemId: testAreaItems[45].id,
            position: 3,
            reportId: testReports[11].id,
          })
        );
      });
    });
  });

  describe('as a manager', () => {
    it('should check off an area', async () => {
      const [{ container }, store] = renderWithStore(
        <InspectionArea
          areaId={testAreaId}
          isTestMode={true}
          permissions={testPermissions}
          property={testProperties[1]}
          reportId={testReports[11].id}
        />,
        { initialState: getStateAsManager(testStoreState) }
      );

      const areaItem = getByTestId(container, 'inspection-area-overview');
      userEvent.click(getByTestId(areaItem, 'button-manager-check'));

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateArea({
            areaId: testAreaId,
            manager: { isChecked: true },
            reportId: testReports[11].id,
          })
        );
      });
    });

    it('should check off an area item', async () => {
      const [{ container }, store] = renderWithStore(
        <InspectionArea
          areaId={testAreaId}
          isTestMode={true}
          permissions={testPermissions}
          property={testProperties[1]}
          reportId={testReports[11].id}
        />,
        { initialState: getStateAsManager(testStoreState) }
      );

      const areaItem = getAllByTestId(container, 'inspection-area-item')[0]; // select first area item
      userEvent.click(getByTestId(areaItem, 'button-manager-check'));

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateAreaItem({
            areaItemId: testAreas[testAreaId].items[0],
            manager: { isChecked: true },
            reportId: testReports[11].id,
          })
        );
      });
    });

    it('should update an area item', async () => {
      const testProfile = { id: 123 };
      const testFormParams = { note: 'new note' };

      const [{ container }, store] = renderWithStore(
        <InspectionArea
          areaId={testAreaId}
          isTestMode={true}
          permissions={testPermissions}
          property={testProperties[1]}
          reportId={testReports[11].id}
        />,
        { initialState: getStateAsManager(testStoreState, testProfile) }
      );

      const areaItem = getAllByTestId(container, 'inspection-area-item')[1]; // select second area item
      expect(queryByTestId(areaItem, 'form-inspection-area-item')).toBeFalsy();

      userEvent.click(getByTestId(areaItem, 'button-area-item-toggle'));

      const form = getByTestId(areaItem, 'form-inspection-area-item');

      await userEvent.type(
        getByTestId(form, 'form-field-note'),
        `{selectall}{backspace}${testFormParams.note}`
      );

      userEvent.click(getByTestId(form, 'form-submit-btn'));

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateAreaItem({
            areaItemId: testAreas[testAreaId].items[1],
            reportId: testReports[11].id,
            manager: {
              id: testProfile.id,
              isChecked: true,
              note: testFormParams.note,
            },
            isClean: true,
            isUndamaged: true,
            isWorking: true,
          })
        );
      });
    });
  });

  describe('as a tenant', () => {
    it('should agree with an area item', async () => {
      const [{ container }, store] = renderWithStore(
        <InspectionArea
          areaId={testAreaId}
          isTestMode={true}
          permissions={testPermissions}
          property={testProperties[1]}
          reportId={testReports[22].id}
        />,
        { initialState: getStateAsPrimaryTenant(testStoreState) }
      );

      const areaItem = getAllByTestId(container, 'inspection-area-item')[0]; // select first area item
      userEvent.click(getByTestId(areaItem, 'button-tenant-check-yes'));

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateAreaItem({
            areaItemId: testAreas[testAreaId].items[0],
            reportId: testReports[22].id,
            tenant: { isAgreed: true },
          })
        );
      });
    });

    it('should disagree with an area item and provide reason', async () => {
      const testProfile = { id: 123 };
      const testFormParams = {
        note: 'hello world!',
      };

      const [{ container }, store] = renderWithStore(
        <InspectionArea
          areaId={testAreaId}
          isTestMode={true}
          permissions={testPermissions}
          property={testProperties[1]}
          reportId={testReports[22].id}
        />,
        { initialState: getStateAsPrimaryTenant(testStoreState, testProfile) }
      );

      const areaItem = getAllByTestId(container, 'inspection-area-item')[0]; // select first area item
      expect(queryByTestId(areaItem, 'form-inspection-area-item')).toBeFalsy();

      userEvent.click(getByTestId(areaItem, 'button-tenant-check-no'));

      const form = getByTestId(areaItem, 'form-inspection-area-item');

      await userEvent.type(
        getByTestId(form, 'form-field-note'),
        testFormParams.note
      );

      userEvent.click(getByTestId(form, 'form-submit-btn'));

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateAreaItem({
            areaItemId: testAreas[testAreaId].items[0],
            reportId: testReports[22].id,
            tenant: {
              id: testProfile.id,
              isAgreed: false,
              isChecked: true,
              note: testFormParams.note,
            },
          })
        );
      });
    });
  });
});
