import { waitFor } from '@testing-library/dom';
import { getByTestId, queryByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {
  USER_TYPES,
  fetchUser,
  sendInvite,
  updateUser,
} from '../../../redux/users';
import {
  getStateAsManager,
  getStateAsPrincipal,
} from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { ContactsUserEdit } from '../UserEdit';

describe('ContactsUserEdit', () => {
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
    active: true,
    managerAgencies: [testAgencies[0]],
  };
  const testOwner = {
    id: 2,
    firstName: 'Susie',
    lastName: 'Sue',
    userNotificationSetting: {},
  };
  const testTenant = {
    id: 3,
    firstName: 'Foo',
    kind: 'personal',
    lastName: 'Bar',
    leases: [{ id: 5 }],
    status: 'draft',
    userNotificationSetting: {},
  };

  const testStoreState = {
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
        <ContactsUserEdit match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      expect(
        queryByTestId(container, 'owner-form-personal-details')
      ).toBeFalsy();
      expect(queryByTestId(container, 'form-agency-access')).toBeFalsy();
    });

    it('should show agency access form if logged in as a principal ', () => {
      const [{ container }] = renderWithStore(
        <ContactsUserEdit match={testMatch} />,
        { initialState: getStateAsPrincipal(testStoreState) }
      );

      expect(
        queryByTestId(container, 'owner-form-personal-details')
      ).toBeFalsy();
      expect(queryByTestId(container, 'form-agency-access')).toBeTruthy();
    });
  });

  it('should show correct components when contact is an owner', () => {
    const testMatch = { params: { id: 2, type: USER_TYPES.owner } };
    const [{ container }] = renderWithStore(
      <ContactsUserEdit match={testMatch} />,
      { initialState: testStoreState }
    );

    expect(
      queryByTestId(container, 'owner-form-personal-details')
    ).toBeTruthy();

    expect(
      queryByTestId(container, 'owner-form-notification-settings')
    ).toBeTruthy();

    expect(queryByTestId(container, 'form-agency-access')).toBeFalsy();
  });

  it('should fetch if user not in store', async () => {
    const testMatch = { params: { id: 4, type: USER_TYPES.tenant } };
    const [{ container }, store] = renderWithStore(
      <ContactsUserEdit match={testMatch} />,
      { initialState: testStoreState }
    );

    expect(queryByTestId(container, 'user-edit-spinner')).toBeTruthy();

    await waitFor(() => {
      expect(store.actions[0]).toEqual(fetchUser(testMatch.params));
    });
  });

  it('should be able to send invite', async () => {
    const testMatch = { params: { id: 3, type: USER_TYPES.tenant } };
    const [{ container }, store] = renderWithStore(
      <ContactsUserEdit match={testMatch} />,
      { initialState: testStoreState }
    );

    const inviteBtn = getByTestId(container, 'contact-send-invite-btn');
    expect(inviteBtn.textContent).toBe('Send Invitation');
    expect(inviteBtn.disabled).toBe(false);
    userEvent.click(inviteBtn);

    await waitFor(() => {
      expect(store.actions[0]).toEqual(
        sendInvite({ role: USER_TYPES.tenant, user: testTenant })
      );
    });
  });

  it('should be able to update a user', async () => {
    const testMatch = { params: { id: 3, type: USER_TYPES.tenant } };
    const testFormParams = {
      email: 'aang@managedapp.com.au',
      phoneNumber: '0444444444',
    };
    const [{ container }, store] = renderWithStore(
      <ContactsUserEdit match={testMatch} />,
      { initialState: testStoreState }
    );

    expect(queryByTestId(container, 'user-edit-form')).toBeTruthy();
    expect(getByTestId(container, 'form-submit-btn').disabled).toBe(true);

    const emailField = getByTestId(container, 'field-user-email');
    await userEvent.type(emailField, testFormParams.email);

    const phoneNumberField = getByTestId(container, 'field-user-phone-number');
    await userEvent.type(phoneNumberField, testFormParams.phoneNumber);

    const submitBtn = getByTestId(container, 'form-submit-btn');
    expect(submitBtn.disabled).toBe(false);
    userEvent.click(submitBtn);

    await waitFor(
      () => {
        expect(store.actions[0]).toEqual(
          updateUser({
            type: 'tenant',
            id: 3,
            agency_note_attributes: {
              body: '',
            },
            _destroy: undefined,
            user_attributes: {
              firstName: 'Foo',
              lastName: 'Bar',
              ...testFormParams,
            },
          })
        );
      },
      {
        timeout: 10000,
      }
    );
  });
});
