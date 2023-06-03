export const getPagination = (state, key) => {
  return state.data[key] || {};
};
