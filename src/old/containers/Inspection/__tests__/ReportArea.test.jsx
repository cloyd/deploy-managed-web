import { waitFor } from '@testing-library/dom';
import { queryAllByTestId, queryByTestId } from '@testing-library/react';
import React from 'react';

import {
  INSPECTION_STATUS,
  INSPECTION_TYPE,
  fetchInspectionReport,
} from '../../../redux/inspection';
import { getStateAsManager } from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { InspectionReportArea } from '../ReportArea';

describe('InspectionReportArea', () => {
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
    333: { id: 333, name: 'Bedroom', items: [12, 34] },
  };
  const testReports = {
    11: {
      id: 11,
      areas: [111, 222, 333],
      status: INSPECTION_STATUS.PENDING_AGENCY,
      typeOf: INSPECTION_TYPE.INGOING,
    },
    22: {
      id: 22,
      updateBlockedByReportId: 9,
      areas: [111, 222, 333],
      status: INSPECTION_STATUS.PENDING_TENANT,
      typeOf: INSPECTION_TYPE.INGOING,
    },
    33: {
      id: 11,
      areas: [111, 222, 333],
      status: INSPECTION_STATUS.PENDING_AGENCY,
      typeOf: INSPECTION_TYPE.OUTGOING,
    },
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

  it('should fetch report', async () => {
    const testMatch = { params: { areaId: 222, reportId: 11 } };
    const [{ container }, store] = renderWithStore(
      <InspectionReportArea match={testMatch} property={testProperties[1]} />,
      { initialState: getStateAsManager(testStoreState) }
    );

    expect(queryByTestId(container, 'inspection-area')).toBeTruthy();

    await waitFor(() => {
      expect(store.actions).toContainEqual(
        fetchInspectionReport({ reportId: 11 })
      );
    });
  });

  it('should show elements for an ingoing report when not blocked', () => {
    const testMatch = { params: { areaId: 222, reportId: 11 } };
    const [{ container }] = renderWithStore(
      <InspectionReportArea match={testMatch} property={testProperties[1]} />,
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
      queryAllByTestId(container, 'checkbox-isPotentialBondClaim').length
    ).toEqual(0);
    expect(queryAllByTestId(container, 'checkbox-isWorkNeeded').length).toEqual(
      0
    );

    expect(
      queryAllByTestId(container, 'button-destroy-area-item').length
    ).toEqual(3);
    expect(queryByTestId(container, 'button-add-area-item')).toBeTruthy();
  });

  it('should show elements for an outgoing report when not blocked', () => {
    const testMatch = { params: { areaId: 333, reportId: 33 } };
    const [{ container }] = renderWithStore(
      <InspectionReportArea match={testMatch} property={testProperties[1]} />,
      { initialState: getStateAsManager(testStoreState) }
    );

    expect(
      queryByTestId(container, 'alert-inspection-in-progress')
    ).toBeFalsy();
    expect(
      queryByTestId(container, 'inspection-area-name').textContent
    ).toEqual('Bedroom');
    expect(queryByTestId(container, 'link-prev-area').href).toContain('/222');
    expect(queryByTestId(container, 'link-next-area')).toBeFalsy();

    expect(queryByTestId(container, 'inspection-area-overview')).toBeTruthy();
    expect(queryAllByTestId(container, 'inspection-area-item').length).toEqual(
      2
    );

    expect(
      queryAllByTestId(container, 'checkbox-isPotentialBondClaim').length
    ).toEqual(2);
    expect(queryAllByTestId(container, 'checkbox-isWorkNeeded').length).toEqual(
      2
    );

    expect(
      queryAllByTestId(container, 'button-destroy-area-item').length
    ).toEqual(2);
    expect(queryByTestId(container, 'button-add-area-item')).toBeTruthy();
  });

  it('should show elements when blocked by a report and has unchecked items', () => {
    const testMatch = { params: { areaId: 111, reportId: 22 } };
    const [{ container }] = renderWithStore(
      <InspectionReportArea match={testMatch} property={testProperties[1]} />,
      { initialState: getStateAsManager(testStoreState) }
    );

    expect(
      queryByTestId(container, 'alert-inspection-in-progress')
    ).toBeTruthy();
    expect(queryByTestId(container, 'link-prev-area')).toBeFalsy();
    expect(queryByTestId(container, 'link-next-area').href).toContain('/222');

    expect(queryByTestId(container, 'inspection-area-overview')).toBeFalsy();
    expect(queryAllByTestId(container, 'inspection-area-item').length).toEqual(
      2
    );

    expect(
      queryAllByTestId(container, 'button-destroy-area-item').length
    ).toEqual(0);
    expect(queryByTestId(container, 'button-add-area-item')).toBeFalsy();
  });
});
