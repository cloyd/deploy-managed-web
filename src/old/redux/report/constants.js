import {
  lastMonth,
  lastQuarter,
  pastDay,
  pastWeek,
  thisFinancialYear,
} from '../../utils';

export const FILTER_PERIODS = Object.freeze({
  'past-day': pastDay(1),
  'past-week': pastWeek(1),
  'last-month': lastMonth(1),
  'last-quarter': lastQuarter(1),
  'this-financial-year': thisFinancialYear(1),
  custom: [],
});

export const FILTER_TYPES = Object.freeze(['manager', 'agency', 'group']);

export const FILTER_DATA_TYPES = Object.freeze({
  property: 'Property Data',
  lease: 'Lease Data',
  owner: 'Owner Data',
  tenant: 'Tenant Data',
});

export const FILTER_PROPERTY_TYPES = Object.freeze([
  'all',
  'residential',
  'commercial',
]);

export const FILTER_LEASE_STATUSES = Object.freeze([
  { label: 'Leased', value: 'active' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Expired', value: 'expired' },
  { label: 'Pending Activate', value: 'pending_activate' },
  {
    label: 'Pending Activate (Deposit paid)',
    value: 'pending_activate_due_to_deposit',
  },
]);

export const FILTER_OWNER_STATUSES = Object.freeze(['current', 'past']);

export const FILTER_TENANT_STATUSES = Object.freeze(['current', 'past']);

export const FILTER_ONBOARDING = Object.freeze(['yes', 'no']);
