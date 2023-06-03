import sortBy from 'lodash/fp/sortBy';

export const destroy =
  (key = 'id') =>
  (state, action) => {
    const { [action.payload[key]]: deleted, ...data } = state.data;

    state.data = data;
    state.isLoading = false;

    if (state.result) {
      state.result = null;
    }
  };

export const isLoading = (value) => (state) => {
  state.isLoading = value;

  if (state.result) {
    state.result = null;
  }
};

export const reset = (initialState) => () => initialState;

export const success = () => (state, action) => {
  state.isLoading = false;
  state.result = action.payload.result;
  state.data = {
    ...state.data,
    ...action.payload.data,
  };
};

/**
 * Reducer helper function that updates the 'position' of a list of items.
 * This is intended for use with models that use the acts_as_list gem.
 *
 * @param {Object[]} items array of items that contain a 'position' value
 * @param {Object} data the item that's 'position' is being updated
 * @returns {Object} object of items keyed by id
 */
export const formatItemPositions = (items = [], data = {}) => {
  let itemsData = { [data.id]: data };

  if (data.position) {
    const sortedItems = sortBy(['position'], items);
    const index = sortedItems.findIndex((item) => item.id === data.id);
    const length = sortedItems.length;

    sortedItems.splice(index, 1);

    for (let i = 1; i <= length; i++) {
      if (i !== data.position) {
        const item = sortedItems.shift();
        itemsData[item.id] = {
          ...item,
          position: i,
        };
      }
    }
  }

  return itemsData;
};
