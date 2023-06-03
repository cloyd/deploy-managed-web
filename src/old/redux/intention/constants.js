export const ADJUST_INTENTION = '@@app/intention/ADJUST_INTENTION';
export const ADJUST_INTENTION_SUCCESS =
  '@@app/intention/ADJUST_INTENTION_SUCCESS';
export const DESTROY_INTENTION = '@@app/intention/DESTROY_INTENTION';
export const DESTROY_INTENTION_SUCCESS =
  '@@app/intention/DESTROY_INTENTION_SUCCESS';
export const ERROR = '@@app/intention/ERROR';
export const FETCH = '@@app/intention/FETCH';
export const FETCH_SUCCESS = '@@app/intention/FETCH_SUCCESS';
export const FETCH_ALL = '@@app/intention/FETCH_ALL';
export const FETCH_ALL_SUCCESS = '@@app/intention/FETCH_ALL_SUCCESS';
export const PAY_INTENTION = '@@app/intention/PAY_INTENTION';
export const PAY_INTENTION_SUCCESS = '@@app/intention/PAY_INTENTION_SUCCESS';

export const PAYMENT_COMPLETE_STATUSES = [
  'completed',
  'in_escrow_tenant',
  'refunded',
];

export const PAYMENT_COMPLETE_FILTER = Object.freeze([
  { label: 'Upcoming Payment', value: 'false' },
  { label: 'Completed', value: 'true' },
]);

export const PAYMENT_METHODS = Object.freeze({
  bpay: 'Direct Payment',
  cc: 'Credit Card',
  dd: 'Bank Account',
  wallet: 'Wallet',
});

export const PAYMENT_TYPES = Object.freeze([
  { label: 'Task', value: 'task' },
  { label: 'Rent', value: 'rent,deposit,float_discharge' },
]);

export const PAYMENT_STATUS = Object.freeze([
  { label: 'Overdue', value: 'true' },
  { label: 'Not Overdue', value: 'false' },
]);
