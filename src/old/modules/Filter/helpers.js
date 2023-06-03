export const findItemById = (items = [], id) =>
  items.find((item) => Number(item.id) === Number(id));

export const findItemByValue = (values, value) =>
  values.find((item) => String(item.value) === String(value));
