import { createLogic } from 'redux-logic';
import { createMockStore } from 'redux-logic-test';

import { httpClient } from '../../utils';

export const mockReduxLogic = ({ logic, injectedDeps, ...params }) =>
  createMockStore({
    ...params,
    logic: logic.map(createLogic),
    injectedDeps: {
      ...injectedDeps,
      httpClient,
    },
  });
