import { queryByTestId } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import {
  getStateAsPrimaryTenant,
  getStateAsSecondaryTenant,
} from '@app/test/getStateAsUser';
import { renderWithStore } from '@app/test/renderWithStore';

import { NavMain } from '../Main';

describe('NavMain', () => {
  it('should render correct nav components as a Primary Tenant', () => {
    const [{ container }] = renderWithStore(
      <BrowserRouter>
        <NavMain />
      </BrowserRouter>,
      { initialState: getStateAsPrimaryTenant() }
    );

    expect(queryByTestId(container, 'main-link-action-centre')).toBeFalsy();
    expect(queryByTestId(container, 'main-link-properties')).toBeTruthy();
    expect(queryByTestId(container, 'main-link-payments')).toBeTruthy();
    expect(queryByTestId(container, 'main-link-financials')).toBeFalsy();
    expect(queryByTestId(container, 'main-link-contacts')).toBeFalsy();
    expect(queryByTestId(container, 'main-link-marketplace')).toBeFalsy();
    expect(queryByTestId(container, 'main-link-reports')).toBeFalsy();
  });

  it('should not render Payments nav as a Secondary Tenant', () => {
    const [{ container }] = renderWithStore(
      <BrowserRouter>
        <NavMain />
      </BrowserRouter>,
      { initialState: getStateAsSecondaryTenant() }
    );

    expect(queryByTestId(container, 'main-link-payments')).toBeFalsy();
  });
});
