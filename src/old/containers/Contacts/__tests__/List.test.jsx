import { waitFor } from '@testing-library/dom';
import {
  getByTestId,
  queryAllByTestId,
  queryByTestId,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { USER_TYPES } from '../../../redux/users';
import { getStateAsPrincipal } from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { ContactsList } from '../List';

describe('ContactsList', () => {
  //
  // Mocks
  let mockHistory;

  //
  // Test data
  const testNavigation = [
    {
      titleLong: 'External Creditors',
      to: '/creditors-test',
      type: USER_TYPES.externalCreditor,
    },
    {
      title: 'Managers',
      to: '/managers',
      type: USER_TYPES.manager,
    },
    {
      title: 'Owners',
      to: '/owners',
      type: USER_TYPES.owner,
    },
    {
      title: 'Tenants',
      to: '/tenants',
      type: USER_TYPES.tenant,
    },
  ];

  const testCreditors = {
    1: {
      id: 1,
      primaryContactEmail: 'creditor1@managedapp.com.au',
      primaryContactFirstName: 'Chupa',
      primaryContactLastName: 'Chups',
    },
    2: {
      id: 2,
      bpayOutProvider: true,
      primaryContactEmail: 'creditor2@managedapp.com.au',
      primaryContactFirstName: 'BPay',
      primaryContactLastName: 'Out Provider',
    },
  };
  const testManagers = {
    1: {
      id: 1,
      email: 'manager1@managedapp.com.au',
      firstName: 'Smith',
      lastName: 'Roberts',
      active: true,
    },
  };
  const testOwners = {
    1: {
      id: 1,
      email: 'owner1@managedapp.com.au',
      firstName: 'Susie',
      lastName: 'Sue',
      status: 'active',
    },
    2: {
      id: 2,
      email: 'owner2@managedapp.com.au',
      firstName: 'Foo',
      lastName: 'Bar',
      status: 'draft',
    },
  };
  const testTenants = {
    1: {
      id: 1,
      email: 'tenant1@managedapp.com.au',
      firstName: 'Tim',
      lastName: 'Tam',
      status: 'active',
    },
    2: {
      id: 2,
      email: 'tenant2@managedapp.com.au',
      firstName: 'Monte',
      lastName: 'Carlo',
      status: 'draft',
    },
    3: {
      id: 3,
      email: 'tenant3@managedapp.com.au',
      firstName: 'Lemon',
      lastName: 'Crisp',
      status: 'active',
    },
  };

  const testStoreState = {
    users: {
      externalCreditor: { data: testCreditors, results: [1, 2] },
      manager: { data: testManagers, results: [1] },
      owner: { data: testOwners, results: [1, 2] },
      tenant: { data: testTenants, results: [1, 2, 3] },
    },
  };

  beforeEach(() => {
    mockHistory = {
      push: jest.fn(),
      replace: jest.fn(),
    };
  });

  it.skip('should redirect if invalid type is provided', async () => {
    const [{ container }] = renderWithStore(
      <ContactsList
        history={mockHistory}
        location={{ search: '' }}
        match={{ params: { type: 'INVALID_TYPE' }, url: '/' }}
        navigation={testNavigation}
      />,
      { initialState: getStateAsPrincipal(testStoreState) }
    );

    expect(queryByTestId(container, 'user-list-row')).toBeFalsy();

    await waitFor(() => {
      expect(mockHistory.replace).toHaveBeenCalledWith('/contacts');
    });
  });

  describe('when contacts list is type external creditors', () => {
    const testMatch = {
      params: { type: USER_TYPES.externalCreditor },
      url: '/',
    };

    it('should fetch list of users', async () => {
      const [{ container }] = renderWithStore(
        <ContactsList
          history={mockHistory}
          location={{ search: '' }}
          match={testMatch}
          navigation={testNavigation}
        />,
        { initialState: getStateAsPrincipal(testStoreState) }
      );

      await waitFor(() => {
        expect(queryByTestId(container, 'header-title').textContent).toEqual(
          'External Creditors'
        );

        // TODO: check correct useUsers params
        // expect type equal USER_TYPES.externalCreditor
      });
    });

    it.skip('should show list of users excluding BPay Out Providers', () => {
      const [{ container }] = renderWithStore(
        <ContactsList
          history={mockHistory}
          location={{ search: '' }}
          match={testMatch}
          navigation={testNavigation}
        />,
        { initialState: getStateAsPrincipal(testStoreState) }
      );

      expect(queryByTestId(container, 'user-list')).toBeTruthy();
      expect(queryAllByTestId(container, 'user-list-row').length).toEqual(1);
    });
  });

  describe('when contacts list is type manager', () => {
    const testMatch = { params: { type: USER_TYPES.manager }, url: '/' };

    it('should fetch list of users', async () => {
      const [{ container }] = renderWithStore(
        <ContactsList
          history={mockHistory}
          location={{ search: '' }}
          match={testMatch}
          navigation={testNavigation}
        />,
        { initialState: getStateAsPrincipal(testStoreState) }
      );

      await waitFor(() => {
        expect(queryByTestId(container, 'header-title').textContent).toEqual(
          'Managers'
        );

        // TODO: check correct useUsers params
        // expect type equal USER_TYPES.manager
      });
    });

    it.skip('should show list of users', () => {
      const [{ container }] = renderWithStore(
        <ContactsList
          history={mockHistory}
          location={{ search: '' }}
          match={testMatch}
          navigation={testNavigation}
        />,
        { initialState: getStateAsPrincipal(testStoreState) }
      );

      expect(queryByTestId(container, 'user-list')).toBeTruthy();
      expect(queryAllByTestId(container, 'user-list-row').length).toEqual(1);
    });
  });

  describe('when contacts list is type owner', () => {
    const testMatch = { params: { type: USER_TYPES.owner }, url: '/' };

    it('should fetch list of users', async () => {
      const [{ container }] = renderWithStore(
        <ContactsList
          history={mockHistory}
          location={{ search: '' }}
          match={testMatch}
          navigation={testNavigation}
        />,
        { initialState: getStateAsPrincipal(testStoreState) }
      );

      await waitFor(() => {
        expect(queryByTestId(container, 'header-title').textContent).toEqual(
          'Owners'
        );

        // TODO: check correct useUsers params
        // expect type equal USER_TYPES.owner
      });
    });

    it.skip('should show list of users', () => {
      const [{ container }] = renderWithStore(
        <ContactsList
          history={mockHistory}
          location={{ search: '' }}
          match={testMatch}
          navigation={testNavigation}
        />,
        { initialState: getStateAsPrincipal(testStoreState) }
      );

      expect(queryByTestId(container, 'user-list')).toBeTruthy();
      expect(queryAllByTestId(container, 'user-list-row').length).toEqual(2);
    });
  });

  describe('when contacts list is type tenant', () => {
    const testMatch = { params: { type: USER_TYPES.tenant }, url: '/' };

    it('should fetch list of users', async () => {
      const [{ container }] = renderWithStore(
        <ContactsList
          history={mockHistory}
          location={{ search: '' }}
          match={testMatch}
          navigation={testNavigation}
        />,
        { initialState: getStateAsPrincipal(testStoreState) }
      );

      await waitFor(() => {
        expect(queryByTestId(container, 'header-title').textContent).toEqual(
          'Tenants'
        );

        // TODO: check correct useUsers params
        // expect type equal USER_TYPES.tenant
      });
    });

    it.skip('should show list of users', () => {
      const [{ container }] = renderWithStore(
        <ContactsList
          history={mockHistory}
          location={{ search: '' }}
          match={testMatch}
          navigation={testNavigation}
        />,
        { initialState: getStateAsPrincipal(testStoreState) }
      );

      expect(queryByTestId(container, 'user-list')).toBeTruthy();
      expect(queryAllByTestId(container, 'user-list-row').length).toEqual(3);
    });

    it.skip('should be able to search users', async () => {
      const [{ container }, store] = renderWithStore(
        <ContactsList
          history={mockHistory}
          location={{ search: '' }}
          match={testMatch}
          navigation={testNavigation}
        />,
        { initialState: getStateAsPrincipal(testStoreState) }
      );

      const searchInput = getByTestId(container, 'contact-user-search-input');
      expect(searchInput).toBeTruthy();
      await userEvent.type(searchInput, 'wo');

      expect(store.actions.length).toEqual(1);
      expect(mockHistory.replace).toHaveBeenCalledTimes(0);

      await userEvent.type(searchInput, 'rld');

      expect(mockHistory.replace).toHaveBeenCalledTimes(3);

      // rerender(
      //   <ContactsList
      //     history={mockHistory}
      //     location={{ search: '?search=world' }}
      //     match={testMatch}
      //     navigation={testNavigation}
      //   />
      // );

      // TODO: check correct useUsers params
      // expect type equal USER_TYPES.tenant
    });
  });
});
