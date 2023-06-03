import { waitFor } from '@testing-library/dom';
import { getByTestId, queryByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { USER_TYPES, createUser } from '../../../redux/users';
import { getStateAsPrincipal } from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { UserCreate } from '../UserCreate';

describe('UserCreate', () => {
  const mockHistory = {
    push: jest.fn(),
    replace: jest.fn(),
  };

  const testStoreState = {};

  it('should redirect if type is not manager', async () => {
    const [{ container }] = renderWithStore(
      <UserCreate
        history={mockHistory}
        match={{ params: { type: 'INVALID-TYPE' }, url: '/' }}
      />,
      { initialState: getStateAsPrincipal(testStoreState) }
    );

    expect(queryByTestId(container, 'user-edit-form')).toBeTruthy();

    await waitFor(() => {
      expect(mockHistory.replace).toHaveBeenCalledWith('/contacts');
    });
  });

  describe('when create page is type manager', () => {
    const testMatch = { params: { type: USER_TYPES.manager }, url: '/' };
    const testFormParams = {
      email: 'timtam@managedapp.com.au',
      firstName: 'Tim',
      lastName: 'Tam',
      phoneNumber: '0444444444',
    };

    it('should be able to create user', async () => {
      const [{ container }, store] = renderWithStore(
        <UserCreate history={mockHistory} match={testMatch} />,
        { initialState: getStateAsPrincipal(testStoreState) }
      );

      expect(queryByTestId(container, 'header-title').textContent).toEqual(
        'Invite a manager'
      );

      const submitBtn = getByTestId(container, 'form-submit-btn');
      expect(queryByTestId(container, 'user-edit-form')).toBeTruthy();
      expect(submitBtn.disabled).toBe(true);

      const firstNameField = getByTestId(container, 'field-user-first-name');
      await userEvent.type(firstNameField, testFormParams.firstName);

      const lastNameField = getByTestId(container, 'field-user-last-name');
      await userEvent.type(lastNameField, testFormParams.lastName);

      const emailField = getByTestId(container, 'field-user-email');
      await userEvent.type(emailField, testFormParams.email);

      const phoneNumberField = getByTestId(
        container,
        'field-user-phone-number'
      );
      await userEvent.type(phoneNumberField, testFormParams.phoneNumber);

      expect(submitBtn.disabled).toBe(false);
      userEvent.click(submitBtn);

      await waitFor(
        () => {
          expect(store.actions[0]).toEqual(
            createUser({
              ...testFormParams,
              phoneNumber: testFormParams.phoneNumber,
              isAuthyEnabled: false,
              type: USER_TYPES.manager,
              companyName: undefined,
              id: undefined,
              status: undefined,
              taxNumber: undefined,
              tenantType: 'private',
              address: {
                postcode: undefined,
                state: undefined,
                street: undefined,
                suburb: undefined,
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
});
