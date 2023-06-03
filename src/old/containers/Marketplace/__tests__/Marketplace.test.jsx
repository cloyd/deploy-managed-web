import { queryByTestId } from '@testing-library/react';
import React from 'react';

import { Marketplace } from '@app/containers/Marketplace';
import {
  getStateAsExternalCreditor,
  getStateAsManager,
} from '@app/test/getStateAsUser';
import { renderWithProviders } from '@app/test/renderWithProviders';

describe('Marketplace', () => {
  const testStoreState = {};

  describe('when logged in as a manager', () => {
    let state = getStateAsManager({ isMarketplaceEnabled: true });

    it('should show tradie list page', () => {
      const { container } = renderWithProviders(
        <Marketplace match={{ url: '' }} />,
        { state }
      );

      expect(queryByTestId(container, 'marketplace-tradie-list')).toBeTruthy();
      expect(queryByTestId(container, 'marketplace-my-jobs')).toBeFalsy();
      expect(queryByTestId(container, 'header-title').textContent).toEqual(
        'Marketplace'
      );
    });
  });

  describe('when logged in as a tradie', () => {
    let state = getStateAsExternalCreditor(testStoreState);

    it('should show tradie nav', async () => {
      const { container } = renderWithProviders(
        <Marketplace match={{ url: '' }} />,
        { state }
      );

      expect(queryByTestId(container, 'nav-sub').textContent).toContain(
        'New Jobs',
        'Assigned to me',
        'Sent for approval',
        'Active Jobs',
        'Past Jobs'
      );
    });

    it('should show tradie new jobs', async () => {
      const { container } = renderWithProviders(
        <Marketplace match={{ url: '' }} />,
        { state }
      );

      expect(queryByTestId(container, 'marketplace-new-jobs')).toBeTruthy();
    });
  });
});
