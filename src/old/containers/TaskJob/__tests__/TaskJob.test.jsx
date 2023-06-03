import { screen } from '@testing-library/react';
import React from 'react';

import { TaskJob } from '@app/containers/TaskJob';
import {
  getStateAsManager,
  getStateAsPrimaryOwner,
} from '@app/test/getStateAsUser';
import { renderWithProviders } from '@app/test/renderWithProviders';

describe('TaskJob', () => {
  const task = {
    id: 777,
    propertyId: 888,
    isMaintenance: true,
    tradieJobId: null,
    taskType: { id: '1', key: 'key-1' },
    taskStatus: {},
  };

  const state = {
    marketplace: {
      job: {
        data: {
          1: {
            id: 1,
            hasWorkOrder: true,
            attachments: [],
            taskAttachments: [],
          },
        },
      },
      meta: { tags: [] },
      message: { data: [] },
      quote: { data: [] },
    },
  };

  describe('when logged in as a manager', () => {
    it('should redirect if no job and isMarketplaceEnabled is false', () => {
      const { history } = renderWithProviders(<TaskJob task={task} />, {
        path: '/job',
        route: '/job/create',
        state: getStateAsManager(state, {
          isMarketplaceEnabled: false,
        }),
      });

      expect(history.location.pathname).toEqual('/property/888/tasks/777');
    });

    it('should show job create page', () => {
      renderWithProviders(<TaskJob task={task} />, {
        path: '/job',
        route: '/job/create',
        state: getStateAsManager(state, {
          isMarketplaceEnabled: true,
        }),
      });

      expect(screen.queryByTestId('form-job-create')).toBeTruthy();
      expect(screen.queryByTestId('tradie-job-overview')).toBeFalsy();
    });

    it('should show job overview page', () => {
      renderWithProviders(<TaskJob task={{ ...task, tradieJobId: 1 }} />, {
        path: '/job',
        route: '/job',
        state: getStateAsManager(state, {
          isMarketplaceEnabled: true,
        }),
      });

      expect(screen.queryByTestId('task-job-form')).toBeFalsy();
      expect(screen.queryByTestId('task-job-overview')).toBeTruthy();
    });
  });

  describe('when logged in as an owner', () => {
    it('should hide job create page and redirect', () => {
      const { history } = renderWithProviders(
        <TaskJob task={{ ...task, tradieJobId: 1 }} />,
        {
          path: '/job',
          route: '/job/create',
          state: getStateAsPrimaryOwner(state, {
            isMarketplaceEnabled: true,
          }),
        }
      );

      expect(history.location.pathname).toEqual('/property/888/tasks/777');
    });

    it('should show job overview page', () => {
      renderWithProviders(<TaskJob task={{ ...task, tradieJobId: 1 }} />, {
        path: '/job',
        route: '/job',
        state: getStateAsPrimaryOwner(state, {
          isMarketplaceEnabled: true,
        }),
      });

      expect(screen.queryByTestId('task-job-form')).toBeFalsy();
      expect(screen.queryByTestId('task-job-overview')).toBeTruthy();
    });
  });
});
