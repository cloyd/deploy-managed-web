import React from 'react';

import { renderWithStore } from '../../../test/renderWithStore';
import { LoanCard } from '../Card';

const render = ({ loan }) => {
  const [renderContainer] = renderWithStore(<LoanCard loan={loan} />, {
    initialState: {},
  });

  return renderContainer;
};

describe('LoanCard', () => {
  const loan = {
    id: 1,
    status: 'active',
    statusMessage: 'Message',
    number: '#1',
    amountCents: 100_00,
    amountOwingCents: 50_00,
    walletBalanceCents: 25_00,
  };

  it('should display the loan number', () => {
    const { getByTestId } = render({ loan });
    expect(getByTestId('number').textContent).toBe('#1');
  });

  it('should display amountCents in dollars', () => {
    const { getByTestId } = render({ loan });
    expect(getByTestId('amount').textContent).toBe('$100');
  });

  it('should display walletBalanceCents in dollars', () => {
    const { getByTestId } = render({ loan });
    expect(getByTestId('balance').textContent).toBe('$25');
  });

  it('should display amountOwningCents in dollars', () => {
    const { getByTestId } = render({ loan });
    expect(getByTestId('owing').textContent).toBe('$50');
  });

  it('should display statusMessage', () => {
    const { getByTestId } = render({ loan });
    expect(getByTestId('status').textContent).toBe('Message');
  });

  it('should display style when status is active', () => {
    const { getByTestId } = render({ loan: { ...loan, status: 'active' } });
    expect(getByTestId('status').className).toBe('text-danger');
  });

  it('should display style when status is completed', () => {
    const { getByTestId } = render({ loan: { ...loan, status: 'completed' } });
    expect(getByTestId('status').className).toBe('text-success');
  });

  it('should display style when status is pending', () => {
    const { getByTestId } = render({ loan: { ...loan, status: 'pending' } });
    expect(getByTestId('status').className).toBe('text-muted');
  });
});
