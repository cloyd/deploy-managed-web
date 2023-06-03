export const hasDisbursementAccount = (user) =>
  ['externalcreditor', 'owner'].includes(user.type.toLowerCase()) ||
  user.isDisbursementAccountSet;

export const hasPaymentAccount = (user) =>
  user.type.toLowerCase() === 'owner' ||
  user.isDefaultPaymentAccountSet ||
  user.isDefaultMtechAccountSet ||
  user.isBpaySet;
