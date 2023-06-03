export const fullAddress = (obj = {}) => {
  const { street, suburb, state, postcode } = obj;
  return `${street}, ${suburb}, ${state} ${postcode}`;
};
