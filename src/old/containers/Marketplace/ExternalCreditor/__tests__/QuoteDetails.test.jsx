import { waitFor } from '@testing-library/dom';
import { queryAllByTestId, queryByTestId } from '@testing-library/react';
import React from 'react';

import {
  QUOTE_STATUSES,
  fetchMessagesByQuoteId,
  fetchQuote,
} from '../../../../redux/marketplace';
import { getStateAsExternalCreditor } from '../../../../test/getStateAsUser';
import { renderWithStore } from '../../../../test/renderWithStore';
import { MarketplaceQuoteDetails } from '../QuoteDetails';

describe('MarketplaceQuoteDetails', () => {
  let mockHistory;

  const testLocation = { pathname: 'test-path' };

  const testJobs = {
    1: {
      id: 1,
      hasWorkOrder: true,
      tradieQuoteIds: [11, 33],
    },
    2: {
      id: 2,
      hasWorkOrder: false,
      tradieQuoteIds: [22, 33],
      acceptedQuoteId: 22,
    },
  };

  const testQuotes = {
    11: {
      id: 11,
      isWorkOrder: true,
      bidCents: 11100,
      status: QUOTE_STATUSES.awaitingAcceptance,
    },
    22: {
      id: 22,
      isWorkOrder: false,
      bidCents: 22200,
      status: QUOTE_STATUSES.accepted,
    },
    33: {
      id: 33,
      isWorkOrder: false,
      bidCents: 33300,
      status: QUOTE_STATUSES.quoting,
    },
  };

  const testMessages = {
    11: [
      { id: 12, action: 'invite' },
      { id: 13, action: 'send_message', content: 'Message id #13' },
    ],
    22: [
      { id: 22, action: 'invite' },
      { id: 23, action: 'send_message', content: 'Message id #13' },
      { id: 24, action: 'bid', data: { bidCents: 66600 } },
      { id: 25, action: 'revise', data: { bidCents: 77700 } },
    ],
  };

  const testStoreState = {
    marketplace: {
      job: { data: testJobs },
      message: { data: testMessages },
      quote: { data: testQuotes },
    },
  };

  beforeEach(() => {
    mockHistory = { push: jest.fn() };
  });

  describe('when quoteId does not exist', () => {
    it('should not fetch anything', async () => {
      const [{ container }, store] = renderWithStore(
        <MarketplaceQuoteDetails
          history={mockHistory}
          job={testJobs[1]}
          location={testLocation}
          quoteId={null}
        />,
        {
          initialState: getStateAsExternalCreditor(testStoreState),
        }
      );

      expect(queryByTestId(container, 'marketplace-activities')).toBeFalsy();

      await waitFor(() => {
        expect(store.actions).toHaveLength(0);
      });
    });
  });

  describe('when work order has not been accepted', () => {
    const testJob = testJobs[1];
    const quoteId = 11;

    it('should fetch quote and its messages', async () => {
      const [{ container }, store] = renderWithStore(
        <MarketplaceQuoteDetails
          history={mockHistory}
          job={testJob}
          location={testLocation}
          quoteId={quoteId}
        />,
        {
          initialState: getStateAsExternalCreditor(testStoreState),
        }
      );

      expect(queryByTestId(container, 'marketplace-activities')).toBeTruthy();

      await waitFor(() => {
        expect(store.actions).toHaveLength(2);
        expect(store.actions).toContainEqual(fetchQuote(quoteId));
        expect(store.actions).toContainEqual(fetchMessagesByQuoteId(quoteId));
      });
    });

    it('shows messages', async () => {
      const [{ container }] = renderWithStore(
        <MarketplaceQuoteDetails
          history={mockHistory}
          isShowQuote={true}
          job={testJob}
          location={testLocation}
          quoteId={quoteId}
        />,
        {
          initialState: getStateAsExternalCreditor(testStoreState),
        }
      );

      expect(queryAllByTestId(container, 'job-message-card').length).toEqual(3);
      expect(
        queryByTestId(container, 'revise-work-order-message')
      ).toBeTruthy();
      expect(queryByTestId(container, 'marketplace-message-form')).toBeTruthy();
    });
  });

  describe('when quote has been accepted and invoice not paid', () => {
    const testJob = testJobs[2];
    const quoteId = 22;

    it('shows messages', async () => {
      const [{ container }] = renderWithStore(
        <MarketplaceQuoteDetails
          history={mockHistory}
          isShowQuote={true}
          job={testJob}
          location={testLocation}
          quoteId={quoteId}
        />,
        {
          initialState: getStateAsExternalCreditor(testStoreState),
        }
      );

      expect(queryAllByTestId(container, 'job-message-card').length).toEqual(5);
      expect(queryByTestId(container, 'revise-work-order-message')).toBeFalsy();
      expect(queryByTestId(container, 'marketplace-message-form')).toBeTruthy();
    });
  });
});
