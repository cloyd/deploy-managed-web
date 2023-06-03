import { queryByTestId, queryByText } from '@testing-library/react';
import React from 'react';

import {
  getStateAsCorporateUser,
  getStateAsExternalCreditor,
  getStateAsManager,
  getStateAsPrimaryOwner,
  getStateAsPrimaryTenant,
  getStateAsPrincipal,
  getStateAsSecondaryOwner,
  getStateAsSecondaryTenant,
} from '../../test/getStateAsUser';
import { renderWithStore } from '../../test/renderWithStore';
import { Navigation } from '../Navigation';

describe('Navigation', () => {
  describe('when logged in as a corporate user', () => {
    it('shows correct default links', () => {
      const [{ container }] = renderWithStore(<Navigation />, {
        initialState: getStateAsCorporateUser(),
      });

      expect(queryByTestId(container, 'main-link-action-centre')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-properties')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-payments')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-financials')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-contacts')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-marketplace')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-reports')).toBeTruthy();
    });

    it('should hide contacts preferred tradie link', () => {
      const [{ container }] = renderWithStore(<Navigation />, {
        initialState: getStateAsCorporateUser(),
      });

      expect(queryByTestId(container, 'main-link-contacts')).toBeTruthy();
      expect(queryByText(container, 'Preferred Tradies')).toBeFalsy();
    });

    it('shows correct links when marketplace enabled', () => {
      const [{ container }] = renderWithStore(<Navigation />, {
        initialState: getStateAsCorporateUser(
          {},
          {},
          { isMarketplaceEnabled: true }
        ),
      });

      expect(queryByTestId(container, 'main-link-action-centre')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-properties')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-payments')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-financials')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-contacts')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-marketplace')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-reports')).toBeTruthy();
    });
  });

  describe('when logged in as an external creditor (tradie)', () => {
    it('shows correct nav links', () => {
      const [{ container }] = renderWithStore(<Navigation />, {
        initialState: getStateAsExternalCreditor(),
      });
      expect(queryByTestId(container, 'main-link-action-centre')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-properties')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-payments')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-financials')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-contacts')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-marketplace')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-reports')).toBeFalsy();
    });
  });

  describe('when logged in as a manager', () => {
    let container;
    beforeEach(() => {
      const [render] = renderWithStore(<Navigation />, {
        initialState: getStateAsManager(),
      });

      container = render.container;
    });

    it('shows correct default links', () => {
      expect(queryByTestId(container, 'main-link-action-centre')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-properties')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-payments')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-financials')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-contacts')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-marketplace')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-reports')).toBeFalsy();
    });

    it('should show contacts preferred tradie link', () => {
      expect(queryByTestId(container, 'main-link-contacts')).toBeTruthy();
      expect(queryByText(container, 'Preferred Tradies')).toBeTruthy();
    });
  });

  describe('when logged in as a primary owner', () => {
    it('shows correct nav links', () => {
      const [{ container }] = renderWithStore(<Navigation />, {
        initialState: getStateAsPrimaryOwner(),
      });
      expect(queryByTestId(container, 'main-link-action-centre')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-properties')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-payments')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-contacts')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-marketplace')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-reports')).toBeFalsy();
    });
  });

  describe('when logged in as a primary tenant', () => {
    it('shows correct nav links', () => {
      const [{ container }] = renderWithStore(<Navigation />, {
        initialState: getStateAsPrimaryTenant(),
      });

      expect(queryByTestId(container, 'main-link-action-centre')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-properties')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-payments')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-financials')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-contacts')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-marketplace')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-reports')).toBeFalsy();
    });
  });

  describe('when logged in as a principal', () => {
    let container;
    beforeEach(() => {
      const [render] = renderWithStore(<Navigation />, {
        initialState: getStateAsPrincipal(),
      });

      container = render.container;
    });
    it('shows correct default links', () => {
      expect(queryByTestId(container, 'main-link-action-centre')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-properties')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-payments')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-financials')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-contacts')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-marketplace')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-reports')).toBeTruthy();
    });

    it('should show contacts preferred tradie link', () => {
      expect(queryByTestId(container, 'main-link-contacts')).toBeTruthy();
      expect(queryByText(container, 'Preferred Tradies')).toBeTruthy();
    });
  });

  describe('when logged in as a secondary owner', () => {
    it('shows correct nav links', () => {
      const [{ container }] = renderWithStore(<Navigation />, {
        initialState: getStateAsSecondaryOwner(),
      });

      expect(queryByTestId(container, 'main-link-action-centre')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-properties')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-payments')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-contacts')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-marketplace')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-reports')).toBeFalsy();
    });
  });

  describe('when logged in as a secondary tenant', () => {
    it('shows correct nav links', () => {
      const [{ container }] = renderWithStore(<Navigation />, {
        initialState: getStateAsSecondaryTenant(),
      });

      expect(queryByTestId(container, 'main-link-action-centre')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-properties')).toBeTruthy();
      expect(queryByTestId(container, 'main-link-payments')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-financials')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-contacts')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-marketplace')).toBeFalsy();
      expect(queryByTestId(container, 'main-link-reports')).toBeFalsy();
    });
  });
});
