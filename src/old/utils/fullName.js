export const fullName = (obj) => {
  if (!obj || obj.constructor !== Object) return '';

  const firstName = obj.firstName || obj.primaryContactFirstName;
  const lastName = obj.lastName || obj.primaryContactLastName;

  return firstName && lastName
    ? `${firstName} ${lastName}`
    : firstName && !lastName
    ? `${firstName}`
    : lastName && !firstName
    ? `${lastName}`
    : '';
};
