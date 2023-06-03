import { waitFor } from '@testing-library/dom';
import {
  getAllByTestId,
  queryAllByTestId,
  queryByTestId,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { MarketplaceMyJobs } from '@app/containers/Marketplace';
import {
  fetchJob,
  fetchJobs,
  fetchQuotesByJobId,
} from '@app/redux/marketplace';
import { getStateAsExternalCreditor } from '@app/test/getStateAsUser';
import { renderWithProviders } from '@app/test/renderWithProviders';

describe('MarketplaceMyJobs', () => {
  const testJobs = {
    1: { id: 1, hasWorkOrder: true },
    2: { id: 2, hasWorkOrder: false },
    3: { id: 3, hasWorkOrder: false },
    4: { id: 4, hasWorkOrder: false },
  };

  const testStoreState = {
    marketplace: {
      job: { data: testJobs, results: [1, 2, 3] },
    },
  };

  const path = '/marketplace/:type?';

  const generateRoute = (type, page) => {
    return { type, page, route: `/marketplace/${type}?page=${page}` };
  };

  describe('when params does not contain jobId', () => {
    const { page, route } = generateRoute('', '2');
    let state = getStateAsExternalCreditor(testStoreState);

    it('should fetch jobs', () => {
      const { container, store } = renderWithProviders(<MarketplaceMyJobs />, {
        path,
        route,
        state,
      });

      expect(queryByTestId(container, 'marketplace-new-jobs')).toBeTruthy();
      expect(queryByTestId(container, 'marketplace-my-jobs')).toBeFalsy();
      expect(
        queryAllByTestId(container, 'tradie-jobs-preview-card').length
      ).toEqual(3);
      expect(store.actions).toContainEqual(
        fetchJobs({ page, jobId: undefined })
      );
    });
  });

  describe('when params contains jobId', () => {
    const { page, type, route } = generateRoute('my-jobs', '2');
    let state = getStateAsExternalCreditor(testStoreState);

    it('should fetch jobs and job preview', async () => {
      const jobId = '1';

      const { container, store } = renderWithProviders(<MarketplaceMyJobs />, {
        path,
        state,
        route: `${route}&jobId=${jobId}`,
      });

      expect(queryByTestId(container, 'marketplace-my-jobs')).toBeTruthy();
      expect(queryByTestId(container, 'marketplace-job-preview')).toBeTruthy();
      expect(
        queryAllByTestId(container, 'my-jobs-preview-card').length
      ).toEqual(3);
      expect(store.actions).toContainEqual(fetchJobs({ page, type }));

      await waitFor(() => {
        expect(store.actions).toContainEqual(fetchJob(jobId));
        expect(store.actions).toContainEqual(fetchQuotesByJobId(jobId));
      });
    });

    it('should update jobId param when a job is clicked', () => {
      const { container, history } = renderWithProviders(
        <MarketplaceMyJobs />,
        { path, route, state }
      );

      const jobs = getAllByTestId(container, 'my-jobs-preview-card');
      expect(jobs.length).toEqual(3);

      userEvent.click(jobs[2]);
      expect(history.location.pathname).toEqual('/marketplace/my-jobs');
      expect(history.location.search).toEqual('?job_id=3&page=2');
    });
  });
});
