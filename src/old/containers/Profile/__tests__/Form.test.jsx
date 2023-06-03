import { waitFor } from '@testing-library/dom';
import {
  fireEvent,
  getByTestId,
  queryByTestId,
  queryByText,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { singular } from 'pluralize';
import React from 'react';

import { fetchCompany, updateCompany } from '../../../redux/company';
import {
  disableAuthy,
  enableAuthy,
  requestAuthySMS,
  resetPassword,
} from '../../../redux/profile';
import { USER_TYPES, fetchUser, updateUser } from '../../../redux/users';
import {
  getStateAsCorporateUser,
  getStateAsManager,
  getStateAsPrimaryOwner,
  getStateAsPrimaryTenant,
  getStateAsPrincipal,
  getStateAsSecondaryOwner,
  getStateAsSecondaryTenant,
} from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { ProfileForm } from '../Form';

describe('ProfileForm', () => {
  const testManager = { id: 123 };
  const testOwner = { id: 123 };
  const testTenant = { id: 123 };

  const testAgencyCompany = {
    legalName: 'Agency Promisepay Company',
    ownerId: 123,
    ownerType: 'Agency',
    taxNumber: 'abc123',
  };
  const testOwnerCompany = {
    legalName: 'Owner Promisepay Company',
    ownerId: 123,
    ownerType: 'Owner',
    taxNumber: 'abc123',
  };
  const testAddress = {
    country: 'AUS', // Defaults to Australia
    postcode: '2000',
    state: 'NSW',
    street: '123 Biscuit st',
    suburb: 'Sydney',
  };
  const testAgency = { id: 123, companyName: 'Managed', label: 'Test Agency' };

  const testStoreState = {
    agency: { agency: { ...testAgency } },
    company: {
      Agency: { [testManager.id]: testAgencyCompany },
      Owner: { [testOwner.id]: testOwnerCompany },
    },
    settings: {
      authyEnabled: true,
    },
  };

  describe('when logged in as a corporate user', () => {
    it('should show correct sections', () => {
      const [{ container }] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsCorporateUser(testStoreState),
      });

      expect(queryByTestId(container, 'card-wallet-balance')).toBeTruthy();
      expect(queryByTestId(container, 'download-report')).toBeFalsy();
      expect(queryByTestId(container, 'user-edit-form')).toBeTruthy();
      expect(queryByTestId(container, 'form-two-factor-auth')).toBeTruthy();
      expect(queryByTestId(container, 'user-form-personal')).toBeFalsy();
      expect(queryByTestId(container, 'user-form-primary-contact')).toBeFalsy();
      expect(queryByTestId(container, 'user-form-company')).toBeFalsy();
      expect(queryByTestId(container, 'bpay-value')).toBeFalsy();
    });

    it('should fetch only the user', async () => {
      const [{ container }, store] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsCorporateUser(testStoreState, testManager),
      });

      expect(queryByTestId(container, 'profile-form')).toBeTruthy();

      await waitFor(() => {
        expect(store.actions.length).toEqual(2);
        expect(store.actions[1]).toEqual(
          fetchUser({
            id: testManager.id,
            type: singular(USER_TYPES.corporateUser),
          })
        );
      });
    });
  });

  describe('when logged in as a manager', () => {
    it('should show correct sections', () => {
      const [{ container }] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsManager(testStoreState, testManager),
      });

      expect(queryByTestId(container, 'card-wallet-balance')).toBeFalsy();
      expect(queryByTestId(container, 'download-report')).toBeFalsy();
      expect(queryByTestId(container, 'user-edit-form')).toBeTruthy();
      expect(queryByTestId(container, 'form-two-factor-auth')).toBeTruthy();
      expect(queryByTestId(container, 'user-form-personal')).toBeFalsy();
      expect(queryByTestId(container, 'user-form-primary-contact')).toBeFalsy();
      expect(queryByTestId(container, 'user-form-company')).toBeFalsy();
      expect(queryByTestId(container, 'bpay-value')).toBeFalsy();
    });

    it('should fetch only the user', async () => {
      const [{ container }, store] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsManager(testStoreState, testManager),
      });

      expect(queryByTestId(container, 'profile-form')).toBeTruthy();

      await waitFor(() => {
        expect(store.actions.length).toEqual(1);
        expect(store.actions[0]).toEqual(
          fetchUser({ id: testManager.id, type: singular(USER_TYPES.manager) })
        );
      });
    });
  });

  describe('when logged in as a primary owner', () => {
    it('should show correct sections', () => {
      const [{ container }] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsPrimaryOwner(testStoreState, testOwner),
      });

      expect(queryByTestId(container, 'card-wallet-balance')).toBeTruthy();
      expect(queryByTestId(container, 'download-report')).toBeFalsy();
      expect(queryByTestId(container, 'user-edit-form')).toBeTruthy();
      expect(queryByTestId(container, 'form-two-factor-auth')).toBeTruthy();
      expect(queryByTestId(container, 'user-form-personal')).toBeTruthy();
      expect(queryByTestId(container, 'user-form-primary-contact')).toBeFalsy();
      expect(queryByTestId(container, 'user-form-company')).toBeTruthy();
      expect(queryByTestId(container, 'bpay-value')).toBeFalsy();
    });

    it('should fetch Promisepay company', async () => {
      const [{ container }, store] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsPrimaryOwner(testStoreState, testOwner),
      });

      expect(queryByTestId(container, 'profile-form')).toBeTruthy();

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          fetchUser({ id: testOwner.id, type: singular(USER_TYPES.owner) })
        );
        expect(store.actions).toContainEqual(
          fetchCompany({ ownerId: testOwner.id, ownerType: 'Owner' })
        );
      });
    });

    it.skip('should update kyc details', async () => {
      const testFormParams = {
        addressAttributes: { ...testAddress },
        dob: '31/08/1980',
      };
      const [{ container }, store] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsPrimaryOwner(testStoreState, testOwner),
      });

      const kycForm = getByTestId(container, 'user-form-personal');
      expect(queryByTestId(kycForm, 'form-submit-btn').disabled).toBe(true);

      const dobField = getByTestId(kycForm, 'field-date-picker').querySelector(
        'input'
      );
      await userEvent.type(dobField, testFormParams.dob);

      await userEvent.type(
        getByTestId(kycForm, 'field-address-street'),
        testFormParams.addressAttributes.street
      );

      await userEvent.type(
        getByTestId(kycForm, 'field-address-suburb'),
        testFormParams.addressAttributes.suburb
      );

      fireEvent.change(getByTestId(kycForm, 'field-address-state-select'), {
        target: { value: testFormParams.addressAttributes.state },
      });

      await userEvent.type(
        getByTestId(kycForm, 'field-address-postcode'),
        testFormParams.addressAttributes.postcode
      );

      const submitBtn = getByTestId(kycForm, 'form-submit-btn');
      expect(submitBtn.disabled).toBe(false);
      userEvent.click(submitBtn);

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateUser({
            ...testFormParams,
            id: testTenant.id,
            dob: 'Sun Aug 31 1980 00:00:00 GMT+1000 (Australian Eastern Standard Time)',
            role: singular(USER_TYPES.owner),
          })
        );
      });
    });

    it('should update company details', async () => {
      const testFormParams = {
        addressAttributes: { ...testAddress },
        legalName: 'Bubblegum Factory',
        taxNumber: 'abc123456',
      };
      const [{ container }, store] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsPrimaryOwner(testStoreState, testOwner),
      });

      const companyForm = getByTestId(container, 'user-form-company');
      expect(companyForm).toBeTruthy();

      const submitBtn = getByTestId(companyForm, 'form-submit-btn');
      expect(submitBtn.disabled).toBe(true);

      await userEvent.type(
        getByTestId(companyForm, 'field-company-legal-name'),
        `{selectall}{backspace}${testFormParams.legalName}`
      );

      await userEvent.type(
        getByTestId(companyForm, 'field-company-tax-number'),
        `{selectall}{backspace}${testFormParams.taxNumber}`
      );

      await userEvent.type(
        getByTestId(companyForm, 'field-address-street'),
        testFormParams.addressAttributes.street
      );

      await userEvent.type(
        getByTestId(companyForm, 'field-address-suburb'),
        testFormParams.addressAttributes.suburb
      );

      await userEvent.selectOptions(
        getByTestId(companyForm, 'field-address-state-select'),
        testFormParams.addressAttributes.state
      );

      await userEvent.type(
        getByTestId(companyForm, 'field-address-postcode'),
        testFormParams.addressAttributes.postcode
      );

      expect(submitBtn.disabled).toBe(false);
      userEvent.click(submitBtn);

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateCompany({
            addressLine1: testAddress.street,
            city: testAddress.suburb,
            country: testAddress.country,
            legalName: testFormParams.legalName,
            ownerId: testOwner.id,
            ownerType: 'Owner',
            state: testAddress.state,
            taxNumber: testFormParams.taxNumber,
            zip: parseInt(testAddress.postcode),
            servicingRadiusKm: undefined,
            licenseNumber: '',
          })
        );
      });
    });
  });

  describe('when logged in as a primary tenant', () => {
    it('should show correct sections', () => {
      const [{ container }] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsPrimaryTenant(testStoreState),
      });

      expect(queryByTestId(container, 'user-edit-form')).toBeTruthy();
      expect(queryByTestId(container, 'form-two-factor-auth')).toBeTruthy();
      expect(queryByTestId(container, 'user-form-personal')).toBeFalsy();
      expect(queryByTestId(container, 'user-form-primary-contact')).toBeFalsy();
      expect(queryByTestId(container, 'user-form-company')).toBeFalsy();
    });

    it('should hide BPay details if paying via BPay', () => {
      const userProfile = { paymentMethod: 'bpay' };
      const [{ container }] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsPrimaryTenant(testStoreState, userProfile),
      });

      expect(queryByTestId(container, 'bpay-value')).toBeFalsy();
    });

    it('should fetch only the user', async () => {
      const [{ container }, store] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsPrimaryTenant(testStoreState, testTenant),
      });

      expect(queryByTestId(container, 'profile-form')).toBeTruthy();

      await waitFor(() => {
        expect(store.actions.length).toEqual(1);
        expect(store.actions[0]).toEqual(
          fetchUser({
            id: testTenant.id,
            type: singular(USER_TYPES.tenant),
          })
        );
      });
    });
  });

  describe('when logged in as a principal', () => {
    it('should show correct sections', () => {
      const [{ container }] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsPrincipal(testStoreState, testManager),
      });

      expect(queryByTestId(container, 'card-wallet-balance')).toBeTruthy();
      expect(queryByTestId(container, 'download-report')).toBeFalsy();
      expect(queryByTestId(container, 'user-edit-form')).toBeTruthy();
      expect(queryByTestId(container, 'form-two-factor-auth')).toBeTruthy();
      expect(queryByTestId(container, 'user-form-personal')).toBeFalsy();
      expect(queryByTestId(container, 'bpay-value')).toBeFalsy();
    });
  });

  describe('when logged in as a secondary owner', () => {
    it('should show correct sections', () => {
      const [{ container }] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsSecondaryOwner(testStoreState),
      });

      expect(queryByTestId(container, 'card-wallet-balance')).toBeTruthy();
      expect(queryByTestId(container, 'download-report')).toBeFalsy();
      expect(queryByTestId(container, 'user-edit-form')).toBeTruthy();
      expect(queryByTestId(container, 'form-two-factor-auth')).toBeTruthy();
      expect(queryByTestId(container, 'user-form-personal')).toBeTruthy();
      expect(queryByTestId(container, 'user-form-primary-contact')).toBeFalsy();
      expect(queryByTestId(container, 'user-form-company')).toBeFalsy();
      expect(queryByTestId(container, 'bpay-value')).toBeFalsy();
    });

    it('should fetch Promisepay company', async () => {
      const [{ container }, store] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsSecondaryOwner(testStoreState, testOwner),
      });

      expect(queryByTestId(container, 'profile-form')).toBeTruthy();

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          fetchUser({ id: testOwner.id, type: singular(USER_TYPES.owner) })
        );
        expect(store.actions).toContainEqual(
          fetchCompany({ ownerId: testOwner.id, ownerType: 'Owner' })
        );
      });
    });
  });

  describe('when logged in as a secondary tenant', () => {
    it('should show correct sections', () => {
      const [{ container }] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsSecondaryTenant(testStoreState),
      });

      expect(queryByTestId(container, 'user-edit-form')).toBeTruthy();
      expect(queryByTestId(container, 'form-two-factor-auth')).toBeTruthy();
      expect(queryByTestId(container, 'user-form-personal')).toBeFalsy();
      expect(queryByTestId(container, 'user-form-primary-contact')).toBeFalsy();
      expect(queryByTestId(container, 'user-form-company')).toBeFalsy();
    });

    it('should hide BPay details even if paying via BPay', () => {
      const userProfile = { paymentMethod: 'bpay' };
      const [{ container }] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsSecondaryTenant(testStoreState, userProfile),
      });

      expect(queryByTestId(container, 'bpay-value')).toBeFalsy();
    });

    it('should fetch only the user', async () => {
      const [{ container }, store] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsSecondaryTenant(testStoreState, testTenant),
      });

      expect(queryByTestId(container, 'profile-form')).toBeTruthy();

      await waitFor(() => {
        expect(store.actions.length).toEqual(1);
        expect(store.actions[0]).toEqual(
          fetchUser({
            id: testTenant.id,
            type: singular(USER_TYPES.tenant),
          })
        );
      });
    });
  });

  describe('FormTwoFactorAuth', () => {
    it('should request auth token', async () => {
      const [{ container }, store] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsManager(
          testStoreState,
          {},
          { isAuthyEnabled: false }
        ),
      });

      const authyForm = getByTestId(container, 'form-two-factor-auth');
      expect(
        queryByText(authyForm, 'Disable two-factor authentication')
      ).toBeFalsy();

      const requestAuthyBtn = getByTestId(authyForm, 'request-auth-btn');
      userEvent.click(requestAuthyBtn);

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          requestAuthySMS(store.getState().profile.data.email)
        );
      });
    });

    it('should submit auth token', async () => {
      const testInput = 'abc123';
      const [{ container }, store] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsManager(
          testStoreState,
          {},
          { isAuthyEnabled: false }
        ),
      });

      const authyForm = getByTestId(container, 'form-two-factor-auth');
      expect(
        queryByText(authyForm, 'Disable two-factor authentication')
      ).toBeFalsy();

      const submitBtn = getByTestId(authyForm, 'form-submit-btn');
      expect(submitBtn.disabled).toBe(true);

      const authyInput = getByTestId(authyForm, 'authy-token-input');
      await userEvent.type(authyInput, testInput);

      expect(submitBtn.disabled).toBe(false);
      userEvent.click(submitBtn);

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          enableAuthy({ authyToken: testInput })
        );
      });
    });

    it('should disable auth', async () => {
      const testInput = 'abc123';
      const [{ container }, store] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsManager(
          testStoreState,
          {},
          { isAuthyEnabled: true }
        ),
      });

      const authyForm = getByTestId(container, 'form-two-factor-auth');
      expect(
        queryByText(authyForm, 'Enable two-factor authentication')
      ).toBeFalsy();

      const submitBtn = getByTestId(authyForm, 'form-submit-btn');
      expect(submitBtn.disabled).toBe(true);

      const authyInput = getByTestId(authyForm, 'authy-token-input');
      await userEvent.type(authyInput, testInput);

      expect(submitBtn.disabled).toBe(false);
      userEvent.click(submitBtn);

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          disableAuthy({ authyToken: testInput })
        );
      });
    });
  });

  describe('FormUser', () => {
    // rewrite this test since it won't work anymore
    it.skip('should reset password', async () => {
      const [{ container }, store] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsPrimaryTenant(testStoreState, testTenant),
      });

      const editForm = getByTestId(container, 'user-edit-form');
      const resetBtn = getByTestId(editForm, 'reset-password-btn');
      expect(resetBtn.disabled).toBe(false);
      userEvent.click(resetBtn);

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          resetPassword({ email: store.getState().profile.data.email })
        );
      });
    });

    it('should update user details', async () => {
      const testFormParams = {
        firstName: 'Tim',
        lastName: 'Tam',
        email: 'timtam@managedapp.com.au',
        phoneNumber: '0444444444',
      };
      const [{ container }, store] = renderWithStore(<ProfileForm />, {
        initialState: getStateAsPrimaryTenant(testStoreState, testTenant),
      });

      const editForm = getByTestId(container, 'user-edit-form');
      expect(queryByTestId(editForm, 'form-submit-btn').disabled).toBe(true);

      const firstNameField = getByTestId(editForm, 'field-user-first-name');
      await userEvent.type(firstNameField, testFormParams.firstName);

      const lastNameField = getByTestId(editForm, 'field-user-last-name');
      await userEvent.type(lastNameField, testFormParams.lastName);

      const emailField = getByTestId(editForm, 'field-user-email');
      await userEvent.type(
        emailField,
        `{selectall}{backspace}${testFormParams.email}`
      );

      const phoneNumberField = getByTestId(editForm, 'field-user-phone-number');
      await userEvent.type(phoneNumberField, testFormParams.phoneNumber);

      const submitBtn = getByTestId(editForm, 'form-submit-btn');
      expect(submitBtn.disabled).toBe(false);
      userEvent.click(submitBtn);

      await waitFor(
        () => {
          expect(store.actions).toContainEqual(
            updateUser({
              ...testFormParams,
              phoneNumber: testFormParams.phoneNumber,
              id: testTenant.id,
              isAuthyEnabled: false,
              role: singular(USER_TYPES.tenant),
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
