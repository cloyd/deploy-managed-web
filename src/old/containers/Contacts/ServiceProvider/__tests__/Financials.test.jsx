import { waitFor } from '@testing-library/dom';
import { queryByTestId } from '@testing-library/react';
import React from 'react';

import { EXTERNAL_CREDITOR_CLASSIFICATIONS } from '../../../../redux/users';
import { getStateAsPrincipal } from '../../../../test/getStateAsUser';
import { renderWithStore } from '../../../../test/renderWithStore';
import { ServiceProviderFinancials } from '../Financials';

describe('ServiceProviderFinancials', () => {
  const mockHistory = {
    push: jest.fn(),
  };

  /**
   * Test user data
   */
  const testAddress = {
    country: 'AUS', // Defaults to Australia
    postcode: '2000',
    state: 'NSW',
    street: '123 Biscuit st',
    suburb: 'Sydney',
  };
  const testCreditors = {
    11: {
      id: 11,
      hasLogin: true,
      primaryContactEmail: 'timtam@managedapp.com.au',
      primaryContactFirstName: 'Tim',
      primaryContactLastName: 'Tam',
      classification: EXTERNAL_CREDITOR_CLASSIFICATIONS.tradie,
    },
    22: {
      id: 22,
      address: { ...testAddress },
      hasLogin: true,
      primaryContactEmail: 'creditor2@managedapp.com.au',
      primaryContactMobile: '1111111111',
      primaryContactFirstName: 'Service',
      primaryContactLastName: 'Provider',
      typeOf: 'bathroom_renovation',
      classification: EXTERNAL_CREDITOR_CLASSIFICATIONS.serviceProvider,
    },
  };

  const testStoreState = {
    users: {
      externalCreditor: { data: testCreditors, results: [11, 22] },
    },
  };

  it('should redirect if creditor is not a service provider', async () => {
    const testMatch = { params: { id: 11 } };
    const [{ container }] = renderWithStore(
      <ServiceProviderFinancials
        history={mockHistory}
        location={{}}
        match={testMatch}
      />,
      { initialState: getStateAsPrincipal(testStoreState) }
    );

    expect(queryByTestId(container, 'report-filters')).toBeTruthy();

    await waitFor(() => {
      expect(mockHistory.push).toHaveBeenCalledWith(
        '/contacts/service-providers'
      );
    });
  });

  describe('when user is a service provider', () => {
    const testMatch = { params: { id: 22 } };

    it('should not redirect', async () => {
      const [{ container }] = renderWithStore(
        <ServiceProviderFinancials
          history={mockHistory}
          location={{}}
          match={testMatch}
        />,
        { initialState: getStateAsPrincipal(testStoreState) }
      );

      expect(queryByTestId(container, 'report-filters')).toBeTruthy();

      await waitFor(() => {
        expect(mockHistory.push).toHaveBeenCalledWith(
          '/contacts/service-providers'
        );
      });
    });
  });
});
