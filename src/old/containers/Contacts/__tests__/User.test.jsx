import { waitFor } from '@testing-library/dom';
import { queryAllByTestId, queryByTestId } from '@testing-library/react';
import React from 'react';

import { fetchAccounts } from '../../../redux/assembly';
import { USER_TYPES, fetchUser } from '../../../redux/users';
import {
  getStateAsManager,
  getStateAsPrincipal,
} from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { ContactsUser } from '../User';

describe('ContactsUser', () => {
  const testAgencies = [
    { id: 123, tradingName: 'Agency 123' },
    { id: 456, tradingName: 'Agency 456' },
  ];
  const testManager = {
    id: 1,
    agency: testAgencies[0],
    allowedAgencies: testAgencies,
    authyEnabled: true,
    firstName: 'Smith',
    lastName: 'Roberts',
    managerAgencies: [testAgencies[0]],
  };
  const testOwner = {
    id: 2,
    firstName: 'Susie',
    isPrimaryOwner: true,
    lastName: 'Sue',
    properties: [{ id: 11 }, { id: 22 }, { id: 33 }],
    userNotificationSetting: {},
    walletBalanceAmountCents: 12300,
  };
  const testTenant = {
    id: 3,
    firstName: 'Foo',
    isPrimaryTenant: true,
    kind: 'personal',
    lastName: 'Bar',
    leases: [{ id: 5, propertyId: 11 }],
    properties: [{ id: 11 }, { id: 22 }],
    status: 'draft',
    userNotificationSetting: {},
  };

  const testProperties = {
    11: { id: 11, archivedAt: null },
    22: { id: 22, archivedAt: null, primaryOwner: { id: 55 } },
    33: { id: 33, archivedAt: null, primaryOwner: { id: 66 } },
  };

  const testBank = {
    id: 111,
    accountName: 'bank account',
    accountNumber: 'XXX545',
    accountType: 'savings',
    bankName: 'Tenant bank',
    promisepayId: 'bank-111',
    routingNumber: 'XXXXX6',
  };
  const testCard = {
    expiryMonth: '11',
    expiryYear: '2032',
    fullName: 'Not in use',
    id: 222,
    isDefault: false,
    isInUse: false,
    number: '4111-11XX-XXXX-1111',
    promisepayId: 'card-222',
    type: 'visa',
  };
  const testCard2 = {
    expiryMonth: '1',
    expiryYear: '2026',
    fullName: 'In use',
    id: 333,
    isDefault: true,
    isInUse: true,
    number: '4111-11XX-XXXX-1111',
    promisepayId: 'card-333',
    type: 'visa',
  };

  const testStoreState = {
    assembly: {
      // We'll use the same accounts for each user we test
      banks: [testBank.promisepayId],
      cards: [testCard.promisepayId, testCard2.promisepayId],
      data: {
        [testBank.promisepayId]: testBank,
        [testCard.promisepayId]: testCard,
        [testCard2.promisepayId]: testCard2,
      },
    },
    property: { data: testProperties },
    users: {
      manager: {
        data: { [testManager.id]: testManager },
        results: [testManager.id],
      },
      owner: {
        data: { [testOwner.id]: testOwner },
        results: [testOwner.id],
      },
      tenant: {
        data: { [testTenant.id]: testTenant },
        results: [testTenant.id],
      },
    },
  };

  describe('when contact is a manager', () => {
    const testMatch = { params: { id: 1, type: USER_TYPES.manager } };

    it('should hide agency access form if logged in as a manager ', () => {
      const [{ container }] = renderWithStore(
        <ContactsUser match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      expect(queryByTestId(container, 'contact-agency-access')).toBeFalsy();
      expect(
        queryAllByTestId(container, 'contact-agency-access-agency').length
      ).toBe(0);
    });

    it('should show agency access form if logged in as a principal ', () => {
      const [{ container }] = renderWithStore(
        <ContactsUser match={testMatch} />,
        { initialState: getStateAsPrincipal(testStoreState) }
      );

      expect(queryByTestId(container, 'contact-agency-access')).toBeTruthy();
      expect(
        queryAllByTestId(container, 'contact-agency-access-agency').length
      ).toBe(1);
    });
  });

  describe('when contact is an owner', () => {
    const testMatch = { params: { id: 2, type: USER_TYPES.owner } };

    it('should fetch latest contact data & accounts', async () => {
      const [{ container }, store] = renderWithStore(
        <ContactsUser match={testMatch} />,
        { initialState: testStoreState }
      );

      expect(queryByTestId(container, 'contact-account-details')).toBeTruthy();

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          fetchAccounts({ ownerId: testMatch.params.id })
        );
        expect(store.actions).toContainEqual(fetchUser(testMatch.params));
      });
    });

    it('should not show payment details', () => {
      const [{ container }] = renderWithStore(
        <ContactsUser match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      expect(queryByTestId(container, 'payment-bank-value')).toBeFalsy();
      expect(queryByTestId(container, 'payment-card-value')).toBeFalsy();
      expect(queryByTestId(container, 'contact-bpay-details')).toBeFalsy();
    });

    it('should list out owner properties', () => {
      const [{ container }] = renderWithStore(
        <ContactsUser match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      expect(queryAllByTestId(container, 'property-card-owner').length).toEqual(
        3
      );
      expect(
        queryAllByTestId(container, 'card-owner-primary-link').length
      ).toEqual(4);
    });

    it('should show wallet balance', () => {
      const [{ container }] = renderWithStore(
        <ContactsUser match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      expect(queryByTestId(container, 'card-wallet-balance')).toBeTruthy();
      expect(
        queryByTestId(container, 'card-wallet-balance-amount').textContent
      ).toEqual('$123');
    });
  });

  describe('when contact is a tenant', () => {
    const testMatch = { params: { id: 3, type: USER_TYPES.tenant } };

    it('should fetch latest contact data & accounts', async () => {
      const [{ container }, store] = renderWithStore(
        <ContactsUser match={testMatch} />,
        { initialState: testStoreState }
      );

      expect(queryByTestId(container, 'contact-account-details')).toBeTruthy();

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          fetchAccounts({ tenantId: testMatch.params.id })
        );
        expect(store.actions).toContainEqual(fetchUser(testMatch.params));
      });
    });

    it('should show payment details if logged in as a manager', () => {
      const [{ container }] = renderWithStore(
        <ContactsUser match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      expect(queryByTestId(container, 'payment-bank-value')).toBeFalsy();
      expect(queryByTestId(container, 'payment-card-value')).toBeTruthy();
      expect(queryByTestId(container, 'contact-bpay-details')).toBeTruthy();
    });

    it('should list out tenant properties', () => {
      const [{ container }] = renderWithStore(
        <ContactsUser match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      expect(
        queryAllByTestId(container, 'property-card-tenant').length
      ).toEqual(2);
    });

    it('should show wallet balance', () => {
      const [{ container }] = renderWithStore(
        <ContactsUser match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      expect(queryByTestId(container, 'card-wallet-balance')).toBeTruthy();
      expect(
        queryByTestId(container, 'card-wallet-balance-amount').textContent
      ).toEqual('$0');
    });

    it('should show tenant bpay payments in report when logged in as manager', () => {
      const [{ container }] = renderWithStore(
        <ContactsUser match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      expect(queryByTestId(container, 'download-report')).toBeTruthy();
    });

    it('should show tenant bpay payments in report when logged in as a principal', () => {
      const [{ container }] = renderWithStore(
        <ContactsUser match={testMatch} />,
        { initialState: getStateAsPrincipal(testStoreState) }
      );

      expect(queryByTestId(container, 'download-report')).toBeTruthy();
    });
  });
});
