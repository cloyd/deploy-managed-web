import { waitFor } from '@testing-library/dom';
import {
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
} from '../../../redux/profile';
import { USER_TYPES, fetchUser, updateCreditor } from '../../../redux/users';
import { getStateAsExternalCreditor } from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { ProfileExternalCreditorForm } from '../ExternalCreditorForm';

jest.mock('../../../hooks/use-async-postcode-search', () => ({
  useAsyncPostcodeSearch: () => [
    jest.fn(),
    { handleResetPostcodes: jest.fn(), postcodes: [] },
  ],
}));

describe('ProfileExternalCreditorForm', () => {
  const testExternalCreditor = { id: 123, isAuthyEnabled: true };
  const testAddress = {
    country: 'AUS', // Defaults to Australia
    postcode: '2000',
    state: 'NSW',
    street: '123 Biscuit st',
    suburb: 'Sydney',
  };

  const testStoreState = {
    marketplace: {
      meta: {
        tags: [
          { id: 1, name: 'Tag #1' },
          { id: 24, name: 'Tag #24' },
        ],
      },
    },
    settings: {
      authyEnabled: true,
    },
  };

  describe('when logged in as an external creditor', () => {
    describe('Personal Details', () => {
      it('shows form', () => {
        const [{ container }] = renderWithStore(
          <ProfileExternalCreditorForm />,
          {
            initialState: getStateAsExternalCreditor(testStoreState),
          }
        );

        expect(
          queryByTestId(container, 'user-form-primary-contact')
        ).toBeTruthy();

        expect(queryByTestId(container, 'form-two-factor-auth')).toBeTruthy();
      });

      // NOTE: passed on local, but not working on CI
      // TODO: resolve this on the next PR
      it.skip('updates personal details of external creditor', async () => {
        const testFormParams = {
          addressAttributes: { ...testAddress },
          primaryContactEmail: 'mintslice@managedapp.com.au',
          primaryContactFirstName: 'Mint',
          primaryContactLastName: 'Slice',
          primaryContactMobile: '0444444444',
          primaryContactDob: '31/08/1980',
          gstIncluded: true,
          tagIds: [],
        };

        const [{ container }, store] = renderWithStore(
          <ProfileExternalCreditorForm isTestMode={true} />,
          {
            initialState: getStateAsExternalCreditor(
              testStoreState,
              testExternalCreditor
            ),
          }
        );

        const kycForm = getByTestId(container, 'user-form-primary-contact');
        const submitBtn = getByTestId(kycForm, 'form-submit-btn');

        expect(submitBtn.disabled).toBe(true);

        await userEvent.type(
          getByTestId(kycForm, 'field-primary-contact-first-name'),
          testFormParams.primaryContactFirstName
        );

        await userEvent.type(
          getByTestId(kycForm, 'field-primary-contact-last-name'),
          testFormParams.primaryContactLastName
        );

        await userEvent.type(
          getByTestId(kycForm, 'field-primary-contact-email'),
          testFormParams.primaryContactEmail
        );

        expect(queryByTestId(kycForm, 'field-tag-select')).toBeTruthy();

        await userEvent.type(
          getByTestId(kycForm, 'field-primary-contact-mobile'),
          testFormParams.primaryContactMobile
        );

        const dobField = getByTestId(
          kycForm,
          'field-date-picker'
        ).querySelector('input');
        await userEvent.type(dobField, testFormParams.primaryContactDob);

        await userEvent.type(
          getByTestId(kycForm, 'field-address-street'),
          testFormParams.addressAttributes.street
        );

        await userEvent.type(
          getByTestId(kycForm, 'field-address-suburb'),
          testFormParams.addressAttributes.suburb
        );
        await userEvent.selectOptions(
          getByTestId(kycForm, 'field-address-state-select'),
          testFormParams.addressAttributes.state
        );
        await userEvent.type(
          getByTestId(kycForm, 'field-address-postcode'),
          testFormParams.addressAttributes.postcode
        );

        expect(submitBtn.disabled).toBe(false);

        userEvent.click(submitBtn);

        await waitFor(
          () => {
            expect(store.actions).toContainEqual(
              updateCreditor({
                ...testFormParams,
                id: testExternalCreditor.id,
                primaryContactDob:
                  'Sun Aug 31 1980 00:00:00 GMT+1000 (Australian Eastern Standard Time)',
              })
            );
          },
          {
            timeout: 10000,
          }
        );
      });
    });

    describe('FormTwoFactorAuth', () => {
      it('should request auth token', async () => {
        const [{ container }, store] = renderWithStore(
          <ProfileExternalCreditorForm />,
          {
            initialState: getStateAsExternalCreditor(
              testStoreState,
              {},
              { isAuthyEnabled: false }
            ),
          }
        );

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
        const [{ container }, store] = renderWithStore(
          <ProfileExternalCreditorForm />,
          {
            initialState: getStateAsExternalCreditor(
              testStoreState,
              {},
              { isAuthyEnabled: false }
            ),
          }
        );

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
        const [{ container }, store] = renderWithStore(
          <ProfileExternalCreditorForm />,
          {
            initialState: getStateAsExternalCreditor(
              testStoreState,
              testExternalCreditor
            ),
          }
        );

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

    describe('Company Details', () => {
      it('shows form', () => {
        const [{ container }] = renderWithStore(
          <ProfileExternalCreditorForm />,
          {
            initialState: getStateAsExternalCreditor(testStoreState),
          }
        );

        expect(queryByTestId(container, 'user-form-company')).toBeTruthy();
      });

      it('updates company details of external creditor', async () => {
        const testFormParams = {
          addressAttributes: { ...testAddress },
          legalName: 'Bubblegum Factory',
          taxNumber: 'abc123456',
          servicingRadiusKm: 32.1,
        };

        const [{ container }, store] = renderWithStore(
          <ProfileExternalCreditorForm />,
          {
            initialState: getStateAsExternalCreditor(
              testStoreState,
              testExternalCreditor
            ),
          }
        );

        const companyForm = getByTestId(container, 'user-form-company');
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
        // TODO: post code should be number
        await userEvent.type(
          getByTestId(companyForm, 'field-address-postcode'),
          testFormParams.addressAttributes.postcode
        );
        await userEvent.type(
          getByTestId(companyForm, 'field-company-service-radius'),
          String(testFormParams.servicingRadiusKm)
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
              ownerId: testExternalCreditor.id,
              ownerType: 'ExternalCreditor',
              servicingRadiusKm: testFormParams.servicingRadiusKm,
              state: testAddress.state,
              taxNumber: testFormParams.taxNumber,
              zip: parseInt(testAddress.postcode),
              licenseNumber: '',
            })
          );
        });
      });
    });

    it('fetches User and Promisepay company', async () => {
      /* eslint-disable no-unused-vars */
      const [{ container }, store] =
        /* eslint-enable no-unused-vars */
        renderWithStore(<ProfileExternalCreditorForm />, {
          initialState: getStateAsExternalCreditor(
            testStoreState,
            testExternalCreditor
          ),
        });

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          fetchUser({
            id: testExternalCreditor.id,
            type: singular(USER_TYPES.externalCreditor),
          })
        );
        expect(store.actions).toContainEqual(
          fetchCompany({
            ownerId: testExternalCreditor.id,
            ownerType: 'ExternalCreditor',
          })
        );
      });
    });
  });
});
