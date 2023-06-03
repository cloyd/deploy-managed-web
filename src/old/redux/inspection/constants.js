export const INSPECTION_STATUS = Object.freeze({
  DRAFT: 'draft',
  PENDING_AGENCY: 'pending_agency',
  PENDING_TENANT: 'pending_tenant', // Only for Ingoing and Outgoing reports
  PENDING_UPLOAD: 'pending_upload', // For uploaded reports
  COMPLETED: 'completed',
  REJECTED: 'rejected',
});

export const INSPECTION_STATUS_LABELS = Object.freeze({
  draft: 'Draft',
  pending_agency: 'In progress',
  pending_tenant: 'Awaiting tenant',
  pending_upload: 'Awaiting upload',
  completed: 'Completed',
  rejected: 'Rejected',
});

export const INSPECTION_TYPE = Object.freeze({
  INGOING: 'ingoing',
  ROUTINE: 'routine',
  OUTGOING: 'outgoing',
});
