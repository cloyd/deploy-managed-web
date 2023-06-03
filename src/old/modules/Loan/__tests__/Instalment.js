import addDays from 'date-fns/addDays';
import React from 'react';

import { renderWithStore } from '../../../test/renderWithStore';
import { formatDate } from '../../../utils';
import { LoanInstalment } from '../Instalment';

const render = ({ instalment, property, title }) => {
  const [renderContainer] = renderWithStore(
    <table>
      <tbody>
        <LoanInstalment
          instalment={instalment}
          property={property}
          title={title}
        />
      </tbody>
    </table>,
    {
      initialState: {},
    }
  );

  return renderContainer;
};

describe('LoanInstalment', () => {
  describe('when Draft', () => {
    const props = {
      title: 'Instalment',
      instalment: {
        amountCents: 100_00,
        dueDate: new Date(),
        status: 'draft',
        intentionStatus: 'draft',
      },
      property: {
        id: 1,
        leaseId: 2,
      },
    };

    it('should not be muted', () => {
      const { getByTestId } = render(props);
      expect(getByTestId('row').className).not.toContain('text-muted');
    });

    it('should display the title', () => {
      const { getByTestId } = render(props);
      expect(getByTestId('title').textContent).toBe('Instalment');
    });

    it('should display the amount in dollars', () => {
      const { getByTestId } = render(props);
      expect(getByTestId('amount').textContent).toBe('$100');
    });

    it('should display due today', () => {
      const { getByTestId } = render(props);
      expect(getByTestId('date').textContent).toBe(
        `Due today-${formatDate(props.instalment.dueDate)}`
      );
    });

    it('should display due tomorrow', () => {
      const dueDate = addDays(props.instalment.dueDate, 1);
      const { getByTestId } = render({
        ...props,
        instalment: { ...props.instalment, dueDate },
      });
      expect(getByTestId('date').textContent).toBe(
        `Due tomorrow-${formatDate(dueDate)}`
      );
    });

    it('should display due in x days', () => {
      const dueDate = addDays(props.instalment.dueDate, 7);
      const { getByTestId } = render({
        ...props,
        instalment: { ...props.instalment, dueDate },
      });
      expect(getByTestId('date').textContent).toBe(
        `Due in 7 days-${formatDate(dueDate)}`
      );
    });

    it('should display due date when greater than 7', () => {
      const dueDate = addDays(props.instalment.dueDate, 8);
      const { getByTestId } = render({
        ...props,
        instalment: { ...props.instalment, dueDate },
      });
      expect(getByTestId('date').textContent).toBe(
        `Due ${formatDate(dueDate)}`
      );
    });

    it('should display the action', () => {
      const { getByTestId } = render(props);
      expect(getByTestId('action').textContent).toBe('Pay');
    });
  });

  describe('when Paid', () => {
    const props = {
      title: 'Instalment',
      instalment: {
        amountCents: 100_00,
        dueDate: new Date(),
        status: 'completed',
        intentionStatus: 'completed',
      },
      property: {
        id: 1,
        leaseId: 2,
      },
    };

    it('should be muted', () => {
      const { getByTestId } = render(props);
      expect(getByTestId('row').className).toContain('text-muted');
    });

    it('should display the title', () => {
      const { getByTestId } = render(props);
      expect(getByTestId('title').textContent).toBe('Instalment');
    });

    it('should display the amount in dollars', () => {
      const { getByTestId } = render(props);
      expect(getByTestId('amount').textContent).toBe('$100');
    });

    it('should display due date', () => {
      const dueDate = addDays(props.instalment.dueDate, -1);
      const { getByTestId } = render({
        ...props,
        instalment: { ...props.instalment, dueDate },
      });
      expect(getByTestId('date').textContent).toBe(
        `Due ${formatDate(dueDate)}`
      );
    });

    it('should display the action', () => {
      const { getByTestId } = render(props);
      expect(getByTestId('action').textContent).toBe('Paid');
    });
  });
});
