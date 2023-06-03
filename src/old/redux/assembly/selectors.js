import { createSelector } from '@reduxjs/toolkit';

// Matchers
const isDefault = (a) => a.isDefault;
const isNotDisbursement = (promisepayId) => (a) =>
  promisepayId ? a.promisepayId !== promisepayId : !a.isDisbursement;

export const getBankAccounts = (state) => {
  return state.banks.map((id) => state.data[id]);
};

// Bank Accounts keyed by bank account id
export const getBankAccountsKeyed = (state) => {
  return state.banks.reduce((accounts, id) => {
    const account = state.data[id];
    return { ...accounts, [account.id]: { ...account } };
  }, {});
};

export const getCardAccounts = (state) => {
  return state.cards.map((id) => state.data[id]);
};

// Card Accounts keyed by card account id
export const getCardAccountsKeyed = (state) => {
  return state.cards.reduce((accounts, id) => {
    const account = state.data[id];
    return { ...accounts, [account.id]: { ...account } };
  }, {});
};

// Account which receives payments
export const getDisbursementAccount = (state, props = {}) => {
  const promisepayId =
    props.ownerId && props.propertyId
      ? state.disbursements[`${props.ownerId}-${props.propertyId}`]
      : state.disbursements.default;

  return state.data[promisepayId];
};

export const getAvailableDisbursementAccounts = (state, props = {}) => {
  const { promisepayId } = props;
  const accounts = getBankAccounts(state);

  return promisepayId
    ? accounts.filter(isNotDisbursement(promisepayId))
    : accounts;
};

// Account to pay maintenance & repairs
export const getPaymentAccount = (state, props = {}) => {
  const promisepayAccount =
    state.payments[`${props.ownerId}-${props.propertyId}`];

  return getPaymentAccounts(state).find(
    promisepayAccount
      ? (a) => a.promisepayId === promisepayAccount.promisepayId
      : isDefault
  );
};

// Accounts which can be used for paying bills / rent / etc
export const getPaymentAccounts = (state) => {
  return [...getBankAccounts(state), ...getCardAccounts(state)];
};

export const hasBankAccount = (state) => {
  return state.banks.length > 0;
};

export const hasCardAccount = (state) => {
  return state.cards.length > 0;
};

export const hasDefaultAccount = (state) =>
  state.hasDefaultPayment || !!getPaymentAccount(state);

export const hasDisbursementAccount = (state) => {
  return !!getDisbursementAccount(state);
};

export const hasPaymentMethod = (state) => {
  return hasBankAccount(state) || hasCardAccount(state);
};

export const isBpayPayment = (state) => {
  return state.isPayByBpay;
};

// selectors
const selectAssembly = (state) => state.assembly;

export const selectAssemblyData = createSelector(
  selectAssembly,
  (assembly) => assembly.data
);

export const selectBankAccounts = createSelector(
  selectAssembly,
  selectAssemblyData,
  (assembly, data) => assembly.banks.map((id) => data[id])
);
