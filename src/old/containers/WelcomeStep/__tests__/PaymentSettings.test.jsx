import { waitFor } from '@testing-library/dom';
import { getByTestId, getByText, queryByTestId } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';

import { fetchAccounts } from '../../../redux/assembly';
import { fetchProperties } from '../../../redux/property';
import {
  getStateAsExternalCreditor,
  getStateAsPrimaryTenant,
  getStateAsPrincipal,
} from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { WelcomeStepPaymentSettings } from '../PaymentSettings';

window.assembly = {
  hostedFields: jest.fn(),
};
window.confirm = jest.fn(() => true);

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

describe('WelcomeStepPaymentSettings', () => {
  const testBanks = {
    11: {
      id: 11,
      accountName: 'Cool account',
      accountNumber: 'XXX123',
      accountType: 'savings',
      bankName: 'Cool bank',
      promisepayId: 'bank-11',
      routingNumber: 'XXXXX4',
    },
    22: {
      id: 22,
      accountName: 'Super account',
      accountNumber: 'XXX567',
      accountType: 'savings',
      bankName: 'Super bank',
      promisepayId: 'bank-22',
      routingNumber: 'XXXXX8',
    },
  };

  const testCards = {
    111: {
      expiryMonth: '11',
      expiryYear: '2032',
      fullName: 'Not in use',
      id: 111,
      isDefault: false,
      isInUse: false,
      number: '4111-11XX-XXXX-1111',
      promisepayId: 'card-111',
      type: 'visa',
    },
    222: {
      expiryMonth: '1',
      expiryYear: '2026',
      fullName: 'In use',
      id: 222,
      isDefault: true,
      isInUse: true,
      number: '1234-56XX-XX34-5678',
      promisepayId: 'card-222',
      type: 'visa',
    },
  };

  describe('as a principal', () => {
    const testStoreState = {
      assembly: {
        banks: [testBanks[11].promisepayId, testBanks[22].promisepayId],
        cards: [testCards[111].promisepayId, testCards[222].promisepayId],
        data: {
          [testBanks[11].promisepayId]: testBanks[11],
          [testBanks[22].promisepayId]: testBanks[22],
          [testCards[111].promisepayId]: testCards[111],
          [testCards[222].promisepayId]: testCards[222],
        },
        disbursements: { default: testBanks[11].promisepayId },
        payments: {},
      },
    };
    const testProfile = { id: 1 };
    const testManager = { id: 1, authyEnabled: true };
    const initialState = getStateAsPrincipal(
      testStoreState,
      testProfile,
      testManager
    );

    it('should make the correct fetches', async () => {
      const [{ container }, store] = renderWithStore(
        <WelcomeStepPaymentSettings />,
        { initialState }
      );

      expect(
        queryByTestId(container, 'payment-settings-disbursement')
      ).toBeTruthy();
      expect(queryByTestId(container, 'payment-settings-default')).toBeTruthy();
      expect(queryByTestId(container, 'payment-dda-card')).toBeTruthy();

      await waitFor(() => {
        expect(store.actions.length).toEqual(2);
        expect(store.actions).toContainEqual(fetchAccounts());
        expect(store.actions).toContainEqual(fetchProperties());
      });
    });

    it('should show the correct accounts', async () => {
      const [{ container }] = renderWithStore(<WelcomeStepPaymentSettings />, {
        initialState,
      });

      const disbursementSection = getByTestId(
        container,
        'payment-settings-disbursement'
      );
      expect(
        getByTestId(disbursementSection, 'section-heading').textContent
      ).toEqual('Where would you like payments deposited?');
      expect(
        getByText(
          disbursementSection,
          `${testBanks[11].routingNumber}-${testBanks[11].accountNumber}`
        )
      ).toBeTruthy();

      const defaultSection = getByTestId(container, 'payment-settings-default');
      expect(
        getByTestId(defaultSection, 'section-heading').textContent
      ).toEqual(
        'Please also add a payment method for any fees, charges or reimbursements required'
      );
      expect(getByText(defaultSection, testCards[222].number)).toBeTruthy();
    });
  });

  describe('as an external creditor (tradie)', () => {
    const testStoreState = {
      assembly: {
        banks: [testBanks[11].promisepayId, testBanks[22].promisepayId],
        data: {
          [testBanks[11].promisepayId]: testBanks[11],
          [testBanks[22].promisepayId]: testBanks[22],
        },
        disbursements: { default: testBanks[11].promisepayId },
        payments: {},
      },
    };
    const testProfile = { id: 2 };
    const testExternalCreditor = { id: 2 };
    const initialState = getStateAsExternalCreditor(
      testStoreState,
      testProfile,
      testExternalCreditor
    );

    it('should make the correct fetches', async () => {
      const [{ container }, store] = renderWithStore(
        <WelcomeStepPaymentSettings />,
        { initialState }
      );

      expect(
        queryByTestId(container, 'payment-settings-disbursement')
      ).toBeTruthy();
      expect(queryByTestId(container, 'payment-settings-default')).toBeFalsy();
      expect(queryByTestId(container, 'payment-dda-card')).toBeTruthy();

      await waitFor(() => {
        expect(store.actions.length).toEqual(1);
        expect(store.actions).toContainEqual(fetchAccounts());
      });
    });

    it('should show the correct accounts', async () => {
      const [{ container }] = renderWithStore(<WelcomeStepPaymentSettings />, {
        initialState,
      });

      const disbursementSection = getByTestId(
        container,
        'payment-settings-disbursement'
      );
      expect(
        getByTestId(disbursementSection, 'section-heading').textContent
      ).toEqual('Where would you like payments deposited?');
      expect(
        getByText(
          disbursementSection,
          `${testBanks[11].routingNumber}-${testBanks[11].accountNumber}`
        )
      ).toBeTruthy();
    });
  });

  describe('as a tenant', () => {
    const testStoreState = {
      assembly: {
        banks: [testBanks[11].promisepayId, testBanks[22].promisepayId],
        cards: [testCards[111].promisepayId],
        data: {
          [testBanks[11].promisepayId]: testBanks[11],
          [testBanks[22].promisepayId]: testBanks[22],
          [testCards[111].promisepayId]: testCards[111],
        },
        disbursements: { default: testBanks[11].promisepayId },
        isPayByBpay: true,
        payments: {},
      },
    };
    const testProfile = { id: 3 };
    const testTenant = { id: 3, bpayReference: '111222333' };
    const initialState = getStateAsPrimaryTenant(
      testStoreState,
      testProfile,
      testTenant
    );

    it('should make the correct fetches', async () => {
      const [{ container }, store] = renderWithStore(
        <WelcomeStepPaymentSettings />,
        { initialState }
      );

      expect(
        queryByTestId(container, 'payment-settings-disbursement')
      ).toBeFalsy();
      expect(queryByTestId(container, 'payment-settings-default')).toBeTruthy();
      expect(queryByTestId(container, 'payment-dda-card')).toBeFalsy();
      expect(queryByTestId(container, 'payment-dda-card')).toBeFalsy();

      await waitFor(() => {
        expect(store.actions.length).toEqual(1);
        expect(store.actions).toContainEqual(fetchAccounts());
      });
    });

    it('should show the correct accounts', async () => {
      const [{ container }] = renderWithStore(<WelcomeStepPaymentSettings />, {
        initialState,
      });

      const defaultSection = getByTestId(container, 'payment-settings-default');
      expect(
        getByTestId(defaultSection, 'section-heading').textContent
      ).toEqual('How would you like to pay rent and bills?');
      expect(getByText(defaultSection, testTenant.bpayReference)).toBeTruthy();
    });
  });
});
