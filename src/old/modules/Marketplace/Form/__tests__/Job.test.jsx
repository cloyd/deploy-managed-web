import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { MarketplaceFormJob } from '@app/modules/Marketplace';
import { mockHttpClient } from '@app/redux/__mocks__';
import { createJob, updateJob } from '@app/redux/marketplace';
import { renderWithProviders } from '@app/test/renderWithProviders';

describe('MarketplaceFormJob', () => {
  const tagOptions = [
    { id: 1, name: 'One' },
    { id: 2, name: 'Two' },
  ];

  const property = {
    id: 1,
  };

  const task = {
    id: 2,
    propertyId: property.id,
    title: 'Window repairs',
    description: 'They are broken',
    taskType: { id: '1', key: 'key-1' },
    taskStatus: {},
  };

  const initialState = {
    marketplace: {
      isLoading: false,
      meta: { tags: tagOptions },
      job: { data: {} },
    },
  };

  const path = '/create/:jobType(work-order|quote)?/:step?';

  describe('MarketplaceFormJobCreate', () => {
    const state = { ...initialState };

    it('should create a work order job', async () => {
      mockHttpClient.onPost('/tradie-jobs/work-orders').reply(200, { id: 1 });

      const { history, store } = renderWithProviders(
        <MarketplaceFormJob task={task} />,
        { state, path, route: '/create' }
      );

      expect(screen.getByText('How can we help?')).toBeTruthy();

      userEvent.click(screen.getByText('Send a Work Order'));
      userEvent.click(screen.getByText('Next'));
      expect(history.location.pathname).toEqual('/create/work-order/details');

      // Prefills title & description
      expect(screen.getByDisplayValue(task.title)).toBeTruthy();
      expect(screen.getByDisplayValue(task.description)).toBeTruthy();

      // Select type of job
      await waitFor(() => {
        userEvent.type(screen.getByLabelText('Type of Job'), 'One{enter}');
        userEvent.click(screen.getByText('One'));
      });

      //  Enter budget
      const budgetField = screen.getByTestId('form-field-budgetDollars');
      userEvent.type(budgetField, '1000{enter}');
      await waitFor(() => fireEvent.blur(budgetField));

      userEvent.click(screen.getByText('Next'));
      expect(history.location.pathname).toEqual('/create/work-order/tradies');

      // TODO: Add tests for adding tradieIds
      userEvent.click(screen.getByText('Send work order'));
      expect(store.actions).toContainEqual(
        createJob({
          jobType: 'work_order',
          title: task.title,
          description: task.description,
          budgetCents: 100000,
          propertyTaskId: task.id,
          tagIds: [tagOptions[0].id],
        })
      );

      // TODO: There is an issue with logic receiving the dispatch and
      // updating the state preventing the next step in testing.

      // await waitFor(() => {
      //   expect(history.location.pathname).toEqual('/job/work-order/complete');
      // });

      // userEvent.click(screen.getByText('View Job'));

      // await waitFor(() => {
      //   expect(history.location.pathname).toEqual('/job');
      // });
    });

    it('should create a quote job', async () => {
      mockHttpClient.onPost('/tradie-jobs').reply(200, { id: 1 });

      const { history, store } = renderWithProviders(
        <MarketplaceFormJob task={task} />,
        { state, path, route: '/create' }
      );

      expect(screen.getByText('How can we help?')).toBeTruthy();

      fireEvent.click(screen.getByText('Collect Some Quotes'));
      fireEvent.click(screen.getByText('Next'));
      expect(history.location.pathname).toEqual('/create/quote/details');

      // Prefills title & description
      expect(screen.getByDisplayValue(task.title)).toBeTruthy();
      expect(screen.getByDisplayValue(task.description)).toBeTruthy();

      // Select type of job
      await waitFor(() => {
        userEvent.type(screen.getByLabelText('Type of Job'), 'Two{enter}');
        fireEvent.click(screen.getByText('Two'));
      });

      fireEvent.click(screen.getByText('Next'));
      expect(history.location.pathname).toEqual('/create/quote/tradies');

      // TODO: Add tests for adding tradieIds
      fireEvent.click(screen.getByText('Get quotes'));
      expect(store.actions).toContainEqual(
        createJob({
          jobType: 'quote',
          title: task.title,
          description: task.description,
          propertyTaskId: task.id,
          tagIds: [tagOptions[1].id],
        })
      );

      // TODO: There is an issue with logic receiving the dispatch and
      // updating the state preventing the next step in testing.

      // await waitFor(() => {
      //   expect(history.location.pathname).toEqual('/job/work-order/complete');
      // });

      // fireEvent.click(screen.getByText('View Job'));

      // await waitFor(() => {
      //   expect(history.location.pathname).toEqual('/job');
      // });
    });
  });

  describe('MarketplaceFormJobEdit', () => {
    const job = {
      id: 1,
      budgetCents: 100_00,
      title: task.title,
      description: task.description,
      propertyTaskId: task.id,
      hasWorkOrder: false,
      tagIds: [tagOptions[1].id],
      attachments: [],
      taskAttachments: [],
    };

    const state = { ...initialState };

    it('should edit a quote', () => {
      const { store } = renderWithProviders(
        <MarketplaceFormJob task={task} job={job} />,
        { state }
      );

      expect(screen.getByTestId('form-job-edit')).toBeTruthy();

      const title = screen.getByDisplayValue(job.title);
      userEvent.clear(title);
      userEvent.type(title, 'New Title');

      const description = screen.getByDisplayValue(job.description);
      userEvent.clear(description);
      userEvent.type(description, 'New Description');

      userEvent.click(screen.getByText('Save'));
      expect(store.actions).toContainEqual(
        updateJob({
          jobId: job.id,
          jobType: 'quote',
          title: 'New Title',
          description: 'New Description',
          budgetCents: job.budgetCents,
          propertyTaskId: job.propertyTaskId,
          tagIds: job.tagIds,
        })
      );
    });
  });
});
