import { PAYMENT_COMPLETE_STATUSES } from './constants';

// takes in isComplete as a bool or a string, e.g. true or 'true'
// returns ransack param for status field
export const intentionStatusRansackParam = (isComplete) =>
  typeof isComplete !== 'undefined'
    ? isComplete && isComplete !== 'false'
      ? { 'q[statusIn]': PAYMENT_COMPLETE_STATUSES }
      : { 'q[statusNotIn]': PAYMENT_COMPLETE_STATUSES }
    : {};
