import { waitFor } from '@testing-library/dom';
import React from 'react';

import {
  getStateAsManager,
  getStateAsPrincipal,
} from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { Contacts } from '../Contacts';

describe('Contacts', () => {
  let mockHistory;
  const testStoreState = {};

  beforeEach(() => {
    mockHistory = {
      replace: jest.fn(),
    };
  });

  describe('when Marketplace enabled', () => {
    it('should redirect to service providers page for Principals', async () => {
      renderWithStore(
        <Contacts
          history={mockHistory}
          location={{ pathname: '/contacts' }}
          match={{}}
        />,
        {
          initialState: getStateAsPrincipal(testStoreState, {
            isMarketplaceEnabled: true,
          }),
        }
      );

      await waitFor(() => {
        expect(mockHistory.replace).toHaveBeenCalledWith(
          '/contacts/service-providers'
        );
      });
    });

    it('should redirect to service providers page for Managers', async () => {
      renderWithStore(
        <Contacts
          history={mockHistory}
          location={{ pathname: '/contacts' }}
          match={{}}
        />,
        {
          initialState: getStateAsManager(testStoreState, {
            isMarketplaceEnabled: true,
          }),
        }
      );

      await waitFor(() => {
        expect(mockHistory.replace).toHaveBeenCalledWith(
          '/contacts/service-providers'
        );
      });
    });
  });

  describe('when Marketplace disabled', () => {
    it('should redirect to creditors page', async () => {
      renderWithStore(
        <Contacts
          history={mockHistory}
          location={{ pathname: '/contacts' }}
          match={{}}
        />,
        { initialState: getStateAsPrincipal(testStoreState) }
      );

      await waitFor(() => {
        expect(mockHistory.replace).toHaveBeenCalledWith('/contacts/creditors');
      });
    });
  });
});
