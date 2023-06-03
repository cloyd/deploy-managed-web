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

import { createArea, deleteArea, updateArea } from '../../../redux/inspection';
import {
  getStateAsManager,
  getStateAsPrimaryOwner,
  getStateAsPrimaryTenant,
} from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { InspectionAreaList } from '../AreaList';

describe('InspectionAreaList', () => {
  const testAreaItems = {
    23: {
      id: 23,
      name: 'Door',
      isClean: null,
      isPotentialBondClaim: null,
      isUndamaged: null,
      isWorkNeeded: null,
      isWorking: null,
    },
    45: {
      id: 45,
      name: 'Walls',
      isClean: null,
      isPotentialBondClaim: null,
      isUndamaged: null,
      isWorkNeeded: null,
      isWorking: null,
    },
  };
  const testAreas = {
    111: { id: 111, name: 'Entrance/Hall', position: 1 },
    222: { id: 222, name: 'Living Room', items: [23, 45], position: 2 },
    333: { id: 333, name: 'Bedroom', position: 3 },
    444: { id: 444, name: 'Bedroom', position: 4 },
  };
  const testConditions = {
    11: { id: 11, areas: [111, 222, 333, 444] },
  };
  const testReports = {
    11: { id: 11, areas: [111, 222, 333, 444], propertyConditionId: 11 },
  };
  const testProperties = {
    1: { id: 1, propertyConditionId: 11 },
  };
  const testStoreState = {
    inspection: {
      areas: { data: testAreas },
      conditions: { data: testConditions },
      items: { data: testAreaItems },
      properties: { data: testProperties },
      reports: { data: testReports },
    },
  };

  it('should create an area', async () => {
    const testAreaName = 'Basement';

    const [{ container }, store] = renderWithStore(
      <InspectionAreaList hasActions={true} report={testReports[11]} />,
      { initialState: getStateAsManager(testStoreState) }
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
          propertyConditionId: testConditions[11].id,
          reportId: testReports[11].id,
        })
      );
    });
  });

  it('should delete an area', async () => {
    const [{ container }, store] = renderWithStore(
      <InspectionAreaList hasActions={true} report={testReports[11]} />,
      { initialState: getStateAsManager(testStoreState) }
    );

    const listItem = getAllByTestId(container, 'inspection-area-list-item')[0]; // select first area to delete

    userEvent.click(getByTestId(listItem, 'dropdown-toggle'));
    userEvent.click(getByTestId(listItem, 'dropdown-item-0'));

    const confirmModal = screen.getByTestId('modal-delete-area');
    userEvent.click(getByTestId(confirmModal, 'form-submit-btn'));

    await waitFor(() => {
      expect(store.actions).toContainEqual(
        deleteArea({
          areaId: testConditions[11].areas[0],
          propertyConditionId: testConditions[11].id,
          reportId: testReports[11].id,
        })
      );
    });
  });

  describe('update area positions', () => {
    it('should show correct elements', () => {
      const [{ container }] = renderWithStore(
        <InspectionAreaList hasActions={true} report={testReports[11]} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      const button = getByTestId(container, 'button-sort');
      expect(button.textContent).toEqual('Sort Areas');
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
        <InspectionAreaList hasActions={true} report={testReports[11]} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      userEvent.click(getByTestId(container, 'button-sort'));

      const sortableItem = getAllByTestId(container, 'sortable-item')[1];
      userEvent.click(getByTestId(sortableItem, 'button-top'));

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateArea({
            areaId: testAreas[222].id,
            position: 1,
            propertyConditionId: testConditions[11].id,
            reportId: testReports[11].id,
          })
        );
      });
    });

    it('should element to bottom of list', async () => {
      const [{ container }, store] = renderWithStore(
        <InspectionAreaList hasActions={true} report={testReports[11]} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      userEvent.click(getByTestId(container, 'button-sort'));

      const sortableItem = getAllByTestId(container, 'sortable-item')[1];
      userEvent.click(getByTestId(sortableItem, 'button-bottom'));

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateArea({
            areaId: testAreas[222].id,
            position: 4,
            propertyConditionId: testConditions[11].id,
            reportId: testReports[11].id,
          })
        );
      });
    });

    it('should element up one', async () => {
      const [{ container }, store] = renderWithStore(
        <InspectionAreaList hasActions={true} report={testReports[11]} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      userEvent.click(getByTestId(container, 'button-sort'));

      const sortableItem = getAllByTestId(container, 'sortable-item')[1];
      userEvent.click(getByTestId(sortableItem, 'button-up'));

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateArea({
            areaId: testAreas[222].id,
            position: 1,
            propertyConditionId: testConditions[11].id,
            reportId: testReports[11].id,
          })
        );
      });
    });

    it('should element down one', async () => {
      const [{ container }, store] = renderWithStore(
        <InspectionAreaList hasActions={true} report={testReports[11]} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      userEvent.click(getByTestId(container, 'button-sort'));

      const sortableItem = getAllByTestId(container, 'sortable-item')[1];
      userEvent.click(getByTestId(sortableItem, 'button-down'));

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateArea({
            areaId: testAreas[222].id,
            position: 3,
            propertyConditionId: testConditions[11].id,
            reportId: testReports[11].id,
          })
        );
      });
    });
  });

  it('should hide actions if hasActions is false', () => {
    const [{ container }] = renderWithStore(
      <InspectionAreaList hasActions={false} />,
      { initialState: getStateAsManager(testStoreState) }
    );

    expect(queryByTestId(container, 'button-sort')).toBeFalsy();
    expect(
      queryAllByTestId(container, 'button-destroy-area-item').length
    ).toEqual(0);
    expect(queryByTestId(container, 'button-add-area-item')).toBeFalsy();
  });

  it('should hide actions if owner', () => {
    const [{ container }] = renderWithStore(
      <InspectionAreaList hasActions={false} />,
      { initialState: getStateAsPrimaryOwner(testStoreState) }
    );

    expect(queryByTestId(container, 'button-sort')).toBeFalsy();
    expect(
      queryAllByTestId(container, 'button-destroy-area-item').length
    ).toEqual(0);
    expect(queryByTestId(container, 'button-add-area-item')).toBeFalsy();
  });

  it('should hide actions if tenant', () => {
    const [{ container }] = renderWithStore(
      <InspectionAreaList hasActions={false} />,
      { initialState: getStateAsPrimaryTenant(testStoreState) }
    );

    expect(queryByTestId(container, 'button-sort')).toBeFalsy();
    expect(
      queryAllByTestId(container, 'button-destroy-area-item').length
    ).toEqual(0);
    expect(queryByTestId(container, 'button-add-area-item')).toBeFalsy();
  });
});
