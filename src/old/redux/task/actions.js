import {
  ARCHIVE,
  CREATE,
  CREATE_MESSAGE,
  CREATE_QUOTE,
  DESTROY,
  FETCH,
  FETCH_ALL,
  FETCH_ALL_PROPERTY,
  FETCH_BPAY_BILLERS,
  FETCH_MESSAGES,
  FETCH_META,
  FETCH_SIMILAR,
  FETCH_TASK_ACTIVITIES,
  SEND_ENTRY_FORM,
  SEND_INVOICE,
  SUCCESS,
  UPDATE,
  UPDATE_ATTACHMENTS,
} from './constants';

const decorateTaskType = (type) => (type === 'arrears' ? 'arrear' : type);

export const createTaskMessage = ({ propertyId, taskId, ...params }) => {
  return { type: CREATE_MESSAGE, payload: { propertyId, taskId, params } };
};

export const createTaskQuote = (payload) => ({
  type: CREATE_QUOTE,
  payload,
});

export const createTask = ({ propertyId, type, ...params }) => {
  return {
    type: CREATE,
    payload: {
      propertyId,
      params: { ...params, type: decorateTaskType(type) },
    },
  };
};

export const destroyTask = ({ id, propertyId }) => {
  return { type: DESTROY, payload: { taskId: id, propertyId } };
};

export const archiveTask = ({ id, propertyId }) => {
  return { type: ARCHIVE, payload: { taskId: id, propertyId } };
};

export const fetchBpayBillers = (payload) => {
  return { type: FETCH_BPAY_BILLERS, payload };
};

export const fetchPropertyTasks = ({
  propertyId,
  statusNotIn,
  statusIn,
  sort,
  ...params
}) => {
  if (statusNotIn) {
    params['q[taskStatusKeyNotIn]'] = statusNotIn;
  }

  if (statusIn) {
    params['q[taskStatusKeyIn]'] = statusIn;
  }

  params['q[sorts]'] = sort
    ? `${TASK_SORT_PARAMETER[sort.key]} ${DIRECTION[sort.direction]}`
    : `${TASK_SORT_PARAMETER.date} desc`;

  return {
    type: FETCH_ALL_PROPERTY,
    payload: { propertyId, params },
  };
};

export const fetchTask = ({ propertyId, taskId }) => {
  return { type: FETCH, payload: { propertyId, taskId } };
};

export const fetchTaskActivities = ({ propertyId, taskId }) => {
  return { type: FETCH_TASK_ACTIVITIES, payload: { propertyId, taskId } };
};

export const fetchTaskMessages = ({ id, propertyId }) => {
  return { type: FETCH_MESSAGES, payload: { propertyId, taskId: id } };
};

const TASK_SORT_PARAMETER = {
  title: 'title',
  date: 'due_date',
  status: 'task_status_name',
  type: 'task_type_name',
  address: 'property_address_street',
  priority: 'task_type_key',
  intentionStatusLabel: 'task_intentionStatus_label',
};

const DIRECTION = {
  ascending: 'asc',
  descending: 'desc',
};

export const fetchTasks = (queryParams) => {
  const {
    assigneeId,
    category,
    excludeAgencyBills,
    keyword,
    page,
    perPage,
    priority,
    propertyId,
    status,
    statusNotIn,
    type,
    isPropertyArchived,
    sort,
  } = queryParams;

  const params = {
    page,
    perPage,
    'q[assigneeIdEq]': assigneeId,
    'q[priorityEq]': priority,
    'q[propertyIdEq]': propertyId,
    'q[taskTypeKeyEq]': decorateTaskType(type),
    isPropertyArchived: isPropertyArchived,
  };

  if (category) {
    params['q[taskCategoryKeyOrInvoiceCategoryEq]'] = category;
  }

  if (excludeAgencyBills === 'true') {
    params['q[excludeAgencyBills]'] = true;
  }

  if (status) {
    // incomplete does not exist in backend so we change the params conditionally
    if (status === 'incomplete') {
      params['q[taskStatusKeyNotIn]'] = ['completed'];
    } else {
      params['q[taskStatusKeyEq]'] = status;
    }
  } else if (statusNotIn) {
    params['q[taskStatusKeyNotIn]'] = statusNotIn;
  }

  if (keyword) {
    params['q[searchByKeyword]'] = keyword;
  }

  params['q[sorts]'] = sort
    ? `${TASK_SORT_PARAMETER[sort.key]} ${DIRECTION[sort.direction]}`
    : `${TASK_SORT_PARAMETER.date} desc`;

  return {
    type: FETCH_ALL,
    payload: { params },
  };
};

export const fetchSimilarTasks = ({ propertyId, invoiceCategory, type }) => {
  return {
    type: FETCH_SIMILAR,
    payload: { propertyId, invoiceCategory, type },
  };
};

export const fetchTaskMeta = ({ propertyId }) => ({
  type: FETCH_META,
  payload: { propertyId },
});

export const sendEntryForm = ({ params, propertyId, taskId }) => ({
  type: SEND_ENTRY_FORM,
  payload: { params, propertyId, taskId },
});

export const sendTask = ({ id, propertyId }) => ({
  type: SEND_INVOICE,
  payload: { propertyId, taskId: id },
});

export const updateTask = ({ propertyId, taskId, type, ...params }) => ({
  type: UPDATE,
  payload: {
    propertyId,
    taskId,
    params: { ...params, type: decorateTaskType(type) },
  },
});

export const updateTaskForOwnerReview = ({ propertyId, id: taskId }) => ({
  type: UPDATE,
  payload: {
    propertyId,
    taskId,
    message: 'Owner has been notified and is now following the task',
    params: { followedByOwner: true, ownerReviewable: true },
  },
});

export const updateTaskAttachments = ({ attachableId, attachments }) => ({
  type: UPDATE_ATTACHMENTS,
  payload: { attachableId, attachments },
});

export const setTaskJobIds = (
  task,
  tradieJobId = null,
  acceptedQuoteId = null
) => ({
  type: SUCCESS,
  payload: {
    data: {
      [task.id]: { ...task, tradieJobId, acceptedQuoteId },
    },
  },
});
