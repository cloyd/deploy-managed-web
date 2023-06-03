import { waitFor } from '@testing-library/dom';
import { getByTestId, queryByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { renderWithStore } from '../../../test/renderWithStore';
import { PropertyFinancials } from '../Financials';

describe('PropertyFinancials', () => {
  const testLocation = {
    search: '?period=last-quarter&starts_at=2020-04-01&ends_at=2020-05-01',
  };
  const testProperty = { id: 2, address: { street: 'street' } };
  const testStoreState = {
    property: {
      data: { [testProperty.id]: testProperty },
      financials: {
        [testProperty.id]: {
          expenses: [
            {
              id: 11,
              status: 'completed',
              title: 'Agency Fees',
              gst: 23,
              total: 255,
            },
            {
              id: 22,
              status: 'completed',
              title: 'Management Fees',
              gst: 100,
              total: 2000,
            },
          ],
          income: [
            {
              id: 333,
              status: 'completed',
              title: 'Rent (08 Jul 2020 - 14 Jul 2020)',
              total: 25500,
            },
          ],
        },
      },
    },
  };

  it('should hide tables when there is no data', async () => {
    const [{ container }] = renderWithStore(
      <PropertyFinancials location={{}} property={testProperty} />,
      { initialState: {} }
    );

    expect(queryByTestId(container, 'property-income-table')).toBeFalsy();
    expect(queryByTestId(container, 'property-expenses-table')).toBeFalsy();
  });

  it('should show tables when filter button is clicked', async () => {
    const [{ container }] = renderWithStore(
      <PropertyFinancials location={testLocation} property={testProperty} />,
      { initialState: testStoreState }
    );

    expect(queryByTestId(container, 'property-income-table')).toBeFalsy();
    expect(queryByTestId(container, 'property-expenses-table')).toBeFalsy();

    const submitBtn = getByTestId(container, 'filter-report-btn');
    userEvent.click(submitBtn);

    await waitFor(() => {
      expect(queryByTestId(container, 'property-income-table')).toBeTruthy();
      expect(queryByTestId(container, 'property-expenses-table')).toBeTruthy();
    });
  });
});
