import { getByTestId, queryByTestId } from '@testing-library/react';
import React from 'react';

import { USER_TYPES } from '../../../redux/users';
import {
  getStateAsCorporateUser,
  getStateAsManager,
  getStateAsPrimaryOwner,
  getStateAsPrimaryTenant,
  getStateAsSecondaryOwner,
  getStateAsSecondaryTenant,
} from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { PaymentsIntention } from '../Intention';

describe('PaymentsIntention', () => {
  const mockHistory = {
    goBack: jest.fn(),
  };

  const testManager = {
    id: 2,
    email: 'manager1@managedapp.com.au',
    firstName: 'Smith',
    lastName: 'Roberts',
  };

  const testOwner = {
    id: 3,
    email: 'owner1@managedapp.com.au',
    firstName: 'Susie',
    lastName: 'Sue',
  };

  const testTenant = {
    id: 4,
    email: 'tenant1@managedapp.com.au',
    firstName: 'Tim',
    lastName: 'Tam',
  };

  const testProperty = {
    id: 222,
    address: { street: '123 Fake st', suburb: 'Sydney' },
  };

  const testIntentions = {
    11: {
      id: 11,
      property: { id: testProperty.id },
      debtor: 'agency',
      debtorId: 5,
    },
    22: {
      id: 22,
      property: { id: testProperty.id },
      debtor: USER_TYPES.owner,
      debtorId: testOwner.id,
    },
    33: {
      id: 33,
      property: { id: testProperty.id },
      debtor: USER_TYPES.tenant,
      debtorId: testTenant.id,
    },
  };

  const testStoreState = {
    intention: { data: testIntentions, results: [] },
    property: { data: { [testProperty.id]: testProperty } },
    users: {
      manager: {
        data: { [testManager.id]: testManager },
      },
      owner: {
        data: { [testOwner.id]: testOwner },
      },
      tenant: {
        data: { [testTenant.id]: testTenant },
      },
    },
  };

  describe('when logged in as a corporate user', () => {
    it('shows correct buttons as debtor', () => {
      const testMatch = { params: { intentionId: '11' } };
      const [{ container }] = renderWithStore(
        <PaymentsIntention history={mockHistory} match={testMatch} />,
        {
          initialState: getStateAsCorporateUser(testStoreState, { id: 1 }),
        }
      );
      expect(getByTestId(container, 'payment-settings-btn').href).toContain(
        '/payments/settings'
      );
      expect(queryByTestId(container, 'no-payment-method-alert')).toBeTruthy();
      expect(queryByTestId(container, 'form-submit-btn')).toBeTruthy();
    });
  });

  describe('when logged in as a manager', () => {
    it('shows correct buttons as debtor', () => {
      const testMatch = { params: { intentionId: '11' } };
      const [{ container }] = renderWithStore(
        <PaymentsIntention history={mockHistory} match={testMatch} />,
        {
          initialState: getStateAsManager(testStoreState, { id: 1 }),
        }
      );
      expect(queryByTestId(container, 'payment-settings-btn')).toBeFalsy();
      expect(queryByTestId(container, 'no-payment-method-alert')).toBeTruthy();
      expect(queryByTestId(container, 'form-submit-btn')).toBeTruthy();
    });
  });

  describe('when logged in as a primary owner', () => {
    it('shows correct buttons as debtor', () => {
      const testMatch = { params: { intentionId: '11' } };
      const [{ container }] = renderWithStore(
        <PaymentsIntention history={mockHistory} match={testMatch} />,
        {
          initialState: getStateAsPrimaryOwner(testStoreState, { id: 1 }),
        }
      );
      expect(getByTestId(container, 'payment-settings-btn').href).toContain(
        '/property/222/settings'
      );
      expect(queryByTestId(container, 'no-payment-method-alert')).toBeTruthy();
      expect(queryByTestId(container, 'form-submit-btn')).toBeTruthy();
    });
  });

  describe('when logged in as a primary tenant', () => {
    it('shows correct buttons as debtor', () => {
      const testMatch = { params: { intentionId: '33' } };
      const [{ container }] = renderWithStore(
        <PaymentsIntention history={mockHistory} match={testMatch} />,
        {
          initialState: getStateAsPrimaryTenant(testStoreState, { id: 1 }),
        }
      );
      expect(getByTestId(container, 'payment-settings-btn').href).toContain(
        '/payments/settings'
      );
      expect(queryByTestId(container, 'no-payment-method-alert')).toBeTruthy();
      expect(queryByTestId(container, 'form-submit-btn')).toBeTruthy();
    });
  });

  describe('when logged in as a secondary owner', () => {
    it('shows correct buttons as debtor', () => {
      const testMatch = { params: { intentionId: '22' } };
      const [{ container }] = renderWithStore(
        <PaymentsIntention history={mockHistory} match={testMatch} />,
        {
          initialState: getStateAsSecondaryOwner(testStoreState, { id: 1 }),
        }
      );
      expect(getByTestId(container, 'payment-settings-btn').href).toContain(
        '/property/222/settings'
      );
      expect(queryByTestId(container, 'no-payment-method-alert')).toBeTruthy();
      expect(queryByTestId(container, 'form-submit-btn')).toBeTruthy();
    });
  });

  describe('when logged in as a secondary tenant', () => {
    it('shows correct buttons as debtor', () => {
      const testMatch = { params: { intentionId: '33' } };
      const [{ container }] = renderWithStore(
        <PaymentsIntention history={mockHistory} match={testMatch} />,
        {
          initialState: getStateAsSecondaryTenant(testStoreState, { id: 1 }),
        }
      );
      expect(queryByTestId(container, 'payment-settings-btn')).toBeFalsy();
      expect(queryByTestId(container, 'no-payment-method-alert')).toBeTruthy();
      expect(queryByTestId(container, 'form-submit-btn')).toBeTruthy();
    });
  });
});
