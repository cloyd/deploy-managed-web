/* eslint-disable no-undef */
import {
  archiveTask,
  createTask,
  createTaskMessage,
  createTaskQuote,
  destroyTask,
  fetchPropertyTasks,
  fetchTask,
  fetchTaskMessages,
  fetchTasks,
  sendTask,
  updateTask,
  updateTaskForOwnerReview,
} from '../actions';
import {
  ARCHIVE,
  CREATE,
  CREATE_MESSAGE,
  CREATE_QUOTE,
  DESTROY,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_PROPERTY,
  FETCH_MESSAGES,
  SEND_INVOICE,
  UPDATE,
} from '../constants';

describe('task/actions', () => {
  it('should return action for createMessage', () => {
    const received = createTaskMessage({
      propertyId: 1,
      taskId: 2,
      body: 'body',
    });

    const expected = {
      type: CREATE_MESSAGE,
      payload: {
        propertyId: 1,
        taskId: 2,
        params: { body: 'body' },
      },
    };

    expect(received).toEqual(expected);
  });

  describe('createTask', () => {
    it('should return action', () => {
      const received = createTask({ propertyId: 1, title: 'title' });
      const expected = {
        type: CREATE,
        payload: {
          propertyId: 1,
          params: { title: 'title' },
        },
      };

      expect(received).toEqual(expected);
    });

    it('should return action with type arrears as arrear', () => {
      const received = createTask({
        propertyId: 1,
        title: 'title',
        type: 'arrears',
      });
      const expected = {
        type: CREATE,
        payload: {
          propertyId: 1,
          params: { title: 'title', type: 'arrear' },
        },
      };

      expect(received).toEqual(expected);
    });
  });

  it('should return action for createTaskQuote', () => {
    const received = createTaskQuote({
      note: 'hello',
      propertyId: 2,
      taskId: 1,
    });
    const expected = {
      type: CREATE_QUOTE,
      payload: { taskId: 1, propertyId: 2, note: 'hello' },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for destroyTask', () => {
    const received = destroyTask({ id: 1, propertyId: 2, title: 'title' });
    const expected = {
      type: DESTROY,
      payload: { taskId: 1, propertyId: 2 },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for archiveTask', () => {
    const received = archiveTask({ id: 1, propertyId: 2, title: 'title' });
    const expected = {
      type: ARCHIVE,
      payload: { taskId: 1, propertyId: 2 },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchPropertyTasks', () => {
    const received = fetchPropertyTasks({ propertyId: 1 });
    const expected = {
      type: FETCH_ALL_PROPERTY,
      payload: {
        propertyId: 1,
        params: {
          'q[sorts]': 'due_date desc',
        },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchPropertyTasks with statusIn', () => {
    const received = fetchPropertyTasks({
      propertyId: 1,
      statusIn: ['completed'],
    });

    const expected = {
      type: FETCH_ALL_PROPERTY,
      payload: {
        propertyId: 1,
        params: {
          'q[taskStatusKeyIn]': ['completed'],
          'q[sorts]': 'due_date desc',
        },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchPropertyTasks with statusNotIn', () => {
    const received = fetchPropertyTasks({
      propertyId: 1,
      statusNotIn: ['one', 'two', 'three'],
    });

    const expected = {
      type: FETCH_ALL_PROPERTY,
      payload: {
        propertyId: 1,
        params: {
          'q[taskStatusKeyNotIn]': ['one', 'two', 'three'],
          'q[sorts]': 'due_date desc',
        },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchTask', () => {
    const received = fetchTask({ propertyId: 1, taskId: 1 });
    const expected = { type: FETCH, payload: { propertyId: 1, taskId: 1 } };
    expect(received).toEqual(expected);
  });

  it('should return action for fetchTaskMessages', () => {
    const received = fetchTaskMessages({ id: 1, propertyId: 1 });
    const expected = {
      type: FETCH_MESSAGES,
      payload: { propertyId: 1, taskId: 1 },
    };
    expect(received).toEqual(expected);
  });

  it('should return action for fetchTasks', () => {
    const received = fetchTasks({
      assigneeId: 'assigneeId',
      isManager: false,
      priority: 'priority',
      type: 'type',
    });

    const expected = {
      type: FETCH_ALL,
      payload: {
        params: {
          'q[assigneeIdEq]': 'assigneeId',
          'q[priorityEq]': 'priority',
          'q[taskTypeKeyEq]': 'type',
          'q[propertyIdEq]': undefined,
          'q[sorts]': 'due_date desc',
        },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchTasks without statusEq when isManager', () => {
    const received = fetchTasks({
      assigneeId: 'assigneeId',
      isManager: true,
      priority: 'priority',
      type: 'type',
    });

    const expected = {
      type: FETCH_ALL,
      payload: {
        params: {
          'q[assigneeIdEq]': 'assigneeId',
          'q[priorityEq]': 'priority',
          'q[taskTypeKeyEq]': 'type',
          'q[sorts]': 'due_date desc',
        },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchTasks with statusEq', () => {
    const received = fetchTasks({
      assigneeId: 'assigneeId',
      isManager: true,
      priority: 'priority',
      status: 'status',
      type: 'type',
    });

    const expected = {
      type: FETCH_ALL,
      payload: {
        params: {
          'q[assigneeIdEq]': 'assigneeId',
          'q[priorityEq]': 'priority',
          'q[taskStatusKeyEq]': 'status',
          'q[taskTypeKeyEq]': 'type',
          'q[sorts]': 'due_date desc',
        },
      },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for sendTask', () => {
    const received = sendTask({ id: 1, propertyId: 2, a: 'a' });
    const expected = {
      type: SEND_INVOICE,
      payload: { propertyId: 2, taskId: 1 },
    };

    expect(received).toEqual(expected);
  });

  describe('updateTask', () => {
    it('should return action', () => {
      const received = updateTask({ propertyId: 1, taskId: 1, a: 'a' });
      const expected = {
        type: UPDATE,
        payload: { propertyId: 1, taskId: 1, params: { a: 'a' } },
      };

      expect(received).toEqual(expected);
    });

    it('should return action with type arrears as arrear', () => {
      const received = updateTask({
        propertyId: 1,
        taskId: 1,
        a: 'a',
        type: 'arrears',
      });
      const expected = {
        type: UPDATE,
        payload: {
          propertyId: 1,
          taskId: 1,
          params: { a: 'a', type: 'arrear' },
        },
      };

      expect(received).toEqual(expected);
    });
  });

  describe('updateTaskForOwnerReview', () => {
    it('should return action', () => {
      const received = updateTaskForOwnerReview({ propertyId: 1, id: 1 });
      const expected = {
        type: UPDATE,
        payload: {
          propertyId: 1,
          taskId: 1,
          message: 'Owner has been notified and is now following the task',
          params: { followedByOwner: true, ownerReviewable: true },
        },
      };

      expect(received).toEqual(expected);
    });
  });
});
