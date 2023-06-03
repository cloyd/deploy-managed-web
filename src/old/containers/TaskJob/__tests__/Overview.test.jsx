import {
  getAllByTestId,
  getByTestId,
  queryAllByTestId,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { TaskJobOverview } from '@app/containers/TaskJob';
import { cancelJob, fetchMessagesByQuoteId } from '@app/redux/marketplace';
import { getStateAsManager } from '@app/test/getStateAsUser';
import { renderWithProviders } from '@app/test/renderWithProviders';

describe('TaskJobOverview', () => {
  const testTask = {
    id: 777,
    propertyId: 888,
    tradieJobId: null,
    taskStatus: 'draft',
  };

  const testJobs = {
    1: {
      id: 1,
      hasWorkOrder: true,
      tradieQuoteIds: [11, 22, 33],
      attachments: [],
      taskAttachments: [],
    },
    2: {
      id: 2,
      hasWorkOrder: false,
      tradieQuoteIds: [44, 55],
      attachments: [],
      taskAttachments: [],
    },
  };

  const testQuotes = {
    11: {
      id: 11,
      isWorkOrder: true,
      bidCents: 11100,
      tradieJobId: 1,
    },
    22: {
      id: 22,
      isWorkOrder: false,
      bidCents: 22200,
      tradieJobId: 1,
    },
    33: {
      id: 33,
      isWorkOrder: false,
      bidCents: 33300,
      tradieJobId: 1,
    },
    44: {
      id: 44,
      isWorkOrder: false,
      bidCents: 22200,
      tradieJobId: 2,
    },
    55: {
      id: 55,
      isWorkOrder: false,
      bidCents: 33300,
      tradieJobId: 2,
    },
  };

  const testStoreState = {
    marketplace: {
      isLoading: false,
      job: { data: testJobs },
      quote: { data: testQuotes },
      message: { data: [] },
      meta: { tags: [] },
    },
  };

  describe('when task does not have a job', () => {
    it('should not fetch anything', () => {
      const { store } = renderWithProviders(
        <TaskJobOverview task={testTask} />,
        {
          state: getStateAsManager(testStoreState, {
            isMarketplaceEnabled: true,
          }),
        }
      );

      expect(screen.queryByTestId('task-job-overview')).toBeFalsy();
      expect(store.actions).toHaveLength(0);
    });
  });

  describe('when task job is a work order', () => {
    const task = { ...testTask, tradieJobId: 1 };
    const job = { ...testJobs[1] };

    it('should fetch job and its quotes', () => {
      const { store } = renderWithProviders(
        <TaskJobOverview task={task} job={job} />,
        {
          path: '/:tab?/:quoteId?',
          route: '/quote/1',
          state: getStateAsManager(testStoreState, {
            isMarketplaceEnabled: true,
          }),
        }
      );

      expect(screen.queryByTestId('task-job-overview')).toBeTruthy();
      expect(store.actions).toContainEqual(fetchMessagesByQuoteId('1'));
    });

    it('should show correct components', () => {
      renderWithProviders(<TaskJobOverview task={task} job={job} />, {
        state: getStateAsManager(testStoreState, {
          isMarketplaceEnabled: true,
        }),
      });

      const workOrders = screen.getByTestId('overview-work-orders');
      expect(workOrders).toBeTruthy();
      expect(queryAllByTestId(workOrders, 'quote-card').length).toEqual(1);

      const otherQuotes = screen.getByTestId('overview-quotes');
      expect(otherQuotes).toBeTruthy();
      expect(queryAllByTestId(otherQuotes, 'quote-card').length).toEqual(2);
    });

    it('should update params if quote is clicked', () => {
      const { history } = renderWithProviders(
        <TaskJobOverview task={task} job={job} />,
        {
          state: getStateAsManager(testStoreState, {
            isMarketplaceEnabled: true,
          }),
        }
      );

      const quotes = screen.getByTestId('overview-quotes');
      expect(quotes).toBeTruthy();

      userEvent.click(getAllByTestId(quotes, 'quote-card')[1]);
      expect(history.location.pathname).toBe(
        `/property/${task.propertyId}/tasks/${task.id}/job/quote/33`
      );
    });
  });

  describe('when task job is not a work order', () => {
    const task = { ...testTask, tradieJobId: 2 };
    const job = { ...testJobs[2] };

    it('should fetch job and its quotes', () => {
      const { store } = renderWithProviders(
        <TaskJobOverview task={task} job={job} />,
        {
          path: '/:tab?/:quoteId?',
          route: '/quote/2',
          state: getStateAsManager(testStoreState, {
            isMarketplaceEnabled: true,
          }),
        }
      );

      expect(screen.queryByTestId('task-job-overview')).toBeTruthy();
      expect(store.actions).toContainEqual(fetchMessagesByQuoteId('2'));
    });

    it('should show correct components', () => {
      renderWithProviders(<TaskJobOverview task={task} job={job} />, {
        state: getStateAsManager(testStoreState, {
          isMarketplaceEnabled: true,
        }),
      });

      expect(screen.queryByTestId('overview-work-orders')).toBeFalsy();

      const otherQuotes = screen.getByTestId('overview-quotes');
      expect(otherQuotes).toBeTruthy();
      expect(queryAllByTestId(otherQuotes, 'quote-card').length).toEqual(2);
    });

    it('should update quoteId param when a quote is clicked', () => {
      const { history } = renderWithProviders(
        <TaskJobOverview task={task} job={job} />,
        {
          state: getStateAsManager(testStoreState, {
            isMarketplaceEnabled: true,
          }),
        }
      );

      expect(screen.queryByTestId('overview-work-orders')).toBeFalsy();

      const otherQuotes = screen.getByTestId('overview-quotes');
      const otherQuotesCards = getAllByTestId(otherQuotes, 'quote-card');
      userEvent.click(otherQuotesCards[1]);

      expect(history.location.pathname).toBe(
        `/property/${task.propertyId}/tasks/${task.id}/job/quote/55`
      );
    });

    it('should be cancelled', () => {
      const state = { ...testStoreState };
      state.marketplace.job.data[task.tradieJobId].acceptedQuoteId = 11;

      const { store } = renderWithProviders(
        <TaskJobOverview task={task} job={job} />,
        {
          state: getStateAsManager(testStoreState, {
            isMarketplaceEnabled: true,
          }),
        }
      );

      const quotes = screen.getAllByTestId('quote-card');
      userEvent.click(quotes[0]);

      const cancelButton = screen.queryByTestId('button-job-cancel');
      userEvent.click(cancelButton);

      const modal = screen.getByTestId('modal-confirm');
      userEvent.click(getByTestId(modal, 'form-submit-btn'));
      expect(store.actions).toContainEqual(cancelJob(task.tradieJobId));
    });
  });
});
