export const ACTIVATE = '@@app/lease/ACTIVATE';
export const ADD_TENANT = '@@app/lease/ADD_TENANT';
export const CANCEL = '@@app/lease/CANCEL';
export const DISBURSE = '@@app/lease/DISBURSE';
export const ERROR = '@@app/lease/ERROR';
export const FETCH = '@@app/lease/FETCH';
export const FETCH_ALL = '@@app/lease/FETCH_ALL';
export const FETCH_ALL_SUCCESS = '@@app/lease/FETCH_ALL_SUCCESS';
export const FETCH_MODIFICATIONS = '@@app/lease/FETCH_MODIFICATIONS';
export const FETCH_MODIFICATIONS_SUCCESS =
  '@@app/lease/FETCH_MODIFICATIONS_SUCCESS';
export const MODIFY_RENT = '@@app/lease/MODIFY_RENT';
export const MODIFY_RENT_SUCCESS = '@@app/lease/MODIFY_RENT_SUCCESS';
export const SUCCESS = '@@app/lease/SUCCESS';
export const UPDATE = '@@app/lease/UPDATE';
export const UPDATE_ATTACHMENTS = '@@app/lease/UPDATE_ATTACHMENTS';
export const DISCHARGE_FLOAT = '@@app/lease/DISCHARGE_FLOAT';
export const DISCHARGE_FLOAT_SUCCESS = '@@app/lease/DISCHARGE_FLOAT_SUCCESS';
export const DISCHARGE_FLOAT_ERROR = '@@app/lease/DISCHARGE_FLOAT_ERROR';
export const FETCH_ACTIVATION_TASKS = '@@app/lease/FETCH_ACTIVATION_TASKS';
export const FETCH_ACTIVATION_TASKS_SUCCESS =
  '@@app/lease/FETCH_ACTIVATION_TASKS_SUCCESS';
export const FETCH_LEASE_LOG = '@@app/lease/FETCH_LEASE_LOG';
export const FETCH_LEASE_LOG_SUCCESS = '@@app/lease/FETCH_LEASE_LOG_SUCCESS';

export const TERMINATION_REASON = [
  'End of lease',
  'Early termination',
  'Eviction notice',
  'Hardship',
];

export const ADJUSTMENT_REASON = ['Rent review', 'Pre-scheduled change'];

export const FREQUENCY_DATES = [
  { label: '3 Months', value: '3' },
  { label: '6 Months', value: '6' },
  { label: '12 Months', value: '12' },
];

export const FREQUENCY_DEPOSITS = [
  { label: 'Weeks', value: 'weekly', multiplier: 5 },
  { label: 'Fortnights', value: 'fortnightly', multiplier: 3 },
  { label: 'Months', value: 'monthly', multiplier: 3 },
];

export const FREQUENCY_PAID = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Fortnightly', value: 'fortnightly' },
  { label: 'Monthly', value: 'monthly' },
];

export const LOG_PROPERTIES_WHITE_LIST = [
  'gstIncluded',
  'periodic',
  'tenantPaysWater',
  'status',
  'annualRentCents',
  'depositCents',
  'depositFrequency',
  'bondCents',
  'bondNumber',
  'endDate',
  'leaseStartDate',
  'tenantStartDate',
  'startDate',
  'reviewDate',
  'reviewDateFrequencyInMonths',
  'inspectionDate',
  'inspectionDateFrequencyInMonths',
  'terminationDate',
  'terminationReason',
];
