import React from 'react';

import { renderWithStore } from '../../../test/renderWithStore';
import { LoanAlert } from '../Alert';

const render = ({ isOpen, balance, property }) => {
  const [renderContainer] = renderWithStore(
    <LoanAlert isOpen={isOpen} property={property} balance={balance} />,
    { initialState: {} }
  );

  return renderContainer;
};

describe('LoanAlert', () => {
  describe('when isOpen is false', () => {
    const props = { isOpen: false, property: { id: 1 } };

    it('should not display', () => {
      const { queryByRole } = render(props);
      expect(queryByRole('alert')).toBeNull();
    });
  });

  describe('when isOpen is true', () => {
    const props = { isOpen: true, property: { id: 1 } };

    it('should display as alert', () => {
      const { queryByRole } = render(props);
      expect(queryByRole('alert')).not.toBeNull();
    });

    it('should display link to providers', () => {
      const { getByTestId } = render(props);
      const { href } = getByTestId('link');
      expect(href).toContain(`/property/${props.property.id}/loans/providers`);
    });
  });

  describe('when balance is less than or equal to 0', () => {
    const props = { isOpen: true, balance: 0, property: { id: 1 } };

    it('should render title', () => {
      const { queryByText } = render(props);
      const title =
        'You don’t have enough funds in your wallet to cover upcoming bills';
      expect(queryByText(title)).not.toBeNull();
    });

    it('should render content', () => {
      const { queryByText } = render(props);
      const content = 'Improve your property cash flow by getting a loan.';
      expect(queryByText(content)).not.toBeNull();
    });
  });

  describe('when balance is greater than 0', () => {
    const props = { isOpen: true, balance: 1, property: { id: 1 } };

    it('should render title', () => {
      const { queryByText } = render(props);
      const title = 'Improve your property cash flow';
      expect(queryByText(title)).not.toBeNull();
    });

    it('should render content', () => {
      const { queryByText } = render(props);
      const content = 'You could benefit from a short-term loan.';
      expect(queryByText(content)).not.toBeNull();
    });
  });
});
