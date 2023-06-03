import camelCase from 'lodash/fp/camelCase';
import startCase from 'lodash/fp/startCase';
import { plural } from 'pluralize';

import { USER_TYPES } from '../users';

export const getTask = (state, id) => {
  const task = state.data[id] || {};
  const { invoice } = task;

  // Attach invoice category meta label
  if (invoice) {
    const { category } = invoice;
    const invoiceMeta = getTaskCategories(state, 'invoice');
    const invoiceCategory = invoiceMeta.find((cat) => cat.value === category);

    return {
      ...task,
      categoryLabel: invoiceCategory
        ? invoiceCategory.label
        : startCase(task?.taskCategory?.key),
    };
  }

  return {
    ...task,
    categoryLabel: task?.taskCategory?.key
      ? startCase(task?.taskCategory?.key)
      : undefined,
  };
};

export const getTasks = (state, type) => {
  try {
    return state.results.map((id) => getTask(state, id));
  } catch (e) {
    return [];
  }
};

export const getTasksForProperty = (state, property) => {
  return getTasks(state).filter(({ propertyId }) => propertyId === property.id);
};

export const getTaskActivities = (state, task) => {
  return state.activities[task.id] || [];
};

export const getTaskLastReplyingRole = (state, role) => {
  const lastMessage = state
    .filter(({ fromType }) => fromType.toLowerCase() !== role)
    .pop();

  return lastMessage ? plural(lastMessage.fromType.toLowerCase()) : '';
};

export const getTaskMessages = (state, task = {}) => {
  return state.messages[task.id] || [];
};

export const getTaskMeta = (state) => {
  return state.meta || {};
};

export const getSimilarTasksForProperty = (state, propertyId) => {
  return state.similar[propertyId] || {};
};

const updatedCategories = (categories) => {
  if (categories === undefined) return [];

  const cleanCategoryList = categories.filter(
    (category) => category.id !== undefined
  );
  const uniqueCategoryList = [
    ...new Map(cleanCategoryList.map((item) => [item.key, item])).values(),
  ];

  return uniqueCategoryList.map((category) => ({
    label: category.name,
    value: category.key,
  }));
};

export const getTaskCategories = (state, key) => {
  if (!key) {
    return updatedCategories(state.categories);
  }

  const meta = getTaskMeta(state)[camelCase(key)] || {};
  const categories = updatedCategories(meta.categories);

  // special case 1: key=Bill, show Invoice categories
  // special case 2: key=Maintenance, show both meta categories + Invoice categories
  if (key === 'bill' || key === 'maintenance') {
    const invoiceMeta = getTaskMeta(state)['invoice'] || {};
    return categories.concat(invoiceMeta.categories || []);
  }

  return categories;
};

const updatedStatuses = (statuses) => {
  if (statuses === undefined) return [];
  // Add a status incomplete by default from FE as the BE doesn't have this special status to send in meta.
  // TO BE looked at in the future if there is a change in meta statuses.
  let incompleteStatus = {
    id: 9999,
    name: 'Incomplete',
    key: 'incomplete',
    custom: false,
    inUse: false,
    position: 9999,
  };

  const uniqueStatusList = [
    incompleteStatus,
    ...new Map(statuses.map((item) => [item.key, item])).values(),
  ];

  return uniqueStatusList.map((status) => ({
    label: status.name,
    value: status.key,
  }));
};

export const getTaskStatuses = (state, key) => {
  if (!key) {
    return updatedStatuses(state.statuses);
  }

  const meta = getTaskMeta(state)[camelCase(key)] || {};
  return updatedStatuses(meta.statuses);
};

export const isSearchableCreditor = (
  creditorType,
  hasAllowedBpayBillerAsCreditor = false
) =>
  creditorType === 'ExternalCreditor' ||
  (hasAllowedBpayBillerAsCreditor && creditorType === 'BpayBiller');

export const parseCreditorType = (type) =>
  type === 'ExternalCreditor' ? USER_TYPES.externalCreditor : type;
