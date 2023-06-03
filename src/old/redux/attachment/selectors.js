export const getAttachment = (state, id) => {
  return state.data[id] || {};
};

export const getAttachments = (state) => {
  try {
    return state.results.map((id) => getAttachment(state, id));
  } catch (e) {
    return [];
  }
};
