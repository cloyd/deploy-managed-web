import { waitFor } from '@testing-library/dom';
import {
  getAllByTestId,
  getByTestId,
  queryAllByTestId,
  queryByTestId,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ReactDOM from 'react-dom';

import { fetchAccounts, setDisbursement } from '../../../../redux/assembly';
import { fetchCompany, updateCompany } from '../../../../redux/company';
import {
  EXTERNAL_CREDITOR_CLASSIFICATIONS,
  createCreditor,
  updateCreditor,
} from '../../../../redux/users';
import {
  getStateAsManager,
  getStateAsPrincipal,
} from '../../../../test/getStateAsUser';
import { renderWithStore } from '../../../../test/renderWithStore';
import { ContactsCreditor } from '../Creditor';

let onChange = () => {};

const handleInputChange = (id) => (e) => {
  let fieldType;
  switch (id) {
    case 'card-name-field':
      fieldType = 'cardName';
      break;
    case 'card-number-field':
      fieldType = 'cardNumber';
      break;
    case 'card-expiry-field':
      fieldType = 'cardExpiry';
      break;
    case 'card-cvv-field':
      fieldType = 'cardCvv';
      break;
    case 'account-name-field':
      fieldType = 'bankAccountName';
      break;
    case 'account-number-field':
      fieldType = 'bankAccountNumber';
      break;
    case 'routing-number-field':
      fieldType = 'bankRoutingNumber';
      break;
    default:
  }
  e.fieldType = fieldType;
  e.valid = true;
  onChange(e);
};

beforeEach(() => {
  window.assembly.hostedFields.mockImplementation(() => ({
    create: () => ({
      mount: (fieldId) => {
        const id = fieldId.substring(1);
        const field = document.getElementById(id);
        const input = (
          <input
            type="text"
            data-testid={`${id}-input`}
            onChange={handleInputChange(id)}
          />
        );
        ReactDOM.render(input, field);
      },
      on: (_, fn) => {
        onChange = fn;
      },
    }),
    createBankAccount: jest.fn(() =>
      Promise.resolve({
        bank_accounts: {
          id: '1',
        },
      })
    ),
    createCardAccount: jest.fn(() =>
      Promise.resolve({
        card_accounts: {
          id: '1',
        },
      })
    ),
    destroy: jest.fn(),
  }));
});

describe('ContactsCreditor', () => {
  const mockHistory = {
    push: jest.fn(),
  };

  window.assembly = {
    hostedFields: jest.fn(),
  };

  /**
   * Test user data
   */
  const testAddress = {
    country: 'AUS', // Defaults to Australia
    postcode: '2000',
    state: 'NSW',
    street: '123 Biscuit st',
    suburb: 'Sydney',
  };
  const testCreditors = {
    11: {
      id: 11,
      address: { ...testAddress },
      primaryContactEmail: 'timtam@managedapp.com.au',
      primaryContactFirstName: 'Tim',
      primaryContactLastName: 'Tam',
      primaryContactMobile: '1111111111',
      typeOf: 'bathroom_renovation',
      classification: EXTERNAL_CREDITOR_CLASSIFICATIONS.tradie,
    },
    22: {
      id: 22,
      bpayOutProvider: true,
      primaryContactEmail: 'creditor2@managedapp.com.au',
      primaryContactFirstName: 'BPay',
      primaryContactLastName: 'Out Provider',
      classification: EXTERNAL_CREDITOR_CLASSIFICATIONS.serviceProvider,
    },
    33: {
      id: 33,
      primaryContactEmail: 'creditor2@managedapp.com.au',
      primaryContactFirstName: 'Monte',
      primaryContactLastName: 'Carlo',
      classification: EXTERNAL_CREDITOR_CLASSIFICATIONS.tradie,
      hasLogin: true,
    },
  };

  /**
   * Test account data
   */
  const testBank = {
    id: 111,
    accountName: 'bank account',
    accountNumber: 'XXX545',
    accountType: 'savings',
    bankName: 'Tenant bank',
    promisepayId: 'bank-111',
    routingNumber: 'XXXXX6',
  };
  const testBank2 = {
    id: 222,
    accountName: 'Another account',
    accountNumber: 'XXX222',
    accountType: 'savings',
    bankName: 'Second bank',
    promisepayId: 'bank-222',
    routingNumber: 'XXXXX7',
  };

  const testStoreState = {
    assembly: {
      banks: [testBank.promisepayId, testBank2.promisepayId],
      data: {
        [testBank.promisepayId]: testBank,
        [testBank2.promisepayId]: testBank2,
      },
      disbursements: {
        default: testBank.promisepayId,
      },
    },
    users: {
      externalCreditor: { data: testCreditors, results: [11, 22] },
    },
  };

  it('should redirect if creditor is a BPay Out Provider', async () => {
    const testMatch = { params: { id: 22 } };
    const [{ container }] = renderWithStore(
      <ContactsCreditor history={mockHistory} match={testMatch} />,
      { initialState: getStateAsPrincipal(testStoreState) }
    );

    expect(
      queryByTestId(container, 'container-contacts-creditor')
    ).toBeTruthy();

    await waitFor(() => {
      expect(mockHistory.push).toHaveBeenCalledWith('/contacts/creditors');
    });
  });

  describe('when creating an external creditor', () => {
    const testMatch = { params: { id: 'create' } };

    it('should only show primary contact form', () => {
      const [{ container }] = renderWithStore(
        <ContactsCreditor history={mockHistory} match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      expect(queryByTestId(container, 'header-title').textContent).toEqual(
        'Invite an external creditor'
      );
      expect(
        queryByTestId(container, 'user-form-primary-contact')
      ).toBeTruthy();
      expect(queryByTestId(container, 'user-form-company')).toBeFalsy();
      expect(queryByTestId(container, 'payment-disbursement')).toBeFalsy();
    });

    // NOTE: passed on local, but not working on CI
    // TODO: resolve this on the next PR
    it.skip('should create creditor', async () => {
      const { address, ...otherParams } = testCreditors[11];
      const testFormParams = {
        ...otherParams,
        addressAttributes: address,
        id: undefined,
      };

      const [{ container }, store] = renderWithStore(
        <ContactsCreditor history={mockHistory} match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      const submitBtn = getByTestId(container, 'form-submit-btn');
      expect(
        queryByTestId(container, 'user-form-primary-contact')
      ).toBeTruthy();
      expect(submitBtn.disabled).toBe(true);

      await userEvent.type(
        getByTestId(container, 'field-primary-contact-first-name'),
        testFormParams.primaryContactFirstName
      );

      await userEvent.type(
        getByTestId(container, 'field-primary-contact-last-name'),
        testFormParams.primaryContactLastName
      );

      await userEvent.type(
        getByTestId(container, 'field-primary-contact-email'),
        testFormParams.primaryContactEmail
      );

      await userEvent.selectOptions(getByTestId(container, 'field-type-of'), [
        testFormParams.typeOf,
      ]);

      await userEvent.selectOptions(
        getByTestId(container, 'field-classification'),
        [testFormParams.classification]
      );

      await userEvent.type(
        getByTestId(container, 'field-primary-contact-mobile'),
        testFormParams.primaryContactMobile
      );

      await userEvent.type(
        getByTestId(container, 'field-address-street'),
        testFormParams.addressAttributes.street
      );

      await userEvent.type(
        getByTestId(container, 'field-address-suburb'),
        testFormParams.addressAttributes.suburb
      );

      await userEvent.selectOptions(
        getByTestId(container, 'field-address-state-select'),
        testFormParams.addressAttributes.state
      );

      await userEvent.type(
        getByTestId(container, 'field-address-postcode'),
        testFormParams.addressAttributes.postcode
      );

      expect(submitBtn.disabled).toBe(false);
      userEvent.click(submitBtn);

      await waitFor(
        () => {
          expect(store.actions).toContainEqual(
            createCreditor({
              ...testFormParams,
              gstIncluded: true,
              primaryContactDob: '',
            })
          );
        },
        {
          timeout: 10000,
        }
      );
    });
  });

  describe('when editing an external creditor', () => {
    const testMatch = { params: { id: 11 } };

    it('should show all external creditor forms', () => {
      const [{ container }] = renderWithStore(
        <ContactsCreditor history={mockHistory} match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      expect(queryByTestId(container, 'header-title').textContent).toEqual(
        'Edit an external creditor'
      );
      expect(
        queryByTestId(container, 'user-form-primary-contact')
      ).toBeTruthy();
      expect(queryByTestId(container, 'user-form-company')).toBeTruthy();
      expect(queryByTestId(container, 'payment-disbursement')).toBeTruthy();
    });

    it('should fetch external creditor data', async () => {
      const [{ container }, store] = renderWithStore(
        <ContactsCreditor history={mockHistory} match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      expect(queryByTestId(container, 'user-form-company')).toBeTruthy();

      await waitFor(() => {
        expect(store.actions).toHaveLength(4);
        expect(store.actions).toContainEqual(
          fetchAccounts({ externalCreditorId: testMatch.params.id })
        );
        expect(store.actions).toContainEqual(
          fetchCompany({
            ownerId: testMatch.params.id,
            ownerType: 'ExternalCreditor',
          })
        );
      });
    });

    it('should update creditor', async () => {
      const { address, ...oldParams } = testCreditors[11];
      const testFormParams = {
        addressAttributes: {
          suburb: 'Candyland',
        },
        primaryContactEmail: 'mintslice@managedapp.com.au',
        primaryContactFirstName: 'Mint',
        primaryContactLastName: 'Slice',
        typeOf: 'pest_control',
        classification: EXTERNAL_CREDITOR_CLASSIFICATIONS.serviceProvider,
      };

      const [{ container }, store] = renderWithStore(
        <ContactsCreditor history={mockHistory} match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );

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

      await userEvent.selectOptions(getByTestId(contactForm, 'field-type-of'), [
        testFormParams.typeOf,
      ]);

      await userEvent.selectOptions(
        getByTestId(contactForm, 'field-classification'),
        [testFormParams.classification]
      );

      await userEvent.type(
        getByTestId(contactForm, 'field-address-suburb'),
        `{selectall}{backspace}${testFormParams.addressAttributes.suburb}`
      );

      expect(submitBtn.disabled).toBe(false);
      userEvent.click(submitBtn);

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          updateCreditor({
            ...oldParams,
            ...testFormParams,
            addressAttributes: {
              ...address,
              ...testFormParams.addressAttributes,
              postcode: parseInt(testAddress.postcode),
            },
            gstIncluded: true,
            primaryContactDob: '',
            primaryContactMobile: 1111111111,
          })
        );
      });
    });

    it('should update company', async () => {
      const testFormParams = {
        addressAttributes: { ...testAddress },
        legalName: 'Bubblegum Factory',
        taxNumber: 'abc123456',
      };

      const [{ container }, store] = renderWithStore(
        <ContactsCreditor history={mockHistory} match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      const companyForm = getByTestId(container, 'user-form-company');
      expect(companyForm).toBeTruthy();

      const submitBtn = getByTestId(companyForm, 'form-submit-btn');
      expect(submitBtn.disabled).toBe(true);

      await userEvent.type(
        getByTestId(companyForm, 'field-company-legal-name'),
        testFormParams.legalName
      );

      await userEvent.type(
        getByTestId(companyForm, 'field-company-tax-number'),
        testFormParams.taxNumber
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

      await waitFor(
        () => {
          expect(store.actions).toContainEqual(
            updateCompany({
              addressLine1: testAddress.street,
              city: testAddress.suburb,
              country: testAddress.country,
              legalName: testFormParams.legalName,
              ownerId: testMatch.params.id,
              ownerType: 'ExternalCreditor',
              state: testAddress.state,
              taxNumber: testFormParams.taxNumber,
              zip: parseInt(testAddress.postcode),
              servicingRadiusKm: undefined,
              licenseNumber: '',
            })
          );
        },
        {
          timeout: 10000,
        }
      );
    });

    it('should change disbursement account', async () => {
      const [{ container }, store] = renderWithStore(
        <ContactsCreditor history={mockHistory} match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );
      expect(queryAllByTestId(container, 'payment-bank-value').length).toBe(1);

      const changeBtn = getByTestId(container, 'payment-account-change-btn');
      expect(changeBtn.disabled).toBe(false);
      userEvent.click(changeBtn);

      await waitFor(() => {
        expect(queryAllByTestId(container, 'payment-bank-value').length).toBe(
          2
        );
      });

      expect(store.actions.length).toEqual(4); // Prior fetch actions

      const bankAccounts = getAllByTestId(container, 'payment-bank-value');
      const useAccountBtn = getByTestId(
        bankAccounts[1],
        'bank-use-account-btn'
      );
      expect(useAccountBtn).toBeTruthy();
      userEvent.click(useAccountBtn);

      expect(store.actions.length).toEqual(5);

      await waitFor(() => {
        expect(store.actions).toContainEqual(
          setDisbursement({
            externalCreditorId: 11,
            promisepayId: testBank2.promisepayId,
          })
        );
      });
    });
  });

  describe('when editing an external creditor with a login', () => {
    const testMatch = { params: { id: 33 } };

    it('should hide payment details form', () => {
      const [{ container }] = renderWithStore(
        <ContactsCreditor history={mockHistory} match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      expect(queryByTestId(container, 'header-title').textContent).toEqual(
        'Edit an external creditor'
      );
      expect(
        queryByTestId(container, 'user-form-primary-contact')
      ).toBeTruthy();
      expect(queryByTestId(container, 'user-form-company')).toBeTruthy();
      expect(queryByTestId(container, 'payment-disbursement')).toBeFalsy();
    });

    it('should not fetch external creditor account data', async () => {
      const [{ container }, store] = renderWithStore(
        <ContactsCreditor history={mockHistory} match={testMatch} />,
        { initialState: getStateAsManager(testStoreState) }
      );

      expect(queryByTestId(container, 'user-form-company')).toBeTruthy();

      await waitFor(() => {
        expect(store.actions).toHaveLength(3);
      });
    });
  });
});
