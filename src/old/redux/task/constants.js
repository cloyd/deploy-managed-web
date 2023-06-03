export const CREATE = '@@app/task/CREATE';
export const CREATE_MESSAGE = '@@app/task/CREATE_MESSAGE';
export const CREATE_QUOTE = '@@app/task/CREATE_QUOTE';
export const CREATE_SUCCESS = '@@app/task/CREATE_SUCCESS';
export const CANCEL = '@@app/task/CANCEL';
export const DESTROY = '@@app/task/DESTROY';
export const ARCHIVE = '@@app/task/ARCHIVE';
export const DESTROY_SUCCESS = '@@app/task/DESTROY_SUCCESS';
export const ARCHIVE_SUCCESS = '@@app/task/ARCHIVE_SUCCESS';
export const DONE = '@@app/task/DONE';
export const ERROR = '@@app/task/ERROR';
export const FETCH = '@@app/task/FETCH';
export const FETCH_ALL = '@@app/task/FETCH_ALL';
export const FETCH_ALL_PROPERTY = '@@app/task/FETCH_ALL_PROPERTY';
export const FETCH_ALL_SUCCESS = '@@app/task/FETCH_ALL_SUCCESS';
export const FETCH_BPAY_BILLERS = '@@app/task/FETCH_BPAY_BILLERS';
export const FETCH_MESSAGES = '@@app/task/FETCH_MESSAGES';
export const FETCH_MESSAGES_SUCCESS = '@@app/task/FETCH_MESSAGES_SUCCESS';
export const FETCH_META = '@@app/task/FETCH_META';
export const FETCH_META_SUCCESS = '@@app/task/FETCH_META_SUCCESS';
export const FETCH_SIMILAR = '@@app/task/FETCH_SIMILAR';
export const FETCH_SIMILAR_SUCCESS = '@@app/task/FETCH_SIMILAR_SUCCESS';
export const FETCH_TASK_ACTIVITIES = '@@app/task/FETCH_TASK_ACTIVITIES';
export const FETCH_TASK_ACTIVITIES_SUCCESS =
  '@@app/task/FETCH_TASK_ACTIVITIES_SUCCESS';
export const PAY = '@@app/task/PAY';
export const SEND_ENTRY_FORM = '@@app/task/SEND_ENTRY_FORM';
export const SEND_INVOICE = '@@app/task/SEND_INVOICE';
export const SUCCESS = '@@app/task/SUCCESS';
export const UPDATE = '@@app/task/UPDATE';
export const UPDATE_SUCCESS = '@@app/task/UPDATE_SUCCESS';
export const UPDATE_ATTACHMENTS = '@@app/task/UPDATE_ATTACHMENTS';

export const TYPE = {
  advertising: 'advertising',
  bill: 'bill',
  improvement: 'improvement',
  maintenance: 'maintenance',
  general: 'general',
};

export const BILLABLE_TYPES = [
  TYPE.advertising,
  TYPE.bill,
  TYPE.improvement,
  TYPE.maintenance,
];

export const DEFAULT_APPOINTMENT = Object.freeze({
  startsAt: undefined,
  endsAt: undefined,
});

export const DEFAULT_FOLLOWERS = Object.freeze([
  {
    label: 'Agency',
    value: 'agency',
    isFixed: true,
  },
]);

export const FORM_NINE_ENTRY_GROUNDS = Object.freeze({
  entryGroundFirst: 'Inspect the property (7 days notice)',
  entryGroundSecond:
    'Inspect the property – short tenancy moveable dwelling (24 hours notice)',
  entryGroundThird:
    'Carry out routine repairs or maintenance (24 hours notice)',
  entryGroundFourth:
    'Inspect completed repairs or maintenance (24 hours notice)',
  entryGroundFifth:
    'Comply with the Fire and Emergency Services (Domestic Smoke Alarms) Ammendment Act 2016 (Qld) in relation to smoke alarms (24 hours notice)',
  entryGroundSixth:
    'Comply with the Electrical Safety Act 2002 in relation to approved safety switches (24 hours notice)',
  entryGroundSeventh:
    'Show the property to a prospective purchaser or tenant (24 hours notice)',
  entryGroundEighth:
    'Allow a valuation of the property to be carried out (24 hours notice)',
  entryGroundNinth:
    ' The property owner/manager believes, on reasonable grounds, that the property has been abandoned (24 hours notice)',
  entryGroundTenth:
    'Check the tenant has remedied a significant breach, if a Notice to remedy breach (Form 11) has expired (24 hours notice)',
});

export const INSPECTION_TASK_TYPE = 'condition_report';

export const LOCATIONS = Object.freeze([
  'bedroom',
  'bathroom',
  'backyard',
  'frontyard',
  'kitchen',
  'laundry',
  'lounge_room',
  'roof',
  'toilet',
  'other',
]);

export const PRIORITIES = Object.freeze(['low', 'normal', 'high', 'emergency']);

export const STATUSES = Object.freeze({
  all: [],
  completed: ['completed'],
  incomplete: ['completed'],
});

export const INTENTION_STATUSES = Object.freeze({
  complete: { label: 'Completed', icon: 'completed' },
  failed: { label: 'Failed', icon: 'declined' },
  processing: { label: 'Processing', icon: 'scheduled' },
});

export const WAITING_ON_LABELS = Object.freeze([
  { value: 'agency', label: 'Agency' },
  { value: 'owner', label: 'Owner' },
  { value: 'tenant', label: 'Tenant' },
  { value: 'external_creditor', label: 'Tradie' },
]);

export const PARTY_TYPES = Object.freeze([
  { type: 'Agency', label: 'Agent' },
  { type: 'Owner', label: 'Owner' },
  { type: 'Tenant', label: 'Tenant' },
  { type: 'BpayBiller', label: 'BPay Biller' },
  { type: 'ExternalCreditor', label: 'External Creditor' },
]);
