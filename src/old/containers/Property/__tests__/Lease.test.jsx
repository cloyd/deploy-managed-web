import { waitFor } from '@testing-library/dom';
import { queryByTestId } from '@testing-library/react';
import React from 'react';

import { fetchLease } from '../../../redux/lease';
import { renderWithStore } from '../../../test/renderWithStore';
import { PropertyLease } from '../Lease';

describe('PropertyLease', () => {
  const testLease = { id: 55, isActive: true, propertyId: 2 };
  const testLeaseUpcoming = { id: 66, isActive: false, propertyId: 2 };
  const testProperty = { id: 2, leaseId: testLease.id };
  const testStoreState = {
    lease: {
      leases: {
        [testLease.id]: testLease,
        [testLeaseUpcoming.id]: testLeaseUpcoming,
      },
    },
    property: {
      data: { [testProperty.id]: testProperty },
    },
  };

  it('should call fetchLease when property.leaseId changes', async () => {
    const [{ container, rerender }, store] = renderWithStore(
      <PropertyLease property={testProperty} />,
      { initialState: testStoreState }
    );

    expect(queryByTestId(container, 'property-lease-active-cards')).toBeFalsy();

    await waitFor(() => {
      expect(store.actions.length).toEqual(1);
      expect(store.actions[0]).toEqual(fetchLease({ leaseId: testLease.id }));
    });

    rerender(
      <PropertyLease
        property={{ ...testProperty, leaseId: testLeaseUpcoming.id }}
      />
    );

    await waitFor(() => {
      expect(store.actions.length).toEqual(2);
      expect(store.actions[1]).toEqual(
        fetchLease({ leaseId: testLeaseUpcoming.id })
      );
    });
  });

  it('should show active lease components when lease exists', () => {
    const [{ container, rerender }] = renderWithStore(
      <PropertyLease property={testProperty} />,
      { initialState: testStoreState }
    );

    expect(queryByTestId(container, 'property-lease-active-cards')).toBeFalsy();

    rerender(<PropertyLease lease={testLease} property={testProperty} />);

    expect(
      queryByTestId(container, 'property-lease-active-cards')
    ).toBeTruthy();
  });

  it('should show upcoming lease components when upcoming lease exists', () => {
    const [{ container, rerender }] = renderWithStore(
      <PropertyLease property={testProperty} />,
      { initialState: testStoreState }
    );

    expect(
      queryByTestId(container, 'property-lease-upcoming-cards')
    ).toBeFalsy();

    rerender(
      <PropertyLease
        leaseUpcoming={testLeaseUpcoming}
        property={testProperty}
      />
    );

    expect(
      queryByTestId(container, 'property-lease-upcoming-cards')
    ).toBeTruthy();
  });

  it('should hide upcoming lease components when there is no data', async () => {
    const [{ container }] = renderWithStore(
      <PropertyLease property={testProperty} />,
      { initialState: testStoreState }
    );

    expect(
      queryByTestId(container, 'property-lease-upcoming-cards')
    ).toBeFalsy();
  });

  it('should hide active lease components when there is no data', async () => {
    const [{ container }] = renderWithStore(
      <PropertyLease property={testProperty} />,
      { initialState: testStoreState }
    );

    expect(queryByTestId(container, 'property-lease-active-cards')).toBeFalsy();
  });
});
