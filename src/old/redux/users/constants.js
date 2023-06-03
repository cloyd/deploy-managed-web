// Values are kebab case versions of store keys
export const USER_TYPES = Object.freeze({
  bpayBiller: 'bpay_biller',
  corporateUser: 'corporate_user',
  externalCreditor: 'external_creditor',
  manager: 'manager',
  owner: 'owner',
  principal: 'admin_manager',
  tenant: 'tenant',
});

// External creditor classifications
export const EXTERNAL_CREDITOR_CLASSIFICATIONS = Object.freeze({
  tradie: 'tradie',
  serviceProvider: 'service_provider',
  tenant: 'tenant',
});

export const EXTERNAL_CREDITOR_TYPES = Object.freeze({
  air_conditioning: 'Air Conditioning',
  appliance_repair: 'Appliance Repairer',
  arborists: 'Arborist',
  bathroom_renovation: 'Bathroom Renovator',
  blinds_and_curtains: 'Blinds & Curtains',
  bricklayer: 'Brick Layer',
  carpenter: 'Carpenter',
  cleaning: 'Cleaner',
  decking: 'Decking',
  demolition: 'Demolition',
  doors: 'Doors',
  electrical: 'Electrician',
  flooring: 'Flooring',
  garage_door: 'Garage Door',
  gardening_and_landscaping: 'Gardener',
  guttering: 'Guttering',
  handyman: 'Handyman',
  kitchens_and_joiners: 'Kitchens & Joiners',
  locksmith: 'Locksmith',
  new_appliances: 'New Appliances',
  painting: 'Painter',
  pest_control: 'Pest Control',
  plumbing: 'Plumber',
  pool_compliance: 'Pool Compliance',
  pool_maintenance: 'Pool Maintenance',
  roofing: 'Roofing',
  security: 'Security',
  smoke_alarm: 'Smoke Alarm',
  solar_power: 'Solar Power',
  tiling: 'Tiling',
  waterproofing: 'Waterproofing',
  windows_and_glass: 'Windows & Glass',
  other: 'Other',
});

// Task message visibility types
export const VISIBILITY_TYPES = Object.freeze([
  { label: 'All (agents/owners/tenants)', value: 'all' },
  { label: 'Agency', value: 'agency' },
  { label: 'Owners', value: 'owners' },
  { label: 'Tenants', value: 'tenants' },
]);

export const MARKETPLACE_FEE_OPTIONS = Object.freeze([
  { label: 'Agency covers fee', value: 'true' },
  { label: 'Tradie covers fee', value: 'false' },
]);
