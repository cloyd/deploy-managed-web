import { waitFor } from '@testing-library/dom';
import { getByTestId, queryByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { singular } from 'pluralize';
import React from 'react';

import { USER_TYPES, updateUser } from '../../../redux/users';
import {
  getStateAsExternalCreditor,
  getStateAsPrimaryOwner,
  getStateAsPrimaryTenant,
  getStateAsSecondaryOwner,
  getStateAsSecondaryTenant,
} from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { ProfileNotifications } from '../Notifications';

describe('ProfileNotifications', () => {
  const mockHistory = {
    goBack: jest.fn(),
  };

  const testOwnerUser = { userNotificationSetting: { id: 44 } };
  const testTenantUser = { userNotificationSetting: { id: 55 } };
  const testStoreState = {};

  describe('when logged in as a primary owner', () => {
    it('should show owner notification settings', () => {
      const [{ container }] = renderWithStore(
        <ProfileNotifications history={mockHistory} />,
        {
          initialState: getStateAsPrimaryOwner(
            testStoreState,
            {},
            testOwnerUser
          ),
        }
      );

      expect(
        queryByTestId(container, 'owner-form-notification-settings')
      ).toBeTruthy();
      expect(
        queryByTestId(container, 'tenant-form-notification-settings')
      ).toBeFalsy();
    });

    it('should update notification settings', async () => {
      const [{ container }, store] = renderWithStore(
        <ProfileNotifications history={mockHistory} />,
        {
          initialState: getStateAsPrimaryOwner(
            testStoreState,
            {},
            testOwnerUser
          ),
        }
      );

      const settingsForm = getByTestId(
        container,
        'owner-form-notification-settings'
      );
      const settingStatementMonthly = getByTestId(
        settingsForm,
        'setting-statementMonthly'
      );

      expect(settingStatementMonthly.checked).toBe(false);
      await userEvent.click(settingStatementMonthly);
      expect(settingStatementMonthly.checked).toBe(true);

      const submitBtn = getByTestId(settingsForm, 'form-submit-btn');
      expect(submitBtn.disabled).toBe(false);
      userEvent.click(submitBtn);

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateUser({
            id: store.getState().profile.data.id,
            role: singular(USER_TYPES.owner),
            userNotificationSettingAttributes: {
              id: testOwnerUser.userNotificationSetting.id,
              statementMonthly: true,
            },
          })
        );
      });
    });
  });

  describe('when logged in as a primary tenant', () => {
    it('should show tenant notification settings', () => {
      const [{ container }] = renderWithStore(
        <ProfileNotifications history={mockHistory} />,
        {
          initialState: getStateAsPrimaryTenant(
            testStoreState,
            {},
            testTenantUser
          ),
        }
      );

      expect(
        queryByTestId(container, 'owner-form-notification-settings')
      ).toBeFalsy();
      expect(
        queryByTestId(container, 'tenant-form-notification-settings')
      ).toBeTruthy();
    });

    it('should update notification settings', async () => {
      const [{ container }, store] = renderWithStore(
        <ProfileNotifications history={mockHistory} />,
        {
          initialState: getStateAsPrimaryTenant(
            testStoreState,
            {},
            testTenantUser
          ),
        }
      );

      const settingsForm = getByTestId(
        container,
        'tenant-form-notification-settings'
      );
      const settingPaymentRentDue = getByTestId(
        settingsForm,
        'setting-paymentRentDue'
      );

      expect(settingPaymentRentDue.checked).toBe(false);
      await userEvent.click(settingPaymentRentDue);
      expect(settingPaymentRentDue.checked).toBe(true);

      const submitBtn = getByTestId(settingsForm, 'form-submit-btn');
      expect(submitBtn.disabled).toBe(false);
      userEvent.click(submitBtn);

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateUser({
            id: store.getState().profile.data.id,
            role: singular(USER_TYPES.tenant),
            userNotificationSettingAttributes: {
              id: testTenantUser.userNotificationSetting.id,
              paymentRentDue: true,
            },
          })
        );
      });
    });
  });

  describe('when logged in as a secondary owner', () => {
    it('should show owner notification settings', () => {
      const [{ container }] = renderWithStore(
        <ProfileNotifications history={mockHistory} />,
        {
          initialState: getStateAsSecondaryOwner(
            testStoreState,
            {},
            testOwnerUser
          ),
        }
      );

      expect(
        queryByTestId(container, 'owner-form-notification-settings')
      ).toBeTruthy();
      expect(
        queryByTestId(container, 'tenant-form-notification-settings')
      ).toBeFalsy();
    });
  });

  describe('when logged in as a secondary tenant', () => {
    it('should show tenant notification settings', () => {
      const [{ container }] = renderWithStore(
        <ProfileNotifications history={mockHistory} />,
        {
          initialState: getStateAsSecondaryTenant(
            testStoreState,
            testTenantUser
          ),
        }
      );

      expect(
        queryByTestId(container, 'owner-form-notification-settings')
      ).toBeFalsy();
      expect(
        queryByTestId(container, 'tenant-form-notification-settings')
      ).toBeTruthy();
    });
  });

  describe('when Tradie login', () => {
    it('shows notification settings of the tradie via a form', () => {
      const [{ container }] = renderWithStore(
        <ProfileNotifications history={mockHistory} />,
        { initialState: getStateAsExternalCreditor() }
      );

      expect(
        queryByTestId(container, 'external-creditor-form-notification-settings')
      ).toBeTruthy();
    });

    it('updates notification settings of the tradie via a form', async () => {
      const testTradie = { userNotificationSetting: { id: 66 } };

      const [{ container }, store] = renderWithStore(
        <ProfileNotifications history={mockHistory} />,
        {
          initialState: getStateAsExternalCreditor(
            testStoreState,
            {},
            testTradie
          ),
        }
      );

      const settingsForm = getByTestId(
        container,
        'external-creditor-form-notification-settings'
      );
      const settingJobsAvailable = getByTestId(
        settingsForm,
        'setting-jobsAvailable'
      );

      await userEvent.click(settingJobsAvailable);

      const submitBtn = getByTestId(settingsForm, 'form-submit-btn');
      expect(submitBtn.disabled).toBe(false);
      userEvent.click(submitBtn);

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateUser({
            id: store.getState().profile.data.id,
            role: singular(USER_TYPES.externalCreditor),
            userNotificationSettingAttributes: {
              id: testTradie.userNotificationSetting.id,
              jobsAvailable: true,
            },
          })
        );
      });
    });
  });
});
