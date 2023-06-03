import { getAllByTestId, screen, waitFor } from '@testing-library/dom';
import { getByTestId, getByText, queryByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom';

import {
  createBank,
  createCard,
  destroyAccount,
  fetchAccounts,
  setDisbursement,
  setPayment,
} from '../../../redux/assembly';
import { fetchProperties } from '../../../redux/property';
import {
  getStateAsExternalCreditor,
  getStateAsPrimaryTenant,
  getStateAsPrincipal,
} from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { PaymentsSettings } from '../Settings';

window.assembly = {
  hostedFields: jest.fn(),
};
window.confirm = jest.fn(() => true);

let onChange = () => {};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({
    pathname: '/',
    search: '',
    hash: '',
  })),
}));

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

jest.mock('axios', () => ({
  create: () => ({
    get: () => {
      return Promise.resolve({
        data: 'mock data',
      });
    },
    interceptors: {
      request: {
        use: () => {},
      },
      response: {
        use: () => {},
      },
    },
  }),
}));

describe('PaymentsSettings', () => {
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

  beforeEach(() => {
    useLocation.mockImplementation(() => ({
      pathname: '/',
      search: '',
      hash: '',
    }));
  });

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

    it('should make fetches and show correct accounts', async () => {
      const [{ container }, store] = renderWithStore(<PaymentsSettings />, {
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

      await waitFor(() => {
        expect(store.actions.length).toEqual(2);
        expect(store.actions).toContainEqual(fetchAccounts());
        expect(store.actions).toContainEqual(fetchProperties());
      });
    });

    it('should set a different disbursement account', async () => {
      const [{ container }, store] = renderWithStore(<PaymentsSettings />, {
        initialState,
      });

      const disbursementSection = getByTestId(
        container,
        'payment-settings-disbursement'
      );

      useLocation.mockImplementation(() => ({
        pathname: '/',
        search: '',
        hash: '#disbursement',
      }));

      userEvent.click(
        getByTestId(disbursementSection, 'payment-account-change-btn')
      );

      const useAccountBtn = getAllByTestId(
        disbursementSection,
        'bank-use-account-btn'
      );
      expect(useAccountBtn.length).toEqual(1);
      userEvent.click(useAccountBtn[0]);

      await waitFor(() => {
        expect(store.actions.length).toEqual(3);
        expect(store.actions).toContainEqual(
          setDisbursement({
            fingerprint: 'manager:1',
            promisepayId: testBanks[22].promisepayId,
          })
        );
      });
    });

    it('should set a different default payment account', async () => {
      const [{ container }, store] = renderWithStore(<PaymentsSettings />, {
        initialState,
      });

      const paymentSection = getByTestId(container, 'payment-settings-default');

      useLocation.mockImplementation(() => ({
        pathname: '/',
        search: '',
        hash: '#default',
      }));

      userEvent.click(
        getByTestId(paymentSection, 'payment-account-change-btn')
      );

      const useCardBtn = getAllByTestId(paymentSection, 'card-use-account-btn');
      expect(
        getAllByTestId(paymentSection, 'bank-use-account-btn').length
      ).toEqual(2);
      expect(useCardBtn.length).toEqual(1);

      userEvent.click(useCardBtn[0]);

      await waitFor(() => {
        expect(store.actions.length).toEqual(3);
        expect(store.actions).toContainEqual(
          setPayment({
            fingerprint: 'manager:1',
            promisepayId: testCards[111].promisepayId,
          })
        );
      });
    });

    it('should destroy an account', async () => {
      const [{ container }, store] = renderWithStore(<PaymentsSettings />, {
        initialState,
      });

      const paymentSection = getByTestId(container, 'payment-settings-default');

      useLocation.mockImplementation(() => ({
        pathname: '/',
        search: '',
        hash: '#default',
      }));

      userEvent.click(
        getByTestId(paymentSection, 'payment-account-change-btn')
      );

      const destroyCardBtn = getAllByTestId(
        paymentSection,
        'card-destroy-account-btn'
      );
      expect(
        getAllByTestId(paymentSection, 'bank-destroy-account-btn').length
      ).toEqual(2);
      expect(destroyCardBtn.length).toEqual(1);

      userEvent.click(destroyCardBtn[0]);

      await waitFor(() => {});

      const confirmModal = screen.getByTestId('modal-confirm-destroy');
      userEvent.click(getByTestId(confirmModal, 'form-submit-btn'));

      await waitFor(() => {
        expect(store.actions.length).toEqual(3);
        expect(store.actions).toContainEqual(
          destroyAccount({
            fingerprint: 'manager:1',
            promisepayId: testCards[111].promisepayId,
          })
        );
      });
    });

    it('should add a new disbursement account', async () => {
      const testFormParams = {
        bankName: 'New Bank',
        accountName: 'New Account',
        accountNumber: '12341234',
        agreement: true,
        routingNumber: '123456',
        accountType: 'savings',
        holderType: 'personal',
      };

      const [{ container }, store] = renderWithStore(<PaymentsSettings />, {
        initialState,
      });

      const disbursementSection = getByTestId(
        container,
        'payment-settings-disbursement'
      );

      useLocation.mockImplementation(() => ({
        pathname: '/',
        search: '',
        hash: '#disbursement',
      }));

      userEvent.click(
        getByTestId(disbursementSection, 'payment-account-change-btn')
      );

      expect(
        getAllByTestId(disbursementSection, 'payment-bank-value').length
      ).toEqual(2);
      expect(
        queryByTestId(disbursementSection, 'payment-card-value')
      ).toBeFalsy();

      await userEvent.type(
        getByTestId(disbursementSection, 'bank-name-field'),
        testFormParams.bankName
      );

      await userEvent.type(
        getByTestId(disbursementSection, 'account-name-field-input'),
        testFormParams.accountName
      );

      await userEvent.type(
        getByTestId(disbursementSection, 'routing-number-field-input'),
        testFormParams.routingNumber
      );

      await userEvent.type(
        getByTestId(disbursementSection, 'account-number-field-input'),
        testFormParams.accountNumber
      );

      userEvent.click(getByTestId(disbursementSection, 'input-dda-agreement'));
      userEvent.click(getByTestId(disbursementSection, 'form-submit-button'));

      await waitFor(() => {});

      await waitFor(() => {
        expect(store.actions.length).toEqual(3);
        expect(store.actions).toContainEqual(
          createBank({
            fingerprint: 'manager:1',
            isBiller: false,
            isDefault: false,
            isDisbursement: true,
            promisepayId: '1',
          })
        );
      });
    });

    it('should add a new default payment account', async () => {
      const testFormParams = {
        fullName: 'Tim Tam',
        expiryDate: '12/2035',
        number: '4111111111111111',
        cvv: '333',
      };

      const [{ container }, store] = renderWithStore(<PaymentsSettings />, {
        initialState,
      });
      const paymentSection = getByTestId(container, 'payment-settings-default');
      useLocation.mockImplementation(() => ({
        pathname: '/',
        search: '',
        hash: '#default',
      }));

      userEvent.click(
        getByTestId(paymentSection, 'payment-account-change-btn')
      );
      expect(
        getAllByTestId(paymentSection, 'payment-bank-value').length
      ).toEqual(2);
      expect(
        getAllByTestId(paymentSection, 'payment-card-value').length
      ).toEqual(2);
      userEvent.click(getByTestId(paymentSection, 'input-typeCard'));
      await userEvent.type(
        getByTestId(paymentSection, 'card-name-field-input'),
        testFormParams.fullName
      );
      await userEvent.type(
        getByTestId(paymentSection, 'card-expiry-field-input'),
        testFormParams.expiryDate
      );
      await userEvent.type(
        getByTestId(paymentSection, 'card-number-field-input'),
        testFormParams.number
      );
      await userEvent.type(
        getByTestId(paymentSection, 'card-cvv-field-input'),
        testFormParams.cvv
      );
      userEvent.click(getByTestId(paymentSection, 'form-submit-button'));

      await waitFor(() => {
        expect(store.actions.length).toEqual(3);
        expect(store.actions).toContainEqual(
          createCard({
            fingerprint: 'manager:1',
            isBiller: false,
            isDefault: true,
            isDisbursement: false,
            promisepayId: '1',
          })
        );
      });
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

    it('should make fetches and show correct accounts', async () => {
      const [{ container }, store] = renderWithStore(<PaymentsSettings />, {
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

      expect(queryByTestId(container, 'payment-settings-default')).toBeFalsy();

      await waitFor(() => {
        expect(store.actions.length).toEqual(1);
        expect(store.actions).toContainEqual(fetchAccounts());
      });
    });

    it('should add a new disbursement account', async () => {
      const testFormParams = {
        bankName: 'New Bank',
        accountName: 'New Account',
        accountNumber: '12341234',
        agreement: true,
        routingNumber: '123456',
        accountType: 'savings',
        holderType: 'personal',
      };

      const [{ container }, store] = renderWithStore(<PaymentsSettings />, {
        initialState,
      });

      const disbursementSection = getByTestId(
        container,
        'payment-settings-disbursement'
      );

      useLocation.mockImplementation(() => ({
        pathname: '/',
        search: '',
        hash: '#disbursement',
      }));

      userEvent.click(
        getByTestId(disbursementSection, 'payment-account-change-btn')
      );

      expect(
        getAllByTestId(disbursementSection, 'payment-bank-value').length
      ).toEqual(2);
      expect(
        queryByTestId(disbursementSection, 'payment-card-value')
      ).toBeFalsy();

      await userEvent.type(
        getByTestId(disbursementSection, 'bank-name-field'),
        testFormParams.bankName
      );

      await userEvent.type(
        getByTestId(disbursementSection, 'account-name-field-input'),
        testFormParams.accountName
      );

      await userEvent.type(
        getByTestId(disbursementSection, 'routing-number-field-input'),
        testFormParams.routingNumber
      );

      await userEvent.type(
        getByTestId(disbursementSection, 'account-number-field-input'),
        testFormParams.accountNumber
      );

      userEvent.click(getByTestId(disbursementSection, 'input-dda-agreement'));
      userEvent.click(getByTestId(disbursementSection, 'form-submit-button'));

      await waitFor(() => {
        expect(store.actions.length).toEqual(2);
        expect(store.actions).toContainEqual(
          createBank({
            isDefault: false,
            isDisbursement: true,
            promisepayId: '1',
            fingerprint: 'external_creditor:2',
            isBiller: false,
          })
        );
      });
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
        hasDefaultPayment: true,
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

    it('should make fetches and show correct accounts', async () => {
      const [{ container }, store] = renderWithStore(<PaymentsSettings />, {
        initialState,
      });

      const disbursementSection = getByTestId(
        container,
        'payment-settings-disbursement'
      );
      expect(
        getByTestId(disbursementSection, 'section-heading').textContent
      ).toEqual('Where would you like to send any refunds or reimbursements?');
      expect(
        getByText(
          disbursementSection,
          `${testBanks[11].routingNumber}-${testBanks[11].accountNumber}`
        )
      ).toBeTruthy();

      const defaultSection = getByTestId(container, 'payment-settings-default');
      expect(
        getByTestId(defaultSection, 'section-heading').textContent
      ).toEqual('How would you like to pay rent and bills?');
      expect(getByText(defaultSection, testTenant.bpayReference)).toBeTruthy();

      await waitFor(() => {
        expect(store.actions.length).toEqual(1);
        expect(store.actions).toContainEqual(fetchAccounts());
      });
    });

    it('should add a new disbursement account', async () => {
      const testFormParams = {
        bankName: 'New Bank',
        accountName: 'New Account',
        accountNumber: '12341234',
        agreement: true,
        routingNumber: '123456',
        accountType: 'savings',
        holderType: 'personal',
      };

      const [{ container }, store] = renderWithStore(<PaymentsSettings />, {
        initialState,
      });

      const disbursementSection = getByTestId(
        container,
        'payment-settings-disbursement'
      );

      useLocation.mockImplementation(() => ({
        pathname: '/',
        search: '',
        hash: '#disbursement',
      }));

      userEvent.click(
        getByTestId(disbursementSection, 'payment-account-change-btn')
      );

      expect(
        getAllByTestId(disbursementSection, 'payment-bank-value').length
      ).toEqual(2);
      expect(
        queryByTestId(disbursementSection, 'payment-card-value')
      ).toBeFalsy();

      await userEvent.type(
        getByTestId(disbursementSection, 'bank-name-field'),
        testFormParams.bankName
      );

      await userEvent.type(
        getByTestId(disbursementSection, 'account-name-field-input'),
        testFormParams.accountName
      );

      await userEvent.type(
        getByTestId(disbursementSection, 'routing-number-field-input'),
        testFormParams.routingNumber
      );

      await userEvent.type(
        getByTestId(disbursementSection, 'account-number-field-input'),
        testFormParams.accountNumber
      );

      userEvent.click(getByTestId(disbursementSection, 'input-dda-agreement'));
      userEvent.click(getByTestId(disbursementSection, 'form-submit-button'));

      await waitFor(() => {
        expect(store.actions.length).toEqual(2);
        expect(store.actions).toContainEqual(
          createBank({
            fingerprint: 'tenant:3',
            isBiller: false,
            isDefault: false,
            isDisbursement: true,
            promisepayId: '1',
          })
        );
      });
    });

    it('should add a new default payment account', async () => {
      const testFormParams = {
        fullName: 'Tim Tam',
        expiryDate: '12/2035',
        number: '4111111111111111',
        cvv: '333',
      };

      const [{ container }, store] = renderWithStore(<PaymentsSettings />, {
        initialState,
      });

      const paymentSection = getByTestId(container, 'payment-settings-default');

      useLocation.mockImplementation(() => ({
        pathname: '/',
        search: '',
        hash: '#default',
      }));

      userEvent.click(
        getByTestId(paymentSection, 'payment-account-change-btn')
      );

      expect(
        getAllByTestId(paymentSection, 'payment-bank-value').length
      ).toEqual(2);
      expect(
        getAllByTestId(paymentSection, 'payment-card-value').length
      ).toEqual(1);

      userEvent.click(getByTestId(paymentSection, 'input-typeCard'));

      await userEvent.type(
        getByTestId(paymentSection, 'card-name-field-input'),
        testFormParams.fullName
      );

      await userEvent.type(
        getByTestId(paymentSection, 'card-expiry-field-input'),
        testFormParams.expiryDate
      );

      await userEvent.type(
        getByTestId(paymentSection, 'card-number-field-input'),
        testFormParams.number
      );

      await userEvent.type(
        getByTestId(paymentSection, 'card-cvv-field-input'),
        testFormParams.cvv
      );

      userEvent.click(getByTestId(paymentSection, 'form-submit-button'));

      await waitFor(() => {
        expect(store.actions.length).toEqual(2);
        expect(store.actions).toContainEqual(
          createCard({
            fingerprint: 'tenant:3',
            isBiller: false,
            isDefault: true,
            isDisbursement: false,
            promisepayId: '1',
          })
        );
      });
    });

    it('should show automate my payments section', async () => {
      const [{ container }] = renderWithStore(<PaymentsSettings />, {
        initialState,
      });

      expect(getByTestId(container, 'payment-settings-auto-rent')).toBeTruthy();
      expect(
        getByTestId(container, 'payment-settings-auto-bills')
      ).toBeTruthy();
    });
  });
});
