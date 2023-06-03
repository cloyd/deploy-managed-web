import { waitFor } from '@testing-library/dom';
import { getByTestId, queryByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { fetchLeases } from '../../../redux/lease';
import { markOnboarded } from '../../../redux/profile';
import { fetchProperties } from '../../../redux/property';
import {
  getStateAsExternalCreditor,
  getStateAsManager,
  getStateAsPrimaryOwner,
  getStateAsPrimaryTenant,
} from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { ConfirmInvite } from '../ConfirmInvite';

describe('ConfirmInvite', () => {
  const testProperties = {
    11: { id: 11, archivedAt: null },
    22: { id: 22, archivedAt: null, primaryOwner: { id: 55 } },
  };

  const testLeases = {
    111: { id: 111, isPending: false, propertyId: 11 },
    222: { id: 222, isPending: true, propertyId: 22 },
  };

  const testManager = {
    id: 1,
    authyEnabled: true,
    firstName: 'Smith',
    lastName: 'Roberts',
    status: 'draft',
  };
  const testOwner = {
    id: 2,
    firstName: 'Susie',
    isPrimaryOwner: true,
    lastName: 'Sue',
    properties: [testProperties[11], testProperties[22]],
    walletBalanceAmountCents: 12300,
    status: 'draft',
  };
  const testTenant = {
    id: 3,
    firstName: 'Foo',
    isPrimaryTenant: true,
    lastName: 'Bar',
    leases: [testLeases[111], testLeases[222]],
    properties: [testProperties[11], testProperties[22]],
    status: 'draft',
  };

  const testStoreState = {
    lease: { leases: testLeases },
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

  describe('as a manager', () => {
    const testProfile = { id: 1 };

    it('should make the correct fetches', async () => {
      const [{ container }, store] = renderWithStore(<ConfirmInvite />, {
        initialState: getStateAsManager(testStoreState, testProfile),
      });

      expect(queryByTestId(container, 'heading-rent-details')).toBeFalsy();

      await waitFor(() => {
        expect(store.actions.length).toEqual(2);
        expect(store.actions).toContainEqual(fetchLeases());
        expect(store.actions).toContainEqual(fetchProperties());
      });
    });

    it('should mark as onboarded', async () => {
      const [{ container }, store] = renderWithStore(<ConfirmInvite />, {
        initialState: getStateAsManager(testStoreState, testProfile),
      });

      userEvent.click(getByTestId(container, 'button-confirm-invite'));

      await waitFor(() => {
        expect(store.actions.length).toEqual(3);
        expect(store.actions).toContainEqual(markOnboarded());
      });
    });
  });

  describe('as a primary owner', () => {
    const testProfile = { id: 2 };

    it('should make the correct fetches', async () => {
      const [{ container }, store] = renderWithStore(<ConfirmInvite />, {
        initialState: getStateAsPrimaryOwner(testStoreState, testProfile),
      });

      expect(queryByTestId(container, 'heading-rent-details')).toBeFalsy();

      await waitFor(() => {
        expect(store.actions.length).toEqual(2);
        expect(store.actions).toContainEqual(fetchLeases());
        expect(store.actions).toContainEqual(fetchProperties());
      });
    });

    it('should mark as onboarded', async () => {
      const [{ container }, store] = renderWithStore(<ConfirmInvite />, {
        initialState: getStateAsPrimaryOwner(testStoreState, testProfile),
      });

      userEvent.click(getByTestId(container, 'button-confirm-invite'));

      await waitFor(() => {
        expect(store.actions.length).toEqual(3);
        expect(store.actions).toContainEqual(markOnboarded());
      });
    });
  });

  describe('as a primary tenant', () => {
    const testProfile = { id: 3 };

    it('should make the correct fetches', async () => {
      const [{ container }, store] = renderWithStore(<ConfirmInvite />, {
        initialState: getStateAsPrimaryTenant(testStoreState, testProfile),
      });

      expect(queryByTestId(container, 'heading-rent-details')).toBeTruthy();

      await waitFor(() => {
        expect(store.actions.length).toEqual(2);
        expect(store.actions).toContainEqual(fetchLeases());
        expect(store.actions).toContainEqual(fetchProperties());
      });
    });

    it('should mark as onboarded', async () => {
      const [{ container }, store] = renderWithStore(<ConfirmInvite />, {
        initialState: getStateAsPrimaryTenant(testStoreState, testProfile),
      });

      userEvent.click(getByTestId(container, 'button-confirm-invite'));

      await waitFor(() => {
        expect(store.actions.length).toEqual(3);
        expect(store.actions).toContainEqual(markOnboarded());
      });
    });
  });

  describe('as an external creditor (tradie)', () => {
    const testProfile = { id: 444 };

    it('should not make any fetches', async () => {
      const [{ container }, store] = renderWithStore(<ConfirmInvite />, {
        initialState: getStateAsExternalCreditor(testStoreState, testProfile),
      });

      expect(queryByTestId(container, 'heading-rent-details')).toBeFalsy();

      await waitFor(() => expect(store.actions.length).toEqual(0));
    });

    it('should mark as onboarded', async () => {
      const [{ container }, store] = renderWithStore(<ConfirmInvite />, {
        initialState: getStateAsExternalCreditor(testStoreState, testProfile),
      });

      userEvent.click(getByTestId(container, 'button-confirm-invite'));

      await waitFor(() => {
        expect(store.actions.length).toEqual(1);
        expect(store.actions).toContainEqual(markOnboarded());
      });
    });
  });
});
