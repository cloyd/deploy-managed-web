import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { mockHttpClient } from '../../../redux/__mocks__';
import { renderWithStore } from '../../../test/renderWithStore';
import { LoanTransfer } from '../Transfer';

const render = ({ loan, property }) => {
  const [renderContainer] = renderWithStore(
    <LoanTransfer loan={loan} property={property} />,
    { initialState: {} }
  );

  return renderContainer;
};

describe('LoanTransfer', () => {
  const loan = { id: 1, name: 'Loan' };
  const property = { id: 1 };

  describe('when walletBalanceCents is 0', () => {
    const props = {
      loan: { ...loan, walletBalanceCents: 0 },
      property,
    };

    it('should not display the transfer button', () => {
      const { queryByTestId } = render(props);
      expect(queryByTestId('btn-transfer')).toBeNull();
    });
  });

  describe('when walletBalanceCents is greater than 0', () => {
    const props = {
      loan: { ...loan, walletBalanceCents: 100_00 },
      property: { ...property, floatBalanceAmountCents: 100_00 },
    };

    it('should display the transfer button', () => {
      const { getByTestId, queryByTestId } = render(props);
      expect(getByTestId('btn-transfer')).toBeDefined();
      expect(queryByTestId('modal')).toBeNull();
    });

    it('should open the transfer modal', async () => {
      const { queryByTestId } = render(props);

      userEvent.click(queryByTestId('btn-transfer'));
      expect(queryByTestId('btn-transfer')).toBeDefined();

      await waitFor(() => expect(queryByTestId('modal')).toBeDefined());

      const { textContent } = queryByTestId('balance');
      expect(textContent).toContain('From Loan');
      expect(textContent).toContain('Available balance $100');
    });

    it('should transfer to property wallet', async () => {
      const { queryByTestId, getByDisplayValue } = render(props);

      userEvent.click(queryByTestId('btn-transfer'));
      await waitFor(() => expect(queryByTestId('modal')).toBeDefined());

      const node = queryByTestId('wallet_transfer');
      expect(node.textContent).toContain('To Property Wallet');
      expect(node.textContent).toContain('Balance after transfer: $200');

      userEvent.click(getByDisplayValue('wallet_transfer'));
      userEvent.click(queryByTestId('form-submit-btn'));

      mockHttpClient
        .onPost(`/properties/${property.id}/loans/${loan.id}/wallet_transfer`)
        .reply(201);

      await waitFor(() => expect(queryByTestId('modal')).toBeNull());
    });

    it('should transfer to property owners', async () => {
      const { queryByTestId, getByDisplayValue } = render(props);

      userEvent.click(queryByTestId('btn-transfer'));
      await waitFor(() => expect(queryByTestId('modal')).toBeDefined());

      const node = queryByTestId('discharge');
      expect(node.textContent).toContain('To Property Owner(s)');
      expect(node.textContent).toContain(
        'Bank transfers usually take 1-2 business days'
      );

      userEvent.click(getByDisplayValue('discharge'));
      userEvent.click(queryByTestId('form-submit-btn'));

      mockHttpClient
        .onPost(`/properties/${property.id}/loans/${loan.id}/discharge`)
        .reply(201);

      await waitFor(() => expect(queryByTestId('modal')).toBeNull());
    });
  });
});
