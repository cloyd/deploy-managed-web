export const filterEmptyValues = (obj) =>
  Object.entries(obj).reduce(
    (a, [k, v]) => (v == null ? a : { ...a, [k]: v }),
    {}
  );
