export const pluralize = (str, items) => {
  try {
    return items.length === 1 ? str : `${str}s`;
  } catch (e) {
    return str;
  }
};
