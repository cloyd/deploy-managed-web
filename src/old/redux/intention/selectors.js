import filter from 'lodash/fp/filter';
import sortBy from 'lodash/fp/sortBy';

const isPayable = ({ status }) => status !== 'completed';

export const getIntention = (state, id) => {
  return state.data[id] || {};
};

export const getIntentionsAll = (state) => {
  const { data, results } = state;
  return results ? results.map((id) => data[id]) : [];
};

export const getIntentionsForProperty = (state, propertyId) => {
  const { completed, payable } = state;
  const completedIds = completed[propertyId] || [];
  const payableIds = payable[propertyId] || [];

  const result = {
    completed: completedIds.map((id) => getIntention(state, id)),
    payable: payableIds.map((id) => getIntention(state, id)).filter(isPayable),
  };

  // Sorting the completed intentions by paidAt
  // And pushing items with no paidAt at bottom
  const withPaidAtSortedIntentions = sortBy(
    'paidAt',
    filter((intention) => intention.paidAt, result.completed)
  ).reverse();

  const withoutPaidAtIntentions = filter(
    (intention) => !intention.paidAt,
    result.completed
  );

  return {
    ...result,
    completed: [...withPaidAtSortedIntentions, ...withoutPaidAtIntentions],
  };
};
