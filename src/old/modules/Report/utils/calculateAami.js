export const calculateAami = (averageWeeklyRentCents, averageManagmentFee) =>
  (averageWeeklyRentCents / 100) * (averageManagmentFee / 100) * (365 / 7);
