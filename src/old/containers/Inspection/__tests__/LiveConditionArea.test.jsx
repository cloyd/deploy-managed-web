import { waitFor } from '@testing-library/dom';
import { queryAllByTestId, queryByTestId } from '@testing-library/react';
import React from 'react';

import { fetchInspectionPropertyCondition } from '../../../redux/inspection';
import { getStateAsManager } from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { InspectionLiveConditionArea } from '../LiveConditionArea';

describe('InspectionLiveConditionArea', () => {
  const testAreaItems = {
    12: {
      id: 12,
      name: 'Door',
      isClean: null,
      isPotentialBondClaim: null,
      isUndamaged: null,
      isWorkNeeded: null,
      isWorking: null,
      manager: { isChecked: true },
    },
    34: {
      id: 34,
      name: 'Walls',
      isClean: null,
      isPotentialBondClaim: null,
      isUndamaged: null,
      isWorkNeeded: null,
      isWorking: null,
      manager: { isChecked: true },
    },
    56: {
      id: 56,
      name: 'Carpets',
      isClean: null,
      isPotentialBondClaim: null,
      isUndamaged: null,
      isWorkNeeded: null,
      isWorking: null,
      manager: { isChecked: false },
    },
  };
  const testAreas = {
    111: {
      id: 111,
      name: 'Entrance/Hall',
      items: [12, 34],
      manager: { isChecked: false },
    },
    222: {
      id: 222,
      name: 'Living Room',
      items: [12, 34, 56],
      manager: { isChecked: true },
    },
    333: { id: 333, name: 'Bedroom' },
  };
  const testConditions = {
    11: { id: 11, areas: [111, 222, 333] },
    22: { id: 22, updateBlockedByReportId: 9, areas: [111, 222] },
  };
  const testProperties = {
    1: { id: 1, propertyConditionId: 11 },
    2: { id: 2, propertyConditionId: 22 },
  };
  const testStoreState = {
    inspection: {
      areas: { data: testAreas },
      conditions: { data: testConditions },
      items: { data: testAreaItems },
      properties: { data: testProperties },
    },
  };

  it('should fetch property condition', async () => {
    const testMatch = { params: { areaId: 222 } };
    const [{ container }, store] = renderWithStore(
      <InspectionLiveConditionArea
        match={testMatch}
        property={testProperties[1]}
      />,
      { initialState: getStateAsManager(testStoreState) }
    );

    expect(queryByTestId(container, 'inspection-area')).toBeTruthy();

    await waitFor(() => {
      expect(store.actions).toContainEqual(
        fetchInspectionPropertyCondition({ propertyId: testProperties[1].id })
      );
    });
  });

  it('should show elements when not blocked by an inspection', () => {
    const testMatch = { params: { areaId: 222 } };
    const [{ container }] = renderWithStore(
      <InspectionLiveConditionArea
        match={testMatch}
        property={testProperties[1]}
      />,
      { initialState: getStateAsManager(testStoreState) }
    );

    expect(
      queryByTestId(container, 'alert-inspection-in-progress')
    ).toBeFalsy();
    expect(
      queryByTestId(container, 'inspection-area-name').textContent
    ).toEqual('Living Room');
    expect(queryByTestId(container, 'link-prev-area').href).toContain('/111');
    expect(queryByTestId(container, 'link-next-area').href).toContain('/333');

    expect(queryByTestId(container, 'inspection-area-overview')).toBeTruthy();
    expect(queryAllByTestId(container, 'inspection-area-item').length).toEqual(
      3
    );

    expect(
      queryAllByTestId(container, 'button-destroy-area-item').length
    ).toEqual(3);
    expect(queryByTestId(container, 'button-add-area-item')).toBeTruthy();
  });

  it('should show correct elements when blocked by a report and has unchecked items', () => {
    const testMatch = { params: { areaId: 222 } };
    const [{ container }] = renderWithStore(
      <InspectionLiveConditionArea
        match={testMatch}
        property={testProperties[2]}
      />,
      { initialState: getStateAsManager(testStoreState) }
    );

    expect(
      queryByTestId(container, 'alert-inspection-in-progress')
    ).toBeTruthy();
    expect(queryByTestId(container, 'link-prev-area').href).toContain('/111');
    expect(queryByTestId(container, 'link-next-area')).toBeFalsy();

    expect(queryByTestId(container, 'inspection-area-overview')).toBeTruthy();
    expect(queryAllByTestId(container, 'inspection-area-item').length).toEqual(
      3
    );

    expect(
      queryAllByTestId(container, 'button-destroy-area-item').length
    ).toEqual(0);
    expect(queryByTestId(container, 'button-add-area-item')).toBeFalsy();
  });
});
