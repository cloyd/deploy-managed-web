export const CANCEL = '@@app/property/CANCEL';
export const CREATE = '@@app/property/CREATE';
export const DESTROY = '@@app/property/DESTROY';
export const ARCHIVE = '@@app/property/ARCHIVE';
export const DESTROY_SUCCESS = '@@app/property/DESTROY_SUCCESS';
export const ARCHIVE_SUCCESS = '@@app/property/ARCHIVE_SUCCESS';
export const ERROR = '@@app/property/ERROR';
export const FETCH = '@@app/property/FETCH';
export const FETCH_ALL = '@@app/property/FETCH_ALL';
export const FETCH_ALL_SUCCESS = '@@app/property/FETCH_ALL_SUCCESS';
export const FETCH_FINANCIALS = '@@app/property/FETCH_FINANCIALS';
export const FETCH_FINANCIALS_SUCCESS =
  '@@app/property/FETCH_FINANCIALS_SUCCESS';
export const REMOVE_OWNER = '@@app/property/REMOVE_OWNER';
export const RESET_RESULTS = '@@app/property/RESET_RESULTS';
export const SUCCESS = '@@app/property/SUCCESS';
export const UPDATE = '@@app/property/UPDATE';
export const UPDATE_ATTACHMENTS = '@@app/property/UPDATE_ATTACHMENTS';
export const RESET_PROPERTY = '@@app/property/RESET_PROPERTY';
export const UNARCHIVE = '@@app/property/UNARCHIVE';
export const UNARCHIVE_SUCCESS = '@@app/property/UNARCHIVE_SUCCESS';
export const FETCH_TRANSACTIONS = '@@app/property/FETCH_TRANSACTIONS';
export const FETCH_TRANSACTIONS_SUCCESS =
  '@@app/property/FETCH_TRANSACTIONS_SUCCESS';
export const FETCH_FEE_AUDITS = '@@app/property/FETCH_FEE_AUDITS';
export const FETCH_FEE_AUDITS_SUCCESS =
  '@@app/property/FETCH_FEE_AUDITS_SUCCESS';

// Property consts
export const AUSTRALIA_STATES_TERRITORIES = Object.freeze({
  ACT: 'Australian Capital Territory',
  NSW: 'New South Wales',
  NT: 'Northern Territory',
  QLD: 'Queensland',
  SA: 'South Australia',
  TAS: 'Tasmania',
  VIC: 'Victoria',
  WA: 'Western Australia',
});

export const FEE_UNITS = Object.freeze(['% of annual rent', ' weeks rent']);

export const KEY_HOLDERS = Object.freeze([
  { name: 'agent', label: 'Agent' },
  { name: 'tenant', label: 'Tenant' },
  { name: 'owner', label: 'Owner' },
  { name: 'tradie', label: 'Tradie' },
]);

export const PROPERTY_ASPECTS = Object.freeze([
  { name: 'north', label: 'North' },
  { name: 'south', label: 'South' },
  { name: 'east', label: 'East' },
  { name: 'west', label: 'West' },
]);

export const PROPERTY_GAIN_REASON = Object.freeze({
  bdm: 'BDM',
  referral: 'Referral',
  sales_team: 'Sales team',
  agency_database: 'Agency database',
  existing_landlord: 'Existing landlord',
  other: 'Other',
});

export const PROPERTY_INCLUSIONS = Object.freeze([
  { label: 'Air con', name: 'airCon' },
  { label: 'Built-ins', name: 'builtIns' },
  { label: 'Balcony', name: 'balcony' },
  { label: 'Garden', name: 'garden' },
  { label: 'Internal laundry', name: 'internalLaundry' },
  { label: 'Gas cooking', name: 'gasCooking' },
  { label: 'Electric cooking', name: 'electricCooking' },
  { label: 'Dishwasher', name: 'dishwasher' },
  { label: 'Stairs', name: 'stairs' },
  { label: 'Lift', name: 'lift' },
]);

export const PROPERTY_LOST_REASON = Object.freeze({
  sold_by_us: 'Sold by us',
  owner_renovating: 'Owner renovating',
  lost_to_competitor: 'Lost to competitor',
  sold_by_another: 'Sold by another agent',
  owner_relative_moved_in: 'Owner/relative moved in',
  owner_self_managing: 'Owner self-managing',
  accidental_incomplete: 'Accidental/incomplete entry',
  other: 'Other',
});

export const PROPERTY_SPACES = Object.freeze([
  { label: 'Bedrooms', name: 'bedrooms', type: 'tel' },
  { label: 'Bathrooms', name: 'bathrooms', type: 'tel' },
  { label: 'Car Spaces', name: 'carSpaces', type: 'tel' },
]);

export const PROPERTY_STATUSES = Object.freeze(['active', 'pending', 'draft']);

export const PROPERTY_TYPES = Object.freeze([
  { name: 'residential', label: 'Residential' },
  { name: 'commercial', label: 'Commercial' },
]);

export const PROPERTY_CATEGORIES = Object.freeze([
  { name: 'house', label: 'House' },
  { name: 'unit', label: 'Unit' },
  { name: 'duplex', label: 'Duplex' },
  { name: 'semi', label: 'Semi' },
]);

export const COMMERCIAL_PROPERTY_CATEGORIES = Object.freeze([
  { name: 'office', label: 'Office' },
  { name: 'retail', label: 'Retail' },
  { name: 'industrial', label: 'Industrial' },
  { name: 'showroom', label: 'Showroom' },
  { name: 'land', label: 'Land' },
  { name: 'hotel', label: 'Hotel' },
  { name: 'consulting', label: 'Consulting' },
  { name: 'rural', label: 'Rural' },
  { name: 'other', label: 'Other' },
]);

export const DURATIONS = Object.freeze([
  'daily',
  'weekly',
  'fortnightly',
  'monthly',
  'yearly',
]);
