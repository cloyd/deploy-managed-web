export const selectArg = (_state, arg) => {
  return arg;
};

export const sliceById = (slice, id) => {
  return slice[id];
};

export const withDefault = (fn, defaultValue) => {
  if (typeof fn === 'function') {
    return (...args) => fn.apply(this, args) || defaultValue;
  }

  return defaultValue;
};
