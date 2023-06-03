import { waitFor } from '@testing-library/dom';
import { getByTestId, queryByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ReactDOM from 'react-dom';

import { AcceptInvite } from '@app/containers/WelcomeStep';
import { createBank, createCard, enableAccount } from '@app/redux/assembly';
import { confirmPassword } from '@app/redux/profile';
import {
  getStateAsExternalCreditor,
  getStateAsManager,
  getStateAsPrimaryOwner,
  getStateAsPrimaryTenant,
  getStateAsPrincipal,
  getStateAsSecondaryOwner,
  getStateAsSecondaryTenant,
} from '@app/test/getStateAsUser';
import { renderWithProviders } from '@app/test/renderWithProviders';

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

describe('AcceptInvite', () => {
  const testStoreState = {
    assembly: { isAgreementComplete: false },
  };
  const testProfile = { id: 12, isOnboarded: false };

  describe('if reset password token is present', () => {
    const route = '/?reset_password_token=abc123';

    it('should go to payment settings if user is authorized (has set password)', () => {
      const state = getStateAsPrimaryTenant(testStoreState, testProfile);
      const { container } = renderWithProviders(<AcceptInvite />, {
        route,
        state,
      });

      expect(queryByTestId(container, 'welcome-steps-one')).toBeFalsy();
      expect(queryByTestId(container, 'welcome-steps-two')).toBeTruthy();
    });

    it('should redirect if user is onboarded', () => {
      const state = getStateAsPrimaryTenant(testStoreState, {
        id: 12,
        isOnboarded: true,
      });

      const { container, history } = renderWithProviders(<AcceptInvite />, {
        route,
        state,
      });

      expect(queryByTestId(container, 'welcome-steps-one')).toBeFalsy();
      expect(queryByTestId(container, 'welcome-steps-two')).toBeFalsy();
      expect(history.location.pathname).toEqual('/');
    });

    it('should show confirm password page', () => {
      const state = { ...testStoreState };
      const { container } = renderWithProviders(<AcceptInvite />, {
        route,
        state,
      });

      expect(queryByTestId(container, 'welcome-steps-one')).toBeTruthy();
      expect(queryByTestId(container, 'welcome-steps-two')).toBeFalsy();
    });

    it('should confirm password', async () => {
      const testPassword = 'passwordpassword';
      const state = { ...testStoreState };
      const { container, store } = renderWithProviders(<AcceptInvite />, {
        route,
        state,
      });

      const form = getByTestId(container, 'form-confirm-password');

      userEvent.type(
        getByTestId(container, 'form-field-password'),
        testPassword
      );

      userEvent.type(
        getByTestId(container, 'form-field-passwordConfirmation'),
        testPassword
      );

      userEvent.click(getByTestId(form, 'form-field-terms'));
      userEvent.click(getByTestId(form, 'form-submit-btn'));

      await waitFor(() => {
        expect(store.actions.length).toEqual(1);
        expect(store.actions).toContainEqual(
          confirmPassword({
            authyToken: '',
            password: testPassword,
            passwordConfirmation: testPassword,
            resetPasswordToken: 'abc123',
          })
        );
      });
    });
  });

  describe('if authorized as an external creditor (tradie)', () => {
    it('should immediately redirect to confirm page', () => {
      const { container, history } = renderWithProviders(<AcceptInvite />, {
        state: getStateAsExternalCreditor(testStoreState, testProfile),
      });

      expect(queryByTestId(container, 'welcome-steps-one')).toBeFalsy();
      expect(queryByTestId(container, 'welcome-steps-two')).toBeFalsy();
      expect(queryByTestId(container, 'bpay-value')).toBeFalsy();
      expect(history.location.pathname).toEqual('/confirm-invite');
    });
  });

  describe('if authorized as a manager', () => {
    it('should immediately redirect to confirm page', () => {
      const { container, history } = renderWithProviders(<AcceptInvite />, {
        state: getStateAsManager(testStoreState, testProfile),
      });

      expect(queryByTestId(container, 'welcome-steps-one')).toBeFalsy();
      expect(queryByTestId(container, 'welcome-steps-two')).toBeFalsy();
      expect(queryByTestId(container, 'bpay-value')).toBeFalsy();
      expect(history.location.pathname).toEqual('/confirm-invite');
    });
  });

  /* eslint-disable jest/no-disabled-tests */
  describe('if authorized as a principal manager', () => {
    it.skip('should complete payment settings and go to confirm page', async () => {
      const bankFormParams = {
        bankName: 'New Bank',
        accountName: 'New Account',
        accountNumber: '12341234',
        agreement: true,
        routingNumber: '123456',
        accountType: 'savings',
        holderType: 'personal',
      };
      const cardFormParams = {
        fullName: 'Tim Tam',
        expiryDate: '12/2035',
        number: '4111111111111111',
        cvv: '333',
      };
      const fingerprint = 'manager:12';

      const { container, store } = renderWithProviders(<AcceptInvite />, {
        state: getStateAsPrincipal(testStoreState, testProfile),
      });

      expect(queryByTestId(container, 'welcome-steps-one')).toBeFalsy();

      const welcomeStep = getByTestId(container, 'welcome-steps-two');
      const disbursementSection = getByTestId(
        container,
        'payment-settings-disbursement'
      );

      userEvent.type(
        getByTestId(disbursementSection, 'bank-name-field'),
        bankFormParams.bankName
      );

      userEvent.type(
        getByTestId(disbursementSection, 'account-name-field-input'),
        bankFormParams.accountName
      );

      userEvent.type(
        getByTestId(disbursementSection, 'routing-number-field-input'),
        bankFormParams.routingNumber
      );

      userEvent.type(
        getByTestId(disbursementSection, 'account-number-field-input'),
        bankFormParams.accountNumber
      );

      userEvent.click(getByTestId(container, 'input-dda-agreement'));
      userEvent.click(getByTestId(disbursementSection, 'form-submit-button'));

      await waitFor(() => {
        expect(store.actions.length).toEqual(3);
        expect(store.actions).toContainEqual(
          createBank({
            fingerprint,
            isBiller: false,
            isDefault: false,
            isDisbursement: true,
            promisepayId: '1',
          })
        );
      });

      const paymentSection = getByTestId(container, 'payment-settings-default');

      userEvent.click(getByTestId(paymentSection, 'input-typeCard'));

      userEvent.type(
        getByTestId(paymentSection, 'card-name-field-input'),
        cardFormParams.fullName
      );

      userEvent.type(
        getByTestId(paymentSection, 'card-expiry-field-input'),
        cardFormParams.expiryDate
      );

      userEvent.type(
        getByTestId(paymentSection, 'card-number-field-input'),
        cardFormParams.number
      );

      userEvent.type(
        getByTestId(paymentSection, 'card-cvv-field-input'),
        cardFormParams.cvv
      );

      userEvent.click(getByTestId(paymentSection, 'form-submit-button'));

      await waitFor(() => {
        expect(store.actions.length).toEqual(4);
        expect(store.actions).toContainEqual(
          createCard({
            fingerprint,
            isBiller: false,
            isDefault: true,
            isDisbursement: false,
            promisepayId: '1',
          })
        );
      });

      userEvent.click(getByTestId(welcomeStep, 'input-dda-agreement'));
      userEvent.click(getByTestId(welcomeStep, 'button-step-two-next'));

      await waitFor(() => {
        expect(store.actions.length).toEqual(5);
        expect(store.actions).toContainEqual(
          enableAccount({ promisepayId: undefined, fingerprint })
        );
      });
    });
  });
  /* eslint-disable jest/no-disabled-tests */

  describe('if authorized as a primary owner', () => {
    it('should immediately redirect to confirm page', () => {
      const { container, history } = renderWithProviders(<AcceptInvite />, {
        state: getStateAsPrimaryOwner(testStoreState, testProfile),
      });

      expect(queryByTestId(container, 'welcome-steps-one')).toBeFalsy();
      expect(queryByTestId(container, 'welcome-steps-two')).toBeFalsy();
      expect(queryByTestId(container, 'bpay-value')).toBeFalsy();
      expect(history.location.pathname).toEqual('/confirm-invite');
    });
  });

  describe('if authorized as a primary tenant', () => {
    it('should click next and go to confirm page', () => {
      const { container, history } = renderWithProviders(<AcceptInvite />, {
        state: getStateAsPrimaryTenant(testStoreState, testProfile),
      });

      expect(queryByTestId(container, 'welcome-steps-one')).toBeFalsy();

      const welcomeStep = getByTestId(container, 'welcome-steps-two');
      expect(queryByTestId(welcomeStep, 'bpay-value')).toBeTruthy();

      userEvent.click(getByTestId(welcomeStep, 'button-step-two-next'));
      expect(history.location.pathname).toEqual('/confirm-invite');
    });
  });

  describe('if authorized as a secondary owner', () => {
    it('should immediately redirect to confirm page', () => {
      const { container, history } = renderWithProviders(<AcceptInvite />, {
        state: getStateAsSecondaryOwner(testStoreState, testProfile),
      });

      expect(queryByTestId(container, 'welcome-steps-one')).toBeFalsy();
      expect(queryByTestId(container, 'welcome-steps-two')).toBeFalsy();
      expect(queryByTestId(container, 'bpay-value')).toBeFalsy();
      expect(history.location.pathname).toEqual('/confirm-invite');
    });
  });

  describe('if authorized as a secondary tenant', () => {
    it('should immediately redirect to confirm page', () => {
      const { container, history } = renderWithProviders(<AcceptInvite />, {
        state: getStateAsSecondaryTenant(testStoreState, testProfile),
      });

      expect(queryByTestId(container, 'welcome-steps-one')).toBeFalsy();
      expect(queryByTestId(container, 'welcome-steps-two')).toBeFalsy();
      expect(queryByTestId(container, 'bpay-value')).toBeFalsy();
      expect(history.location.pathname).toEqual('/confirm-invite');
    });
  });
});
