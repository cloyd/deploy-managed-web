export const joinKey = (id, type) => `${id}::${type}`;
export const splitKey = (key = '') => key && key.split('::');
export const isSameKey =
  (key) =>
  ({ id, type }) =>
    joinKey(id, type) === key;
export const isNotSameKey =
  (key) =>
  ({ id, type }) =>
    joinKey(id, type) !== key;
