import { waitFor } from '@testing-library/dom';
import { queryAllByTestId, queryByTestId } from '@testing-library/react';
import React from 'react';

import { fetchInspectionPropertyCondition } from '../../../redux/inspection';
import {
  getStateAsManager,
  getStateAsPrimaryOwner,
  getStateAsPrimaryTenant,
  getStateAsSecondaryOwner,
  getStateAsSecondaryTenant,
} from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { InspectionOverview } from '../Overview';

describe('InspectionOverview', () => {
  const testAreas = {
    111: { id: 111, name: 'Entrance/Hall' },
    222: { id: 222, name: 'Living Room' },
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
      properties: { data: testProperties },
    },
  };

  it('should fetch property condition', async () => {
    const [{ container }, store] = renderWithStore(
      <InspectionOverview property={testProperties[1]} />,
      { initialState: getStateAsManager(testStoreState) }
    );

    expect(queryByTestId(container, 'inspection-report-list')).toBeTruthy();
    expect(
      queryByTestId(container, 'alert-inspection-in-progress')
    ).toBeFalsy();
    expect(
      queryAllByTestId(container, 'area-list-item-actions').length
    ).toEqual(3);

    await waitFor(() => {
      expect(store.actions).toContainEqual(
        fetchInspectionPropertyCondition({ propertyId: testProperties[1].id })
      );
    });
  });

  it('should show inspection in progress alert if blocked by a report', async () => {
    const [{ container }] = renderWithStore(
      <InspectionOverview property={testProperties[2]} />,
      { initialState: getStateAsManager(testStoreState) }
    );

    expect(
      queryByTestId(container, 'alert-inspection-in-progress')
    ).toBeTruthy();
    expect(
      queryAllByTestId(container, 'area-list-item-actions').length
    ).toEqual(0);
  });

  it('should show correct sections to a manager', () => {
    const [{ container }] = renderWithStore(
      <InspectionOverview property={testProperties[1]} />,
      { initialState: getStateAsManager(testStoreState) }
    );

    expect(queryByTestId(container, 'overview-area-list')).toBeTruthy();
    expect(queryByTestId(container, 'inspection-report-list')).toBeTruthy();
  });

  it('should show correct sections to a primary owner', () => {
    const [{ container }] = renderWithStore(
      <InspectionOverview property={testProperties[1]} />,
      { initialState: getStateAsPrimaryOwner(testStoreState) }
    );

    expect(queryByTestId(container, 'overview-area-list')).toBeTruthy();
    expect(queryByTestId(container, 'inspection-report-list')).toBeTruthy();
  });

  it('should show correct sections to a primary tenant', () => {
    const [{ container }] = renderWithStore(
      <InspectionOverview property={testProperties[1]} />,
      { initialState: getStateAsPrimaryTenant(testStoreState) }
    );

    expect(queryByTestId(container, 'overview-area-list')).toBeFalsy();
    expect(queryByTestId(container, 'inspection-report-list')).toBeTruthy();
  });

  it('should show correct sections to a secondary owner', () => {
    const [{ container }] = renderWithStore(
      <InspectionOverview property={testProperties[1]} />,
      { initialState: getStateAsSecondaryOwner(testStoreState) }
    );

    expect(queryByTestId(container, 'overview-area-list')).toBeTruthy();
    expect(queryByTestId(container, 'inspection-report-list')).toBeTruthy();
  });

  it('should show correct sections to a secondary tenant', () => {
    const [{ container }] = renderWithStore(
      <InspectionOverview property={testProperties[1]} />,
      { initialState: getStateAsSecondaryTenant(testStoreState) }
    );

    expect(queryByTestId(container, 'overview-area-list')).toBeFalsy();
    expect(queryByTestId(container, 'inspection-report-list')).toBeTruthy();
  });
});
