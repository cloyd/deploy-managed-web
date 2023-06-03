import {
  getByTestId,
  queryAllByTestId,
  queryByTestId,
} from '@testing-library/react';
import React from 'react';

import { MarketplaceJobOverview } from '@app/containers/Marketplace';
import { fetchJob, fetchQuotesByJobId } from '@app/redux/marketplace';
import {
  getStateAsExternalCreditor,
  getStateAsPrimaryOwner,
} from '@app/test/getStateAsUser';
import { renderWithProviders } from '@app/test/renderWithProviders';

describe('MarketplaceJobOverview', () => {
  const testUserId = 100;

  const testJobs = {
    1: {
      id: 1,
      hasWorkOrder: false,
      tradieQuoteIds: [33, 44],
    },
    2: {
      id: 2,
      hasWorkOrder: true,
      tradieQuoteIds: [11, 22],
    },
    3: {
      id: 3,
      hasWorkOrder: false,
      tradieQuoteIds: [55],
    },
  };

  const testQuotes = {
    11: {
      id: 11,
      isWorkOrder: true,
      bidCents: 11100,
      tradie: { id: testUserId },
      tradieJobId: 2,
      status: 'awaiting_acceptance',
    },
    22: {
      id: 22,
      isWorkOrder: true,
      bidCents: 22200,
      tradie: { id: 666 },
      tradieJobId: 2,
    },
    33: {
      id: 33,
      isWorkOrder: false,
      bidCents: 33300,
      tradie: { id: testUserId },
      tradieJobId: 1,
      status: 'awaiting_acceptance',
    },
    44: {
      id: 44,
      isWorkOrder: false,
      bidCents: 44400,
      tradie: { id: 777 },
      tradieJobId: 1,
    },
    55: {
      id: 55,
      isWorkOrder: false,
      bidCents: 55500,
      tradie: { id: 777 },
      tradieJobId: 3,
    },
  };

  const testStoreState = {
    marketplace: {
      job: { data: testJobs },
      quote: { data: testQuotes },
    },
  };

  const path = '/marketplace/:jobId';

  const generateRoute = (jobId) => {
    return { jobId, route: `/marketplace/${jobId}` };
  };

  it('should not fetch job if jobId not present', async () => {
    const { container, store } = renderWithProviders(
      <MarketplaceJobOverview />,
      {
        route: '/marketplace',
        state: getStateAsExternalCreditor(testStoreState, {
          id: testUserId,
        }),
      }
    );

    expect(queryByTestId(container, 'tradie-job-overview')).toBeTruthy();
    expect(queryByTestId(container, 'header-title').textContent).toEqual(
      'Job Details'
    );
    expect(store.actions.length).toEqual(1);
  });

  describe('when user has a work order on a job', () => {
    let { jobId, route } = generateRoute('2');
    let state = getStateAsExternalCreditor(testStoreState, { id: testUserId });

    it("should fetch job and tradie's quote", () => {
      const { container, store } = renderWithProviders(
        <MarketplaceJobOverview />,
        { path, route, state }
      );

      expect(queryByTestId(container, 'tradie-job-overview')).toBeTruthy();
      expect(store.actions).toContainEqual(fetchJob(jobId));
      expect(store.actions).toContainEqual(fetchQuotesByJobId(jobId));
    });

    it('should show correct elements for a tradie', () => {
      const { container } = renderWithProviders(<MarketplaceJobOverview />, {
        path,
        route,
        state,
      });

      expect(queryByTestId(container, 'my-quote-title').textContent).toEqual(
        'My work order'
      );

      const myQuote = getByTestId(container, 'my-quote');
      const myCards = queryAllByTestId(myQuote, 'quote-card');
      expect(myCards.length).toEqual(1);

      const myMessage = getByTestId(container, 'quote-message');
      expect(myMessage.textContent).toEqual(
        expect.stringContaining('work order')
      );

      const otherQuotes = queryByTestId(container, 'other-quotes');
      expect(otherQuotes).toBeFalsy();
    });

    it('should show correct elements for a non tradie', () => {
      const { container } = renderWithProviders(<MarketplaceJobOverview />, {
        path,
        route,
        state: getStateAsPrimaryOwner(testStoreState),
      });

      const myQuote = queryByTestId(container, 'my-quote');
      expect(myQuote).toBeFalsy();

      const myMessage = queryByTestId(container, 'quote-message');
      expect(myMessage).toBeFalsy();

      const otherQuotes = getByTestId(container, 'other-quotes');
      const otherCards = queryAllByTestId(otherQuotes, 'quote-card');
      expect(otherCards.length).toEqual(2);
    });
  });

  describe('when user has a quote on a job', () => {
    let { jobId, route } = generateRoute('1');
    let state = getStateAsExternalCreditor(testStoreState, { id: testUserId });

    it("should fetch job and tradie's quote", () => {
      const { container, store } = renderWithProviders(
        <MarketplaceJobOverview />,
        { path, route, state }
      );

      expect(queryByTestId(container, 'tradie-job-overview')).toBeTruthy();
      expect(store.actions).toContainEqual(fetchJob(jobId));
      expect(store.actions).toContainEqual(fetchQuotesByJobId(jobId));
    });

    it('should show correct elements for a tradie', () => {
      const { container } = renderWithProviders(<MarketplaceJobOverview />, {
        path,
        route,
        state,
      });

      expect(queryByTestId(container, 'my-quote-title').textContent).toEqual(
        'My quote'
      );

      const myQuote = getByTestId(container, 'my-quote');
      const myCards = queryAllByTestId(myQuote, 'quote-card');
      expect(myCards.length).toEqual(1);

      const myMessage = getByTestId(container, 'quote-message');
      expect(myMessage.textContent).toEqual(
        expect.stringContaining('quote request')
      );

      const otherQuotes = queryByTestId(container, 'other-quotes');
      expect(otherQuotes).toBeFalsy();
    });

    it('should show correct elements for a non tradie', () => {
      const { container } = renderWithProviders(<MarketplaceJobOverview />, {
        path,
        route,
        state: getStateAsPrimaryOwner(testStoreState),
      });

      const myQuote = queryByTestId(container, 'my-quote');
      expect(myQuote).toBeFalsy();

      const myMessage = queryByTestId(container, 'quote-message');
      expect(myMessage).toBeFalsy();

      const otherQuotes = getByTestId(container, 'other-quotes');
      const otherCards = queryAllByTestId(otherQuotes, 'quote-card');
      expect(otherCards.length).toEqual(2);
    });
  });

  describe('when user does not have a quote on a job', () => {
    let { jobId, route } = generateRoute('3');
    let state = getStateAsExternalCreditor(testStoreState, { id: testUserId });

    it("should fetch job and tradie's quote", () => {
      const { container, store } = renderWithProviders(
        <MarketplaceJobOverview />,
        { path, route, state }
      );

      expect(queryByTestId(container, 'tradie-job-overview')).toBeTruthy();
      expect(store.actions).toContainEqual(fetchJob(jobId));
      expect(store.actions).toContainEqual(fetchQuotesByJobId(jobId));
    });

    it('should show quote create form for a tradie', () => {
      const { container } = renderWithProviders(<MarketplaceJobOverview />, {
        path,
        route,
        state,
      });

      expect(queryByTestId(container, 'marketplace-quote-create')).toBeTruthy();
    });

    it('should show quote create form for a non tradie', () => {
      const { container } = renderWithProviders(<MarketplaceJobOverview />, {
        path,
        route,
        state: getStateAsPrimaryOwner(testStoreState),
      });

      expect(queryByTestId(container, 'marketplace-quote-create')).toBeTruthy();
    });
  });
});
