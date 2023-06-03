import { waitFor } from '@testing-library/dom';
import {
  fireEvent,
  getByTestId,
  getByText,
  queryByTestId,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { singular } from 'pluralize';
import React from 'react';

import { fetchAgency, updateAgency } from '../../../redux/agency';
import { fetchCompany, updateCompany } from '../../../redux/company';
import { USER_TYPES, fetchUser } from '../../../redux/users';
import { getStateAsPrincipal } from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { AgencyProfile } from '../AgencyProfile';

describe('AgencyProfile', () => {
  const testManager = { id: 123 };
  const testOwner = { id: 123 };

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

  describe('when logged in as a principal', () => {
    it('should show correct sections', () => {
      const [{ container }] = renderWithStore(<AgencyProfile />, {
        initialState: getStateAsPrincipal(testStoreState, testManager),
      });

      expect(
        queryByTestId(container, 'user-form-primary-contact')
      ).toBeTruthy();
      expect(queryByTestId(container, 'user-form-company')).toBeTruthy();
    });

    it('should fetch agency and Promisepay company', async () => {
      const [{ container }, store] = renderWithStore(<AgencyProfile />, {
        initialState: getStateAsPrincipal(testStoreState, testManager),
      });

      expect(queryByTestId(container, 'agency-profile-form')).toBeTruthy();

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          fetchUser({ id: testManager.id, type: singular(USER_TYPES.manager) })
        );
        expect(store.actions).toContainEqual(
          fetchAgency({ agencyId: testManager.id })
        );
        expect(store.actions).toContainEqual(
          fetchCompany({ ownerId: testManager.id, ownerType: 'Agency' })
        );
      });
    });
    // NOTE: passed on local, but not working on CI
    // TODO: resolve this on the next PR
    it.skip('should update agency primary contact', async () => {
      const testFormParams = {
        addressAttributes: { ...testAddress },
        primaryContactEmail: 'mintslice@managedapp.com.au',
        primaryContactFirstName: 'Mint',
        primaryContactLastName: 'Slice',
        primaryContactMobile: '0400000000',
      };

      const [{ container }, store] = renderWithStore(<AgencyProfile />, {
        initialState: getStateAsPrincipal(testStoreState, testManager),
      });

      const contactForm = getByTestId(container, 'user-form-primary-contact');
      expect(contactForm).toBeTruthy();

      const submitBtn = getByTestId(contactForm, 'form-submit-btn');
      expect(submitBtn.disabled).toBe(true);

      await userEvent.type(
        getByTestId(contactForm, 'field-primary-contact-first-name'),
        `{selectall}{backspace}${testFormParams.primaryContactFirstName}`
      );

      await userEvent.type(
        getByTestId(contactForm, 'field-primary-contact-last-name'),
        `{selectall}{backspace}${testFormParams.primaryContactLastName}`
      );

      await userEvent.type(
        getByTestId(contactForm, 'field-primary-contact-email'),
        `{selectall}{backspace}${testFormParams.primaryContactEmail}`
      );

      await userEvent.selectOptions(
        getByTestId(contactForm, 'form-field-gstIncluded'),
        [getByText(contactForm, 'No')]
      );

      await userEvent.type(
        getByTestId(contactForm, 'field-primary-contact-mobile'),
        `{selectall}{backspace}${testFormParams.primaryContactMobile}`
      );

      await userEvent.type(
        getByTestId(contactForm, 'field-address-street'),
        testFormParams.addressAttributes.street
      );

      await userEvent.type(
        getByTestId(contactForm, 'field-address-suburb'),
        testFormParams.addressAttributes.suburb
      );

      fireEvent.change(getByTestId(contactForm, 'field-address-state-select'), {
        target: { value: testFormParams.addressAttributes.state },
      });

      await userEvent.type(
        getByTestId(contactForm, 'field-address-postcode'),
        testFormParams.addressAttributes.postcode
      );

      expect(submitBtn.disabled).toBe(false);
      userEvent.click(submitBtn);

      await waitFor(
        () => {
          expect(store.actions).toContainEqual(
            updateAgency({
              ...testFormParams,
              addressAttributes: {
                ...testAddress,
                ...testFormParams.addressAttributes,
              },
              id: testAgency.id,
              gstIncluded: 'false',
              primaryContactDob: '',
            })
          );
        },
        {
          timeout: 10000,
        }
      );
    });

    it('should update company details', async () => {
      const testFormParams = {
        addressAttributes: { ...testAddress },
        legalName: 'Bubblegum Factory',
        taxNumber: 'abc123456',
      };
      const [{ container }, store] = renderWithStore(<AgencyProfile />, {
        initialState: getStateAsPrincipal(testStoreState, testManager),
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

      // TODO: zip code should be type int not string
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
            ownerId: testManager.id,
            ownerType: 'Agency',
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
});
